import { useEffect, useMemo } from "react";
import Button from "../../ui/Button";
import { IconPrint } from "../../icons/ToolIcons";
import {
  WEEKDAY_LONG,
  formatMonthYear,
  formatRollNumber,
  partitionCustomColumns,
  summarizeMonth,
} from "../../../utils/attendance";

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
  // Safety net for browsers that don't fire afterprint reliably.
  setTimeout(cleanup, 60_000);

  window.print();
}

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

  // Re-attach the afterprint cleanup on unmount as a safety net.
  useEffect(() => {
    return () => {
      document.getElementById("attendance-print-page-rule")?.remove();
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <p className="text-sm text-text-muted">
          Tip: click a date in the table header to toggle it as a holiday.
        </p>
        <Button onClick={printAttendanceSheet}>
          <IconPrint />
          Print attendance sheet
        </Button>
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
                const rowIndex = i + 1;
                return (
                  <tr key={i} className="attendance-sheet__row">
                    <td className="attendance-sheet__td sticky left-0 z-10 border border-border bg-white px-1 py-2 text-center text-text-muted">
                      {rowIndex}
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
                      const cellClass = [
                        "attendance-sheet__td-day",
                        "h-7 border border-border px-0 py-2 text-center align-middle",
                        d.isSunday && !isHoliday
                          ? "attendance-sheet__sunday bg-red-50/60"
                          : "",
                        isHoliday
                          ? "attendance-sheet__holiday bg-amber-100/80 font-semibold text-amber-900"
                          : "",
                      ].join(" ");
                      return (
                        <td key={d.dateISO} className={cellClass}>
                          {isHoliday ? "H" : ""}
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
                  <span className="font-mono font-bold">L</span> — Late
                </li>
                <li>
                  <span className="font-mono font-bold">H</span> — Holiday
                </li>
              </ul>
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
