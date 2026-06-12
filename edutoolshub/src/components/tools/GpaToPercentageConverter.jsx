import { useCallback, useMemo, useState } from "react";
import { useTrackGenerateResult } from "../../utils/analytics";
import Button from "../ui/Button";
import PercentageRing from "./gpa-percentage/PercentageRing";
import {
  CONVERSION_STATUS,
  GPA_SCALE_IDS,
  GPA_SCALES,
  buildReferenceTableRows,
  convertGpaToPercentage,
  formatConversionResultText,
  getDescriptorStyles,
  sanitizeGpaInput,
} from "../../utils/gpaToPercentage";

const inputClass =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

const inputErrorClass =
  "w-full rounded-lg border border-red-300 bg-white px-3 py-2 text-sm text-text outline-none transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-500/20";

const labelClass = "mb-1 block text-sm font-medium text-text";

const SCALE_OPTIONS = Object.values(GPA_SCALES);

function ScaleTooltip({ text, id }) {
  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full border border-border bg-white text-[11px] font-bold text-text-muted transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-describedby={id}
        aria-label="About this grading scale"
      >
        ?
      </button>
      <span
        id={id}
        role="tooltip"
        className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 hidden w-64 -translate-x-1/2 rounded-lg border border-border bg-white px-3 py-2 text-xs leading-relaxed text-text-muted shadow-lg group-hover:block group-focus-within:block sm:w-72"
      >
        {text}
      </span>
    </span>
  );
}

export default function GpaToPercentageConverter() {
  const [gpaInput, setGpaInput] = useState("");
  const [scaleId, setScaleId] = useState(GPA_SCALE_IDS.SCALE_4);
  const [copyLabel, setCopyLabel] = useState("Copy Result");

  const result = useMemo(
    () => convertGpaToPercentage(gpaInput, scaleId),
    [gpaInput, scaleId]
  );

  const referenceRows = useMemo(
    () => buildReferenceTableRows(scaleId),
    [scaleId]
  );

  const styles =
    result.status === CONVERSION_STATUS.VALID
      ? getDescriptorStyles(result.descriptor)
      : getDescriptorStyles("—");

  const showResult = result.status === CONVERSION_STATUS.VALID;

  useTrackGenerateResult("GPA to Percentage Converter", showResult);

  const handleGpaChange = (e) => {
    setGpaInput(sanitizeGpaInput(e.target.value));
  };

  const handleReset = () => {
    setGpaInput("");
    setScaleId(GPA_SCALE_IDS.SCALE_4);
    setCopyLabel("Copy Result");
  };

  const handleCopy = useCallback(async () => {
    const text = formatConversionResultText(result);
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopyLabel("Copied!");
      setTimeout(() => setCopyLabel("Copy Result"), 2000);
    } catch {
      setCopyLabel("Copy failed");
      setTimeout(() => setCopyLabel("Copy Result"), 2000);
    }
  }, [result]);

  const scale = result.scale;
  const gpaError = result.errors?.gpa;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-white to-accent/5 p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          How this tool works
        </p>
        <h2 className="mt-1 text-xl font-bold text-text sm:text-2xl">
          Convert GPA to percentage instantly
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-text-muted">
          Different schools and countries use different GPA scales. Pick yours, enter
          your GPA, and see the equivalent percentage, letter grade, and a short
          performance summary — updated as you type.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-text-muted">
          <li>
            <strong className="font-medium text-text">4.0 scale</strong> — (GPA ÷ 4) × 100
            (US standard).
          </li>
          <li>
            <strong className="font-medium text-text">5.0 scale</strong> — (GPA ÷ 5) × 100.
          </li>
          <li>
            <strong className="font-medium text-text">10.0 scale</strong> — GPA × 9.5
            (common in India and South Asia).
          </li>
        </ul>
      </section>

      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-lg font-semibold text-text">Your GPA</h2>
        <p className="mt-1 text-sm text-text-muted">
          Choose a grading scale and enter your GPA. Results update in real time.
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="group sm:col-span-2">
            <label htmlFor="gpa-scale" className={labelClass}>
              Grading scale
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <select
                id="gpa-scale"
                value={scaleId}
                onChange={(e) => setScaleId(e.target.value)}
                className={inputClass}
                aria-describedby="gpa-scale-hint"
              >
                {SCALE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ScaleTooltip text={scale.tooltip} id="scale-tooltip-active" />
            </div>
            <p id="gpa-scale-hint" className="mt-1.5 text-xs leading-relaxed text-text-muted">
              {scale.tooltip}
            </p>
          </div>

          <div>
            <label htmlFor="gpa-value" className={labelClass}>
              GPA (out of {scale.maxGpa})
            </label>
            <input
              id="gpa-value"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={gpaInput}
              onChange={handleGpaChange}
              placeholder={`e.g. ${scale.maxGpa === 10 ? "8.5" : "3.75"}`}
              className={gpaError ? inputErrorClass : inputClass}
              aria-invalid={gpaError ? "true" : undefined}
              aria-describedby={`gpa-value-hint${gpaError ? " gpa-value-error" : ""}`}
            />
            <p id="gpa-value-hint" className="mt-1.5 text-xs leading-relaxed text-text-muted">
              Enter a value between 0 and {scale.maxGpa}.
            </p>
            {gpaError && (
              <p
                id="gpa-value-error"
                className="mt-1 text-xs font-medium text-red-600"
                role="alert"
              >
                {gpaError}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-end gap-3 sm:justify-end">
            <Button variant="secondary" size="md" onClick={handleReset} type="button">
              Reset / Clear
            </Button>
          </div>
        </div>
      </section>

      <section
        className={`rounded-2xl border p-6 shadow-sm transition-all duration-300 sm:p-8 ${styles.border} ${styles.bg} ${
          showResult ? "gpa-result-enter opacity-100" : ""
        }`}
        aria-live="polite"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          <div className="flex shrink-0 justify-center lg:w-48">
            {showResult ? (
              <PercentageRing
                percent={result.percentage}
                strokeColor={styles.ring}
                label="Percentage"
              />
            ) : (
              <PercentageRing percent={null} strokeColor="#cbd5e1" label="Percentage" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-3">
              <div
                className={`mt-1.5 h-3 w-3 shrink-0 rounded-full ${styles.accent}`}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold uppercase tracking-wide text-text-muted">
                  Result
                </p>

                {result.status === CONVERSION_STATUS.INCOMPLETE && (
                  <p className={`mt-2 text-base ${styles.text}`}>
                    Enter your GPA above to see the percentage equivalent and letter grade.
                  </p>
                )}

                {result.status === CONVERSION_STATUS.INVALID && (
                  <p className={`mt-2 text-base ${styles.text}`}>
                    Fix the highlighted field to convert your GPA to a percentage.
                  </p>
                )}

                {showResult && (
                  <div className="gpa-result-enter">
                    <p className={`mt-2 text-3xl font-bold sm:text-4xl ${styles.text}`}>
                      {result.percentage}%
                      <span className="ml-3 text-xl font-semibold sm:text-2xl">
                        {result.letterGrade}
                      </span>
                    </p>
                    <p className="mt-1 text-sm font-medium text-text-muted">
                      {result.descriptor} performance
                    </p>

                    <div
                      className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-white/80"
                      role="progressbar"
                      aria-valuenow={result.percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="Percentage visual bar"
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${Math.min(100, result.percentage)}%`,
                          backgroundColor: styles.ring,
                        }}
                      />
                    </div>

                    <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-xl border border-border/60 bg-white/70 px-4 py-3">
                        <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                          GPA
                        </dt>
                        <dd className="mt-1 text-2xl font-bold text-text">
                          {result.gpa}{" "}
                          <span className="text-sm font-normal text-text-muted">
                            / {scale.maxGpa}
                          </span>
                        </dd>
                      </div>
                      <div className="rounded-xl border border-border/60 bg-white/70 px-4 py-3">
                        <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                          Percentage
                        </dt>
                        <dd className="mt-1 text-2xl font-bold text-text">
                          {result.percentage}%
                        </dd>
                      </div>
                      <div className="rounded-xl border border-border/60 bg-white/70 px-4 py-3">
                        <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                          Letter grade
                        </dt>
                        <dd className="mt-1 text-2xl font-bold text-text">
                          {result.letterGrade}
                        </dd>
                      </div>
                      <div className="rounded-xl border border-border/60 bg-white/70 px-4 py-3">
                        <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                          Descriptor
                        </dt>
                        <dd className="mt-1 text-2xl font-bold text-text">
                          {result.descriptor}
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button
                        variant="primary"
                        size="md"
                        onClick={handleCopy}
                        type="button"
                        aria-label="Copy conversion result to clipboard"
                      >
                        {copyLabel}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-lg font-semibold text-text">Reference table</h2>
        <p className="mt-1 text-sm text-text-muted">
          Sample GPA values on the <strong className="font-medium text-text">{scale.label}</strong>{" "}
          with their percentage and grade equivalents.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
            <caption className="sr-only">
              GPA to percentage reference for {scale.label}
            </caption>
            <thead>
              <tr className="border-b border-border bg-surface-muted">
                <th scope="col" className="px-4 py-3 font-semibold text-text">
                  GPA
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-text">
                  Percentage
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-text">
                  Grade
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-text">
                  Descriptor
                </th>
              </tr>
            </thead>
            <tbody>
              {referenceRows.map((row) => (
                <tr
                  key={row.gpa}
                  className="border-b border-border/80 transition-colors hover:bg-primary/5"
                >
                  <td className="px-4 py-2.5 font-medium text-text">{row.gpa}</td>
                  <td className="px-4 py-2.5 text-text-muted">{row.percentage}%</td>
                  <td className="px-4 py-2.5 text-text-muted">{row.letterGrade}</td>
                  <td className="px-4 py-2.5 text-text-muted">{row.descriptor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
