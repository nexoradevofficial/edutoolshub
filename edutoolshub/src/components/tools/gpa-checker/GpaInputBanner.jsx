const inputClass =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

export default function GpaInputBanner({ value, onChange, scale = 4.0 }) {
  return (
    <section className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-white to-accent/5 p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Your GPA
          </p>
          <h2 className="mt-1 text-xl font-bold text-text sm:text-2xl">
            Enter your GPA to see match results
          </h2>
          <p className="mt-2 max-w-xl text-sm text-text-muted">
            Compare your GPA against minimum and average admitted GPAs across{" "}
            {scale.toFixed(1)} scale universities worldwide. Data verified from
            official Common Data Sets — Updated 2026.
          </p>
        </div>
        <div className="w-full sm:max-w-xs">
          <label htmlFor="student-gpa" className="mb-1 block text-sm font-medium text-text">
            Your GPA (out of {scale.toFixed(1)})
          </label>
          <input
            id="student-gpa"
            type="number"
            min="0"
            max={scale}
            step="0.01"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`e.g. 3.75`}
            className={inputClass}
          />
        </div>
      </div>
    </section>
  );
}
