import { useCallback, useMemo, useState } from "react";
import { useTrackGenerateResult } from "../../utils/analytics";
import InstituteDetailsForm from "./attendance/InstituteDetailsForm";
import MonthYearPicker from "./attendance/MonthYearPicker";
import StudentsForm from "./attendance/StudentsForm";
import CustomColumnsForm from "./attendance/CustomColumnsForm";
import HolidayPicker from "./attendance/HolidayPicker";
import HolidayDialog from "./attendance/HolidayDialog";
import AttendanceSheetPreview from "./attendance/AttendanceSheetPreview";
import {
  buildMonthDays,
  buildRoster,
  parseStudentNames,
} from "../../utils/attendance";

const TODAY = new Date();

const INITIAL_DIALOG = {
  open: false,
  mode: "add",
  dateISOs: [],
  initialReason: null,
};

export default function AttendanceGenerator() {
  const [institute, setInstitute] = useState({
    name: "",
    address: "",
    logoDataUrl: "",
    logoFileName: "",
  });

  const [classInfo, setClassInfo] = useState({
    className: "",
    section: "",
    subject: "",
    lecturer: "",
    academicYear: "",
  });

  const [year, setYear] = useState(TODAY.getFullYear());
  const [monthIndex, setMonthIndex] = useState(TODAY.getMonth());

  const [studentText, setStudentText] = useState("");
  const [blankRows, setBlankRows] = useState(25);
  const [extraBlankRows, setExtraBlankRows] = useState(0);
  const [showRollNumberColumn, setShowRollNumberColumn] = useState(false);
  const [startingRollNumber, setStartingRollNumber] = useState(1);
  const [rollNumberPrefix, setRollNumberPrefix] = useState("");
  const [rollNumberPadding, setRollNumberPadding] = useState(0);

  // User-defined extra columns ({ id, title, position }). Each renders
  // either before or after the date grid on the printed sheet.
  const [customColumns, setCustomColumns] = useState([]);

  // Holidays are stored as a Map<dateISO, reason>. Using a Map (instead
  // of the previous Set) lets each holiday carry a label that gets
  // printed vertically inside the column header.
  const [holidayMap, setHolidayMap] = useState(() => new Map());

  /** When true, day cells are clickable (P / A / L) and % column is calculated. */
  const [liveMarking, setLiveMarking] = useState(false);
  /** Map keyed by `${rowIndex}-${dateISO}` → P | A | L */
  const [marks, setMarks] = useState(() => ({}));

  // Dialog state for the holiday-reason modal.
  const [dialog, setDialog] = useState(INITIAL_DIALOG);

  const handleYearChange = useCallback((nextYear) => {
    setYear(nextYear);
    setMarks({});
  }, []);

  const handleMonthChange = useCallback((nextMonth) => {
    setMonthIndex(nextMonth);
    setMarks({});
  }, []);

  const days = useMemo(
    () => buildMonthDays(year, monthIndex),
    [year, monthIndex]
  );

  const enteredCount = useMemo(
    () => parseStudentNames(studentText).length,
    [studentText]
  );

  const roster = useMemo(
    () =>
      buildRoster({
        text: studentText,
        extraBlankRows,
        blankRows,
      }),
    [studentText, extraBlankRows, blankRows]
  );

  const hasSheetOutput = Boolean(
    institute.name.trim() ||
      classInfo.className.trim() ||
      studentText.trim()
  );

  useTrackGenerateResult("Attendance Sheet Generator", hasSheetOutput, "print");

  /** Open the dialog targeting a single date — add or edit based on state. */
  const requestHolidayForDate = useCallback(
    (dateISO) => {
      setDialog({
        open: true,
        mode: holidayMap.has(dateISO) ? "edit" : "add",
        dateISOs: [dateISO],
        initialReason: null,
      });
    },
    [holidayMap]
  );

  /** Open the dialog with no preselected dates (bulk add). */
  const requestBulkHolidays = useCallback(() => {
    setDialog({
      open: true,
      mode: "add",
      dateISOs: [],
      initialReason: null,
    });
  }, []);

  /** "Mark all Saturdays" preset — opens the dialog with Saturdays
   *  preselected and a friendly default reason for confirmation. */
  const requestMarkAllSaturdays = useCallback(() => {
    const saturdayISOs = days
      .filter((d) => d.weekday === 6)
      .map((d) => d.dateISO);
    if (saturdayISOs.length === 0) return;
    setDialog({
      open: true,
      mode: "add",
      dateISOs: saturdayISOs,
      initialReason: "Weekend",
    });
  }, [days]);

  const closeDialog = useCallback(() => setDialog(INITIAL_DIALOG), []);

  const saveHolidayDialog = useCallback(({ dateISOs, reason }) => {
    setHolidayMap((prev) => {
      const next = new Map(prev);
      for (const iso of dateISOs) next.set(iso, reason);
      return next;
    });
    setDialog(INITIAL_DIALOG);
  }, []);

  const removeHolidayDialog = useCallback((dateISOs) => {
    setHolidayMap((prev) => {
      const next = new Map(prev);
      for (const iso of dateISOs) next.delete(iso);
      return next;
    });
    setDialog(INITIAL_DIALOG);
  }, []);

  const clearHolidaysForMonth = useCallback(() => {
    setHolidayMap((prev) => {
      const next = new Map(prev);
      for (const d of days) next.delete(d.dateISO);
      return next;
    });
  }, [days]);

  const setMark = useCallback((rowIndex, dateISO, value) => {
    const key = `${rowIndex}-${dateISO}`;
    setMarks((prev) => {
      const next = { ...prev };
      if (!value) delete next[key];
      else next[key] = value;
      return next;
    });
  }, []);

  const clearMarks = useCallback(() => setMarks({}), []);

  return (
    <div className="space-y-6">
      <InstituteDetailsForm
        institute={institute}
        onInstituteChange={setInstitute}
        classInfo={classInfo}
        onClassInfoChange={setClassInfo}
      />

      <MonthYearPicker
        year={year}
        monthIndex={monthIndex}
        onYearChange={handleYearChange}
        onMonthChange={handleMonthChange}
      />

      <StudentsForm
        studentText={studentText}
        onStudentTextChange={setStudentText}
        blankRows={blankRows}
        onBlankRowsChange={setBlankRows}
        extraBlankRows={extraBlankRows}
        onExtraBlankRowsChange={setExtraBlankRows}
        showRollNumberColumn={showRollNumberColumn}
        onShowRollNumberColumnChange={setShowRollNumberColumn}
        startingRollNumber={startingRollNumber}
        onStartingRollNumberChange={setStartingRollNumber}
        rollNumberPrefix={rollNumberPrefix}
        onRollNumberPrefixChange={setRollNumberPrefix}
        rollNumberPadding={rollNumberPadding}
        onRollNumberPaddingChange={setRollNumberPadding}
        enteredCount={enteredCount}
        rosterLength={roster.length}
      />

      <CustomColumnsForm
        columns={customColumns}
        onColumnsChange={setCustomColumns}
      />

      <HolidayPicker
        days={days}
        holidayMap={holidayMap}
        onRequestEdit={requestHolidayForDate}
        onBulkAdd={requestBulkHolidays}
        onMarkAllSaturdays={requestMarkAllSaturdays}
        onClear={clearHolidaysForMonth}
      />

      <AttendanceSheetPreview
        institute={institute}
        classInfo={classInfo}
        monthIndex={monthIndex}
        year={year}
        days={days}
        holidayMap={holidayMap}
        roster={roster}
        showRollNumberColumn={showRollNumberColumn}
        startingRollNumber={startingRollNumber}
        rollNumberPrefix={rollNumberPrefix}
        rollNumberPadding={rollNumberPadding}
        customColumns={customColumns}
        onRequestHoliday={requestHolidayForDate}
        liveMarking={liveMarking}
        onLiveMarkingChange={setLiveMarking}
        marks={marks}
        onSetMark={setMark}
        onClearMarks={clearMarks}
      />

      <HolidayDialog
        open={dialog.open}
        mode={dialog.mode}
        days={days}
        selectedDateISOs={dialog.dateISOs}
        holidayMap={holidayMap}
        initialReason={dialog.initialReason}
        onClose={closeDialog}
        onSave={saveHolidayDialog}
        onRemove={removeHolidayDialog}
      />
    </div>
  );
}
