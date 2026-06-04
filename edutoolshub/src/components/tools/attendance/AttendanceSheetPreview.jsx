import { useCallback, useEffect, useMemo } from "react";
import Button from "../../ui/Button";
import { IconPrint } from "../../icons/ToolIcons";
import {
  WEEKDAY_LONG,
  ATTENDANCE_MARKS,
  attendanceMarkKey,
  calculateRowAttendancePercent,
  cycleAttendanceMark,
  formatAttendancePercent,
  formatMonthYear,
  formatRollNumber,
  partitionCustomColumns,
  resolveAttendanceMark,
  summarizeMonth,
} from "../../../utils/attendance";
import {
  buildAttendanceExportFilename,
  buildAttendanceExportTable,
  exportAttendanceCsv,
  exportAttendanceExcel,
} from "../../../utils/attendanceExport";

/**
 * Injects a one-shot landscape @page rule so the wide attendance grid
 * prints across the full A4 page, then removes it after the print
 * dialog closes. Doing this inline (vs. global CSS) avoids fighting
 * with the portrait @page that the GPA report relies on.
 */
function printAttendanceSheet() {
  const id = "attendance-print-page-rule";
  const existing = document.getElementById(id);
  if (existing) existing.remove();

  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @page { size: A4 landscape; margin: 8mm 8mm 10mm 8mm; }
  `;
  document.head.appendChild(style);

  const cleanup = () => {
    document.getElementById(id)?.remove();
    window.removeEventListener("afterprint", cleanup);
  };
  window.addEventListener("afterprint", cleanup);
  setTimeout(cleanup, 60_000);

  window.print();
}

const MARK_CELL_CLASS = {
  [ATTENDANCE_MARKS.PRESENT]: "font-bold text-emerald-700",
  [ATTENDANCE_MARKS.ABSENT]: "font-bold text-red-700",
  [ATTENDANCE_MARKS.LEAVE]: "font-bold text-blue-700",
  [ATTENDANCE_MARKS.HOLIDAY]: "font-bold text-amber-900",
};

export default function AttendanceSheetPreview({
  institute,
  classInfo,
  monthIndex,
  year,
  days,
  holidayMap,
  roster,
  showRollNumberColumn,
  startingRollNumber,
  rollNumberPrefix,
  rollNumberPadding,
  customColumns,
  onRequestHoliday,
  liveMarking,
  onLiveMarkingChange,
  marks,
  onSetMark,
  onClearMarks,
}) {
  const summary = useMemo(
    () => summarizeMonth(days, holidayMap),
    [days, holidayMap]
  );

  const { before: beforeColumns, after: afterColumns } = useMemo(
    () => partitionCustomColumns(customColumns ?? []),
    [customColumns]
  );

  const rollOptions = useMemo(
    () => ({
      prefix: rollNumberPrefix,
      start: startingRollNumber,
      padding: rollNumberPadding,
    }),
    [rollNumberPrefix, startingRollNumber, rollNumberPadding]
  );

  const monthLabel = formatMonthYear(year, monthIndex);

  const headerMeta = [
    classInfo.className && { label: "Class", value: classInfo.className },
    classInfo.section && { label: "Section", value: classInfo.section },
    classInfo.subject && { label: "Subject", value: classInfo.subject },
    classInfo.lecturer && { label: "Teacher", value: classInfo.lecturer },
    classInfo.academicYear && { label: "Term", value: classInfo.academicYear },
    { label: "Period", value: monthLabel },
  ].filter(Boolean);

  const exportContext = useMemo(
    () => ({
      roster,
      days,
      holidayMap,
      marks,
      showRollNumberColumn,
      rollOptions,
      customColumns,
      includePercent: liveMarking,
    }),
    [
      roster,
      days,
      holidayMap,
      marks,
      showRollNumberColumn,
      rollOptions,
      customColumns,
      liveMarking,
    ]
  );

  const handleExportCsv = useCallback(() => {
    const table = buildAttendanceExportTable(exportContext);
    const filename = buildAttendanceExportFilename({
      instituteName: institute.name,
      className: classInfo.className,
      year,
      monthIndex,
      extension: "csv",
    });
    exportAttendanceCsv(table, filename);
  }, [exportContext, institute.name, classInfo.className, year, monthIndex]);

  const handleExportExcel = useCallback(() => {
    const table = buildAttendanceExportTable(exportContext);
    const filename = buildAttendanceExportFilename({
      instituteName: institute.name,
      className: classInfo.className,
      year,
      monthIndex,
      extension: "xls",
    });
    exportAttendanceExcel(table, filename, monthLabel);
  }, [exportContext, institute.name, classInfo.className, year, monthIndex, monthLabel]);

  const handleDayCellClick = useCallback(
    (rowIndex, day, isEditable) => {
      if (!liveMarking || !isEditable) return;
      const key = attendanceMarkKey(rowIndex, day.dateISO);
      const current = marks[key] ?? "";
      const next = cycleAttendanceMark(current);
      onSetMark(rowIndex, day.dateISO, next);
    },
    [liveMarking, marks, onSetMark]
  );

  useEffect(() => {
    return () => {
      document.getElementById("attendance-print-page-rule")?.remove();
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="space-y-3 print:hidden">
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-muted/50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-text">Sheet mode</p>
            <p className="mt-0.5 text-xs text-text-muted">
              Blank sheet: empty day cells for handwriting. Live marking: click
              cells to set P, A, or L — holidays stay H.
            </p>
          </div>
          <div
            className="inline-flex rounded-xl border border-border bg-white p-1 shadow-sm"
            role="group"
            aria-label="Attendance sheet mode"
          >
            <button
              type="button"
              onClick={() => onLiveMarkingChange(false)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                !liveMarking
                  ? "bg-primary text-white shadow-sm"
                  : "text-text-muted hover:text-text"
              }`}
            >
              Blank sheet
            </button>
            <button
              type="button"
              onClick={() => onLiveMarkingChange(true)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                liveMarking
                  ? "bg-primary text-white shadow-sm"
                  : "text-text-muted hover:text-text"
              }`}
            >
              Mark live
            </button>
          </div>
        </div>

        {liveMarking && (
          <p className="text-xs text-text-muted">
            Click a day cell to cycle: empty → P (Present) → A (Absent) → L
            (Leave). Column holidays are always H.{" "}
            <button
              type="button"
              onClick={onClearMarks}
              className="font-semibold text-primary underline-offset-2 hover:underline"
            >
              Clear all marks
            </button>
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-text-muted">
            Tip: click a date in the table header to toggle it as a holiday.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={handleExportCsv}>
              Export CSV
            </Button>
            <Button variant="secondary" size="sm" onClick={handleExportExcel}>
              Export Excel
            </Button>
            <Button variant="secondary" size="sm" onClick={printAttendanceSheet}>
              <IconPrint />
              Save as PDF
            </Button>
            <Button size="sm" onClick={printAttendanceSheet}>
              <IconPrint />
              Print sheet
            </Button>
          </div>
        </div>
      </div>

      <article
        id="attendance-print"
        className="attendance-sheet rounded-2xl border border-border bg-white p-3 shadow-sm sm:p-5 lg:p-8 print:border-0 print:shadow-none print:p-0"
      >
        <header className="attendance-sheet__header border-b-2 border-text pb-4">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            {institute.logoDataUrl ? (
              <img
                src={institute.logoDataUrl}
                alt={`${institute.name || "Institute"} logo`}
                className="h-16 w-16 shrink-0 object-contain sm:h-20 sm:w-20"
              />
            ) : (
              <span className="hidden h-20 w-20 shrink-0 sm:block" aria-hidden />
            )}

            <div className="text-center sm:flex-1">
              <h2 className="text-xl font-bold uppercase tracking-[0.18em] text-text sm:text-2xl">
                {institute.name || "Class Attendance Register"}
              </h2>
              {institute.address && (
                <p className="mt-1 whitespace-pre-line text-xs text-text-muted sm:text-sm">
                  {institute.address}
                </p>
              )}
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.32em] text-text-muted">
                Attendance Sheet · {monthLabel}
              </p>
            </div>

            <span className="hidden h-20 w-20 shrink-0 sm:block" aria-hidden />
          </div>

          {headerMeta.length > 0 && (
            <dl className="attendance-sheet__meta mt-4 grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs sm:grid-cols-3 lg:grid-cols-6">
              {headerMeta.map((item) => (
                <div key={item.label} className="flex gap-1.5">
                  <dt className="font-semibold uppercase tracking-wider text-text-muted">
                    {item.label}:
                  </dt>
                  <dd className="font-medium text-text">{item.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </header>

        <div className="attendance-sheet__table-wrap mt-4 overflow-x-auto print:overflow-visible">
          <table className="attendance-sheet__table w-full border-collapse text-[11px] sm:text-xs">
            <thead>
              <tr>
                <th
                  rowSpan={2}
                  className="attendance-sheet__th sticky left-0 z-10 w-8 border border-border bg-surface-muted px-1 py-2 text-center font-semibold text-text"
                >
                  #
                </th>
                {showRollNumberColumn && (
                  <th
                    rowSpan={2}
                    className="attendance-sheet__th min-w-[88px] border border-border bg-surface-muted px-2 py-2 text-center font-semibold text-text"
                  >
                    Roll&nbsp;No
                  </th>
                )}
                <th
                  rowSpan={2}
                  className="attendance-sheet__th min-w-[140px] border border-border bg-surface-muted px-3 py-2 text-left font-semibold text-text"
                >
                  Student name
                </th>
                {beforeColumns.map((col) => (
                  <th
                    key={`bef-${col.id}`}
                    rowSpan={2}
                    className="attendance-sheet__th attendance-sheet__th-custom min-w-[90px] border border-border bg-surface-muted px-2 py-2 text-center font-semibold text-text"
                  >
                    {col.title}
                  </th>
                ))}
                {days.map((d) => {
                  const reason = holidayMap.get(d.dateISO);
                  const isHoliday = reason !== undefined;
                  const cellClass = [
                    "attendance-sheet__th-day",
                    "h-[88px] w-7 cursor-pointer border border-border px-0 align-middle text-center font-semibold text-text transition-colors",
                    d.isSunday && !isHoliday
                      ? "attendance-sheet__sunday bg-red-50 text-red-700"
                      : "",
                    isHoliday ? "attendance-sheet__holiday bg-amber-100 text-amber-900" : "",
                    !d.isSunday && !isHoliday ? "bg-surface-muted" : "",
                  ].join(" ");
                  return (
                    <th
                      key={d.dateISO}
                      onClick={() => onRequestHoliday(d.dateISO)}
                      className={cellClass}
                      title={
                        isHoliday
                          ? `${WEEKDAY_LONG[d.weekday]} ${d.day} · ${reason} — click to edit`
                          : `${WEEKDAY_LONG[d.weekday]} ${d.day} — click to mark as holiday`
                      }
                      scope="col"
                    >
                      <div className="flex h-full flex-col items-center justify-start gap-1 py-1">
                        <span className="block leading-none">{d.day}</span>
                        {isHoliday ? (
                          <span
                            className="attendance-holiday-label inline-block leading-none"
                            aria-label={`Holiday reason: ${reason}`}
                          >
                            {reason}
                          </span>
                        ) : d.isSunday ? (
                          <span className="attendance-sunday-label inline-block leading-none">
                            SUNDAY
                          </span>
                        ) : null}
                      </div>
                    </th>
                  );
                })}
                {afterColumns.map((col) => (
                  <th
                    key={`aft-${col.id}`}
                    rowSpan={2}
                    className="attendance-sheet__th attendance-sheet__th-custom min-w-[90px] border border-border bg-surface-muted px-2 py-2 text-center font-semibold text-text"
                  >
                    {col.title}
                  </th>
                ))}
                <th
                  rowSpan={2}
                  className="attendance-sheet__th attendance-sheet__th-percent min-w-[72px] border border-border bg-surface-muted px-2 py-2 text-center font-semibold text-text"
                >
                  Attendance&nbsp;%
                </th>
              </tr>
              <tr>
                {days.map((d) => {
                  const isHoliday = holidayMap.has(d.dateISO);
                  const cellClass = [
                    "attendance-sheet__th-weekday",
                    "border border-border px-0 py-1 text-center text-[10px] font-semibold uppercase tracking-wider",
                    d.isSunday && !isHoliday
                      ? "attendance-sheet__sunday bg-red-50 text-red-700"
                      : "",
                    isHoliday ? "attendance-sheet__holiday bg-amber-100 text-amber-900" : "",
                    !d.isSunday && !isHoliday ? "bg-surface-muted text-text-muted" : "",
                  ].join(" ");
                  return (
                    <th key={`${d.dateISO}-wd`} className={cellClass}>
                      {d.weekdayShort}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {roster.map((student, i) => {
                const rowIndex = i;
                const rowNum = i + 1;
                const percent = liveMarking
                  ? calculateRowAttendancePercent({
                      rowIndex,
                      days,
                      holidayMap,
                      marks,
                    })
                  : null;
                return (
                  <tr key={i} className="attendance-sheet__row">
                    <td className="attendance-sheet__td sticky left-0 z-10 border border-border bg-white px-1 py-2 text-center text-text-muted">
                      {rowNum}
                    </td>
                    {showRollNumberColumn && (
                      <td className="attendance-sheet__td border border-border px-2 py-2 text-center font-mono text-text">
                        {formatRollNumber(i, rollOptions)}
                      </td>
                    )}
                    <td className="attendance-sheet__td attendance-sheet__name border border-border px-3 py-2 text-text">
                      {student.name ? (
                        student.name
                      ) : (
                        <span className="text-text-muted/40">
                          ____________________
                        </span>
                      )}
                    </td>
                    {beforeColumns.map((col) => (
                      <td
                        key={`bef-${col.id}-${i}`}
                        className="attendance-sheet__td attendance-sheet__td-custom border border-border px-2 py-2 text-center text-text-muted/40"
                      >
                        ____
                      </td>
                    ))}
                    {days.map((d) => {
                      const isHoliday = holidayMap.has(d.dateISO);
                      const isSunday = d.isSunday;
                      const isEditable = liveMarking && !isHoliday && !isSunday;
                      const mark = liveMarking
                        ? resolveAttendanceMark({
                            rowIndex,
                            dateISO: d.dateISO,
                            marks,
                            holidayMap,
                            day: d,
                          })
                        : isHoliday
                          ? ATTENDANCE_MARKS.HOLIDAY
                          : "";
                      const cellClass = [
                        "attendance-sheet__td-day",
                        "h-7 border border-border px-0 py-2 text-center align-middle",
                        isSunday && !isHoliday
                          ? "attendance-sheet__sunday bg-red-50/60"
                          : "",
                        isHoliday
                          ? "attendance-sheet__holiday bg-amber-100/80"
                          : "",
                        isEditable
                          ? "cursor-pointer hover:bg-primary/5 print:cursor-default"
                          : "",
                      ].join(" ");
                      return (
                        <td
                          key={d.dateISO}
                          className={cellClass}
                          onClick={() => handleDayCellClick(rowIndex, d, isEditable)}
                          title={
                            isEditable
                              ? "Click to cycle: P → A → L → clear"
                              : undefined
                          }
                          role={isEditable ? "button" : undefined}
                          tabIndex={isEditable ? 0 : undefined}
                          onKeyDown={
                            isEditable
                              ? (e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    handleDayCellClick(rowIndex, d, isEditable);
                                  }
                                }
                              : undefined
                          }
                        >
                          {mark ? (
                            <span
                              className={
                                MARK_CELL_CLASS[mark] ?? "font-bold text-text"
                              }
                            >
                              {mark}
                            </span>
                          ) : null}
                        </td>
                      );
                    })}
                    {afterColumns.map((col) => (
                      <td
                        key={`aft-${col.id}-${i}`}
                        className="attendance-sheet__td attendance-sheet__td-custom border border-border px-2 py-2 text-center text-text-muted/40"
                      >
                        ____
                      </td>
                    ))}
                    <td className="attendance-sheet__td attendance-sheet__td-percent border border-border px-2 py-2 text-center font-semibold tabular-nums text-text">
                      {liveMarking ? formatAttendancePercent(percent) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <footer className="attendance-sheet__footer mt-5 border-t border-border pt-4 text-xs">
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <p className="font-semibold uppercase tracking-wider text-text-muted">
                Legend
              </p>
              <ul className="mt-1 space-y-0.5 text-text">
                <li>
                  <span className="font-mono font-bold">P</span> — Present
                </li>
                <li>
                  <span className="font-mono font-bold">A</span> — Absent
                </li>
                <li>
                  <span className="font-mono font-bold">L</span> — Leave
                </li>
                <li>
                  <span className="font-mono font-bold">H</span> — Holiday
                </li>
              </ul>
              {liveMarking && (
                <p className="mt-2 text-[10px] text-text-muted">
                  Attendance % = Present ÷ (Present + Absent) on working days
                  only. Leave, Sunday, and holidays are excluded.
                </p>
              )}
            </div>
            <div>
              <p className="font-semibold uppercase tracking-wider text-text-muted">
                Month summary
              </p>
              <ul className="mt-1 space-y-0.5 text-text">
                <li>Total days: {summary.total}</li>
                <li>Sundays: {summary.sundays}</li>
                <li>Holidays: {summary.holidays}</li>
                <li>Working days: {summary.workingDays}</li>
              </ul>
            </div>
            <div className="sm:text-right">
              <p className="font-semibold uppercase tracking-wider text-text-muted">
                Signatures
              </p>
              <div className="mt-6 inline-block w-48 border-t border-text pt-1 text-center">
                Teacher
              </div>
              <div className="mt-4 inline-block w-48 border-t border-text pt-1 text-center sm:ml-4">
                Principal
              </div>
            </div>
          </div>

          <p className="attendance-sheet__credit mt-4 text-center text-[10px] text-text-muted">
            Generated with EduToolsHub · edutoolshub.com
          </p>
        </footer>
      </article>
    </div>
  );
}
