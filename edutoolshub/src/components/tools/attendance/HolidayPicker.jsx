import { WEEKDAY_LONG } from "../../../utils/attendance";

/**
 * Per-date chip grid for marking holidays. Sundays are visually flagged
 * but remain togglable — some calendars (e.g. when Sunday is a working
 * day) need that flexibility, and toggling on a Sunday still counts as a
 * holiday for the summary.
 *
 * Clicking a chip never mutates state directly anymore — it always calls
 * `onRequestEdit(dateISO)` so the parent can open the holiday-reason
 * dialog. `onBulkAdd` opens the same dialog with no preselection.
 */
export default function HolidayPicker({
  days,
  holidayMap,
  onRequestEdit,
  onBulkAdd,
  onMarkAllSaturdays,
  onClear,
}) {
  const holidayCount = days.filter(
    (d) => holidayMap.has(d.dateISO) && !d.isSunday
  ).length;

  return (
    <section className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8 print:hidden">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-text">Holidays</h2>
          <p className="mt-1 text-sm text-text-muted">
            Click any date to mark it as a holiday. You’ll be asked for a
            reason, which is printed vertically inside the holiday column.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onBulkAdd}
            className="rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
          >
            + Bulk add holidays
          </button>
          <button
            type="button"
            onClick={onMarkAllSaturdays}
            className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-text transition-colors hover:border-primary/40 hover:text-primary"
          >
            Mark all Saturdays
          </button>
          <button
            type="button"
            onClick={onClear}
            disabled={holidayCount === 0}
            className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-text transition-colors hover:border-red-300 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear holidays
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded bg-red-100 ring-1 ring-red-300" />
          Sunday
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded bg-amber-100 ring-1 ring-amber-300" />
          Holiday
        </span>
        <span className="ml-auto font-medium text-text">
          {holidayCount} custom holiday{holidayCount === 1 ? "" : "s"} this month
        </span>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-2 sm:grid-cols-10 lg:grid-cols-11">
        {days.map((d) => {
          const reason = holidayMap.get(d.dateISO);
          const isHoliday = reason !== undefined;
          const base =
            "group relative flex flex-col items-center justify-center rounded-lg border px-1 py-2 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";
          let palette;
          if (isHoliday) {
            palette =
              "border-amber-300 bg-amber-100 text-amber-900 hover:bg-amber-200";
          } else if (d.isSunday) {
            palette =
              "border-red-200 bg-red-50 text-red-700 hover:bg-red-100";
          } else {
            palette =
              "border-border bg-white text-text hover:border-primary/40 hover:text-primary";
          }
          return (
            <button
              key={d.dateISO}
              type="button"
              onClick={() => onRequestEdit(d.dateISO)}
              className={`${base} ${palette}`}
              aria-pressed={isHoliday}
              aria-label={`${WEEKDAY_LONG[d.weekday]} ${d.day}${
                isHoliday ? ` — holiday: ${reason}` : " — mark as holiday"
              }`}
              title={
                isHoliday
                  ? `${WEEKDAY_LONG[d.weekday]} ${d.day} · ${reason}`
                  : `${WEEKDAY_LONG[d.weekday]} ${d.day}`
              }
            >
              <span className="text-base font-bold leading-none">{d.day}</span>
              <span className="mt-0.5 text-[10px] uppercase tracking-wider opacity-75">
                {d.weekdayShort}
              </span>
              {isHoliday && (
                <span className="mt-1 max-w-full truncate px-0.5 text-[9px] font-semibold uppercase tracking-wider text-amber-800">
                  {reason}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
