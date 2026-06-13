import { MONTHS, getYearOptions } from "../../../utils/attendance";

const selectClass =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

const labelClass = "mb-1 block text-sm font-medium text-text";

export default function MonthYearPicker({
  year,
  monthIndex,
  onYearChange,
  onMonthChange,
}) {
  const years = getYearOptions(5);

  return (
    <section className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8 print:hidden">
      <h2 className="text-lg font-semibold text-text">Month &amp; year</h2>
      <p className="mt-1 text-sm text-text-muted">
        Pick the month and year you want to generate the attendance sheet for.
        Sundays are highlighted automatically.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="att-month" className={labelClass}>
            Month
          </label>
          <select
            id="att-month"
            value={monthIndex}
            onChange={(e) => onMonthChange(Number(e.target.value))}
            className={selectClass}
          >
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="att-year" className={labelClass}>
            Year
          </label>
          <select
            id="att-year"
            value={year}
            onChange={(e) => onYearChange(Number(e.target.value))}
            className={selectClass}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
