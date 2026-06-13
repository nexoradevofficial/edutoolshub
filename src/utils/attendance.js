/**
 * Pure helpers for the Attendance Sheet generator.
 * No React / DOM dependencies so this stays trivially testable.
 */

export const MONTHS = [
  { value: 0, label: "January", short: "Jan" },
  { value: 1, label: "February", short: "Feb" },
  { value: 2, label: "March", short: "Mar" },
  { value: 3, label: "April", short: "Apr" },
  { value: 4, label: "May", short: "May" },
  { value: 5, label: "June", short: "Jun" },
  { value: 6, label: "July", short: "Jul" },
  { value: 7, label: "August", short: "Aug" },
  { value: 8, label: "September", short: "Sep" },
  { value: 9, label: "October", short: "Oct" },
  { value: 10, label: "November", short: "Nov" },
  { value: 11, label: "December", short: "Dec" },
];

export const WEEKDAY_SHORT = ["S", "M", "T", "W", "T", "F", "S"];
export const WEEKDAY_LONG = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/** Years to expose in the year picker — current year ±5 by default. */
export function getYearOptions(span = 5) {
  const current = new Date().getFullYear();
  const years = [];
  for (let y = current - span; y <= current + span; y++) years.push(y);
  return years;
}

/** Total days in a given (year, monthIndex 0–11). */
export function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

/**
 * Stable ISO key (YYYY-MM-DD) used as the canonical identifier for a day —
 * also what gets stored in the holidays Set so it can be compared across
 * month/year changes without ambiguity.
 */
export function isoDateKey(year, monthIndex, day) {
  const m = String(monthIndex + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

/**
 * Build the day array used by both the holiday picker and the printed sheet.
 *
 * Returns one entry per day of the chosen month with:
 *   - day          1-indexed day-of-month
 *   - dateISO      stable key for holiday set lookups
 *   - weekday      0 (Sun) – 6 (Sat)
 *   - weekdayShort one-letter weekday label
 *   - weekdayLong  full weekday name
 *   - isSunday     convenience flag
 */
export function buildMonthDays(year, monthIndex) {
  const total = daysInMonth(year, monthIndex);
  const days = [];
  for (let day = 1; day <= total; day++) {
    const date = new Date(year, monthIndex, day);
    const weekday = date.getDay();
    days.push({
      day,
      dateISO: isoDateKey(year, monthIndex, day),
      weekday,
      weekdayShort: WEEKDAY_SHORT[weekday],
      weekdayLong: WEEKDAY_LONG[weekday],
      isSunday: weekday === 0,
    });
  }
  return days;
}

/** Split a textarea blob into trimmed, non-empty student names. */
export function parseStudentNames(text) {
  if (!text) return [];
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Combine entered names with optional extra blank rows.
 * - When names are provided, we return them as-is plus `extraBlankRows`
 *   trailing blanks (useful for late additions).
 * - When no names are entered, we return `blankRows` empty strings so the
 *   teacher can hand-write them on the printed sheet.
 */
export function buildRoster({
  text,
  extraBlankRows = 0,
  blankRows = 25,
}) {
  const named = parseStudentNames(text);
  const cappedExtras = clamp(extraBlankRows, 0, 60);
  if (named.length > 0) {
    return [
      ...named.map((name) => ({ name, filled: true })),
      ...Array.from({ length: cappedExtras }, () => ({ name: "", filled: false })),
    ];
  }
  return Array.from({ length: clamp(blankRows, 1, 60) }, () => ({
    name: "",
    filled: false,
  }));
}

export function clamp(value, min, max) {
  if (Number.isNaN(value) || value === null || value === undefined) return min;
  return Math.min(Math.max(value, min), max);
}

/** Format a month/year pair for display: "March 2026". */
export function formatMonthYear(year, monthIndex) {
  const month = MONTHS[monthIndex]?.label ?? "";
  return `${month} ${year}`;
}

/** Allowed logo upload constraints. */
export const LOGO_MAX_BYTES = 1.5 * 1024 * 1024; // 1.5 MB
export const LOGO_MIME_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

export function validateLogoFile(file) {
  if (!file) return { ok: false, error: "No file selected." };
  if (!LOGO_MIME_TYPES.includes(file.type)) {
    return {
      ok: false,
      error: "Unsupported file type. Use PNG, JPG, WEBP, or SVG.",
    };
  }
  if (file.size > LOGO_MAX_BYTES) {
    return {
      ok: false,
      error: "File is too large. Keep the logo under 1.5 MB.",
    };
  }
  return { ok: true };
}

/** Promise-based wrapper around FileReader for data URL reads. */
export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error("Read failed"));
    reader.readAsDataURL(file);
  });
}

/**
 * Format a roll number for the n-th student (0-indexed) using the
 * teacher-configured prefix, starting number, and optional zero-padding.
 *
 *   formatRollNumber(0, { prefix: "STU-", start: 1, padding: 3 })
 *   // => "STU-001"
 *
 *   formatRollNumber(4, { prefix: "23-CS-", start: 101, padding: 0 })
 *   // => "23-CS-105"
 */
export function formatRollNumber(index, options = {}) {
  const { prefix = "", start = 1, padding = 0 } = options;
  const base = (Number(start) || 0) + (Number(index) || 0);
  const numericPart =
    padding > 0 ? String(base).padStart(padding, "0") : String(base);
  return `${prefix}${numericPart}`;
}

/** Allowed insertion positions for user-defined columns. */
export const CUSTOM_COLUMN_POSITIONS = {
  BEFORE: "before",
  AFTER: "after",
};

/** Build a fresh, empty custom column with a stable id. */
export function createCustomColumn(overrides = {}) {
  return {
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `col-${Date.now()}-${Math.floor(Math.random() * 1e9)}`,
    title: "",
    position: CUSTOM_COLUMN_POSITIONS.AFTER,
    ...overrides,
  };
}

/**
 * Split a list of custom columns into the two render slots used by the
 * preview component. Columns with empty titles are dropped from the
 * rendered output but kept in state so the user can still edit them.
 */
export function partitionCustomColumns(columns) {
  const before = [];
  const after = [];
  for (const col of columns) {
    const title = col.title?.trim();
    if (!title) continue;
    const item = { ...col, title };
    if (col.position === CUSTOM_COLUMN_POSITIONS.BEFORE) before.push(item);
    else after.push(item);
  }
  return { before, after };
}

/**
 * Compute the working-day / holiday / Sunday counts for the chosen month.
 *
 * `holidayContainer` is any object that exposes `.has(dateISO)` — a Set
 * works just as well as a Map<dateISO, reason>, which is what the
 * current UI uses to also carry a per-holiday label.
 */
export function summarizeMonth(days, holidayContainer) {
  let workingDays = 0;
  let sundays = 0;
  let holidays = 0;
  for (const d of days) {
    const isHoliday = holidayContainer.has(d.dateISO);
    if (d.isSunday) sundays++;
    if (isHoliday && !d.isSunday) holidays++;
    if (!d.isSunday && !isHoliday) workingDays++;
  }
  return { workingDays, sundays, holidays, total: days.length };
}

/** Default fallback reason used when a holiday has no label. */
export const DEFAULT_HOLIDAY_REASON = "Holiday";

/**
 * Curated quick-reason presets that cover the most common school
 * holidays worldwide. The dialog renders these as one-click chips,
 * and the input still accepts any free-form text for local holidays.
 */
/** Attendance marks used on the live sheet and exports. */
export const ATTENDANCE_MARKS = {
  PRESENT: "P",
  ABSENT: "A",
  HOLIDAY: "H",
  LEAVE: "L",
};

/** Cycle order for clickable day cells (H comes from column holidays only). */
export const ATTENDANCE_MARK_CYCLE = [
  "",
  ATTENDANCE_MARKS.PRESENT,
  ATTENDANCE_MARKS.ABSENT,
  ATTENDANCE_MARKS.LEAVE,
];

export function attendanceMarkKey(rowIndex, dateISO) {
  return `${rowIndex}-${dateISO}`;
}

export function cycleAttendanceMark(current) {
  const idx = ATTENDANCE_MARK_CYCLE.indexOf(current ?? "");
  const next = idx < 0 ? 0 : (idx + 1) % ATTENDANCE_MARK_CYCLE.length;
  return ATTENDANCE_MARK_CYCLE[next];
}

/**
 * Resolve the mark shown in a day cell.
 * Column holidays always render as H; user marks apply on working days.
 */
export function resolveAttendanceMark({
  rowIndex,
  dateISO,
  marks,
  holidayMap,
  day,
}) {
  if (holidayMap.has(dateISO)) return ATTENDANCE_MARKS.HOLIDAY;
  if (day?.isSunday) return "";
  return marks[attendanceMarkKey(rowIndex, dateISO)] ?? "";
}

/**
 * Attendance % for a student row when marking live.
 * Denominator = present + absent on working days (Sundays, holidays, and leave excluded).
 */
export function calculateRowAttendancePercent({ rowIndex, days, holidayMap, marks }) {
  let present = 0;
  let absent = 0;
  for (const d of days) {
    if (d.isSunday || holidayMap.has(d.dateISO)) continue;
    const mark = marks[attendanceMarkKey(rowIndex, d.dateISO)] ?? "";
    if (mark === ATTENDANCE_MARKS.PRESENT) present++;
    else if (mark === ATTENDANCE_MARKS.ABSENT) absent++;
  }
  const counted = present + absent;
  if (counted === 0) return null;
  return Math.round((present / counted) * 100);
}

export function formatAttendancePercent(value) {
  if (value === null || value === undefined) return "—";
  return `${value}%`;
}

export const HOLIDAY_REASON_PRESETS = [
  "Public Holiday",
  "Christmas",
  "New Year",
  "Easter",
  "Thanksgiving",
  "Independence Day",
  "Mid-Term Break",
  "Spring Break",
  "Snow Day",
  "Teacher Training",
  "Sports Day",
  "School Event",
];
