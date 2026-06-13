import {
  formatAttendancePercent,
  formatMonthYear,
  formatRollNumber,
  calculateRowAttendancePercent,
  partitionCustomColumns,
  resolveAttendanceMark,
  summarizeMonth,
} from "./attendance.js";

function escapeCsvCell(value) {
  const str = value == null ? "" : String(value);
  if (/[",\n\r]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

/**
 * Build tabular rows for CSV / Excel export (header + body).
 */
export function buildAttendanceExportTable({
  roster,
  days,
  holidayMap,
  marks,
  showRollNumberColumn,
  rollOptions,
  customColumns,
  includePercent,
}) {
  const { before: beforeColumns, after: afterColumns } = partitionCustomColumns(
    customColumns ?? []
  );
  const summary = summarizeMonth(days, holidayMap);

  const header = ["#"];
  if (showRollNumberColumn) header.push("Roll No");
  header.push("Student name");
  for (const col of beforeColumns) header.push(col.title);
  for (const d of days) {
    const reason = holidayMap.get(d.dateISO);
    header.push(
      reason
        ? `${d.day} (${d.weekdayShort}) H`
        : `${d.day} (${d.weekdayShort})`
    );
  }
  for (const col of afterColumns) header.push(col.title);
  if (includePercent) header.push("Attendance %");

  const body = roster.map((student, i) => {
    const rowIndex = i;
    const row = [String(i + 1)];
    if (showRollNumberColumn) {
      row.push(formatRollNumber(i, rollOptions));
    }
    row.push(student.name || "");
    for (const col of beforeColumns) row.push("");
    for (const d of days) {
      row.push(
        resolveAttendanceMark({
          rowIndex,
          dateISO: d.dateISO,
          marks,
          holidayMap,
          day: d,
        })
      );
    }
    for (const col of afterColumns) row.push("");
    if (includePercent) {
      const pct = calculateRowAttendancePercent({
        rowIndex,
        days,
        holidayMap,
        marks,
      });
      row.push(formatAttendancePercent(pct));
    }
    return row;
  });

  const meta = [
    [],
    ["Month summary"],
    ["Total days", summary.total],
    ["Sundays", summary.sundays],
    ["Holidays", summary.holidays],
    ["Working days", summary.workingDays],
    [],
    ["Legend", "P = Present", "A = Absent", "L = Leave", "H = Holiday"],
  ];

  return { header, body, meta };
}

export function exportAttendanceCsv(table, filename) {
  const lines = [
    table.header.map(escapeCsvCell).join(","),
    ...table.body.map((row) => row.map(escapeCsvCell).join(",")),
    ...table.meta.map((row) => row.map(escapeCsvCell).join(",")),
  ];
  const blob = new Blob(["\uFEFF" + lines.join("\r\n")], {
    type: "text/csv;charset=utf-8",
  });
  downloadBlob(filename, blob);
}

/** Excel-compatible export via HTML table (opens in Excel without extra deps). */
export function exportAttendanceExcel(table, filename, sheetTitle) {
  const escapeHtml = (v) =>
    String(v ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  const thead = `<tr>${table.header.map((h) => `<th>${escapeHtml(h)}</th>`).join("")}</tr>`;
  const tbody = table.body
    .map(
      (row) =>
        `<tr>${row.map((c) => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`
    )
    .join("");
  const meta = table.meta
    .map(
      (row) =>
        `<tr>${row.map((c) => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
<head><meta charset="UTF-8"><title>${escapeHtml(sheetTitle)}</title></head>
<body>
<table border="1">
<thead>${thead}</thead>
<tbody>${tbody}</tbody>
<tbody>${meta}</tbody>
</table>
</body>
</html>`;

  const blob = new Blob([html], {
    type: "application/vnd.ms-excel;charset=utf-8",
  });
  downloadBlob(filename, blob);
}

export function buildAttendanceExportFilename({
  instituteName,
  className,
  year,
  monthIndex,
  extension,
}) {
  const slug = (s) =>
    (s || "attendance")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40);
  const month = formatMonthYear(year, monthIndex)
    .toLowerCase()
    .replace(/\s+/g, "-");
  return `${slug(instituteName)}-${slug(className)}-${month}.${extension}`;
}
