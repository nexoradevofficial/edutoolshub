import { formatRollNumber } from "../../../utils/attendance";

const inputClass =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

const labelClass = "mb-1 block text-sm font-medium text-text";

export default function StudentsForm({
  studentText,
  onStudentTextChange,
  blankRows,
  onBlankRowsChange,
  extraBlankRows,
  onExtraBlankRowsChange,
  showRollNumberColumn,
  onShowRollNumberColumnChange,
  startingRollNumber,
  onStartingRollNumberChange,
  rollNumberPrefix,
  onRollNumberPrefixChange,
  rollNumberPadding,
  onRollNumberPaddingChange,
  enteredCount,
  rosterLength,
}) {
  const rollOptions = {
    prefix: rollNumberPrefix,
    start: startingRollNumber,
    padding: rollNumberPadding,
  };
  const firstRoll = formatRollNumber(0, rollOptions);
  const lastIndex = Math.max(0, rosterLength - 1);
  const lastRoll = formatRollNumber(lastIndex, rollOptions);

  return (
    <section className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8 print:hidden">
      <h2 className="text-lg font-semibold text-text">Students</h2>
      <p className="mt-1 text-sm text-text-muted">
        Add one student name per line. Leave the box empty to print a blank
        sheet with hand-writing rows instead.
      </p>

      <div className="mt-4">
        <label htmlFor="att-students" className={labelClass}>
          Student names (one per line)
        </label>
        <textarea
          id="att-students"
          rows={7}
          placeholder={"Alice Smith\nBob Jones\nCarol Lee"}
          value={studentText}
          onChange={(e) => onStudentTextChange(e.target.value)}
          className={`${inputClass} resize-y font-mono`}
        />
        <p className="mt-2 text-xs text-text-muted">
          {enteredCount > 0
            ? `${enteredCount} student${enteredCount === 1 ? "" : "s"} added.`
            : "No names entered — a blank sheet will be generated."}
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {enteredCount > 0 ? (
          <div>
            <label htmlFor="att-extra-rows" className={labelClass}>
              Extra blank rows (after named students)
            </label>
            <input
              id="att-extra-rows"
              type="number"
              min={0}
              max={30}
              value={extraBlankRows}
              onChange={(e) =>
                onExtraBlankRowsChange(Number(e.target.value) || 0)
              }
              className={inputClass}
            />
            <p className="mt-1 text-xs text-text-muted">
              Useful for late admissions you’ll add by hand.
            </p>
          </div>
        ) : (
          <div>
            <label htmlFor="att-blank-rows" className={labelClass}>
              Number of blank rows
            </label>
            <input
              id="att-blank-rows"
              type="number"
              min={1}
              max={60}
              value={blankRows}
              onChange={(e) => onBlankRowsChange(Number(e.target.value) || 1)}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-text-muted">
              Between 1 and 60 rows. Default 25 fits one printed page well.
            </p>
          </div>
        )}

        <div>
          <span className={labelClass}>Roll number column</span>
          <label className="mt-2 flex cursor-pointer items-start gap-2 rounded-lg border border-border bg-surface-muted/60 p-3">
            <input
              type="checkbox"
              checked={showRollNumberColumn}
              onChange={(e) => onShowRollNumberColumnChange(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm text-text">
              Add a Roll&nbsp;No column
              <span className="block text-xs text-text-muted">
                Auto-numbered using the prefix, starting number, and padding
                below.
              </span>
            </span>
          </label>
        </div>
      </div>

      {showRollNumberColumn && (
        <div className="mt-4 rounded-xl border border-primary/15 bg-primary/5 p-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="att-roll-prefix" className={labelClass}>
                Prefix (optional)
              </label>
              <input
                id="att-roll-prefix"
                type="text"
                placeholder="e.g. STU- or 23-CS-"
                value={rollNumberPrefix}
                onChange={(e) => onRollNumberPrefixChange(e.target.value)}
                className={inputClass}
                maxLength={16}
              />
            </div>
            <div>
              <label htmlFor="att-start-roll" className={labelClass}>
                Starting number
              </label>
              <input
                id="att-start-roll"
                type="number"
                min={0}
                max={999999}
                value={startingRollNumber}
                onChange={(e) =>
                  onStartingRollNumberChange(Number(e.target.value) || 0)
                }
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="att-roll-padding" className={labelClass}>
                Zero-pad to (digits)
              </label>
              <input
                id="att-roll-padding"
                type="number"
                min={0}
                max={6}
                value={rollNumberPadding}
                onChange={(e) =>
                  onRollNumberPaddingChange(Number(e.target.value) || 0)
                }
                className={inputClass}
              />
              <p className="mt-1 text-xs text-text-muted">0 = no padding</p>
            </div>
          </div>

          {rosterLength > 0 && (
            <p className="mt-3 text-xs text-text">
              <span className="font-semibold uppercase tracking-wider text-text-muted">
                Preview:&nbsp;
              </span>
              <span className="font-mono">{firstRoll}</span>
              {rosterLength > 1 && (
                <>
                  {" → "}
                  <span className="font-mono">{lastRoll}</span>
                  <span className="ml-2 text-text-muted">
                    ({rosterLength} row{rosterLength === 1 ? "" : "s"})
                  </span>
                </>
              )}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
