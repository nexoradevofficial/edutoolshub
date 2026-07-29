/**
 * Renders a Sanity contentTable block with customizable header color,
 * rounded corners, and zebra-striped body rows.
 */

function normalizeHex(hex) {
  if (typeof hex !== "string") return null;
  const trimmed = hex.trim();
  if (!/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(trimmed)) return null;
  if (trimmed.length === 4) {
    const [, r, g, b] = trimmed;
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  return trimmed.toLowerCase();
}

function contrastingTextColor(hex) {
  const normalized = normalizeHex(hex);
  if (!normalized) return "#ffffff";
  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#0f172a" : "#ffffff";
}

const DEFAULT_HEADER = "#1e3a5f";

export default function ContentTable({ value }) {
  const headers = Array.isArray(value?.headers) ? value.headers : [];
  const rows = Array.isArray(value?.rows) ? value.rows : [];
  if (headers.length === 0 && rows.length === 0) return null;

  const headerBg = normalizeHex(value?.headerColor) || DEFAULT_HEADER;
  const headerFg = contrastingTextColor(headerBg);
  const colCount = Math.max(
    headers.length,
    ...rows.map((row) => (Array.isArray(row?.cells) ? row.cells.length : 0)),
    1
  );

  const paddedHeaders = Array.from({ length: colCount }, (_, i) => headers[i] ?? "");

  return (
    <div className="my-8 overflow-x-auto sm:my-10">
      <div className="overflow-hidden rounded-xl border border-border shadow-sm">
        <table className="w-full min-w-[28rem] border-collapse text-left text-sm sm:text-[0.9375rem]">
          <thead>
            <tr>
              {paddedHeaders.map((label, i) => (
                <th
                  key={`h-${i}`}
                  scope="col"
                  className="px-4 py-3 font-semibold sm:px-5"
                  style={{ backgroundColor: headerBg, color: headerFg }}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => {
              const cells = Array.isArray(row?.cells) ? row.cells : [];
              const padded = Array.from({ length: colCount }, (_, i) => cells[i] ?? "");
              const zebra = rowIndex % 2 === 1;
              return (
                <tr
                  key={row._key || `r-${rowIndex}`}
                  className={zebra ? "bg-slate-50" : "bg-white"}
                >
                  {padded.map((cell, cellIndex) => (
                    <td
                      key={`c-${rowIndex}-${cellIndex}`}
                      className="border-t border-border px-4 py-3 text-text sm:px-5"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
