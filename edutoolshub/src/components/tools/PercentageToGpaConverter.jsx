import { useCallback, useMemo, useState } from "react";
import { useTrackGenerateResult } from "../../utils/analytics";
import {
  CONVERSION_STATUS,
  GPA_SCALE_IDS,
  GPA_SCALES,
  buildPercentageReferenceRows,
  convertPercentageToGpa,
  formatPercentageToGpaText,
  sanitizePercentageInput,
} from "../../utils/percentageToGpa";
import { getDescriptorStyles, percentageToLetterGrade } from "../../utils/gpaToPercentage";
import Button from "../ui/Button";
import PercentageRing from "./gpa-percentage/PercentageRing";
import { inputClass, labelClass, sectionClass } from "./shared/toolFormStyles";

const SCALE_OPTIONS = Object.values(GPA_SCALES);

export default function PercentageToGpaConverter() {
  const [percentInput, setPercentInput] = useState("");
  const [scaleId, setScaleId] = useState(GPA_SCALE_IDS.SCALE_4);
  const [copyLabel, setCopyLabel] = useState("Copy Result");

  const result = useMemo(
    () => convertPercentageToGpa(percentInput, scaleId),
    [percentInput, scaleId]
  );

  const referenceRows = useMemo(() => buildPercentageReferenceRows(scaleId), [scaleId]);
  const showResult = result.status === CONVERSION_STATUS.VALID;
  const styles = showResult ? getDescriptorStyles(result.descriptor) : getDescriptorStyles("—");

  useTrackGenerateResult("Percentage to GPA Converter", showResult);

  const handleCopy = useCallback(async () => {
    const text = formatPercentageToGpaText(result);
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

  return (
    <div className="space-y-6">
      <section className={sectionClass}>
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label htmlFor="percentage-input" className={labelClass}>
              Percentage (%)
            </label>
            <input
              id="percentage-input"
              type="text"
              inputMode="decimal"
              className={result.errors?.percentage ? `${inputClass} border-red-300` : inputClass}
              value={percentInput}
              onChange={(e) => setPercentInput(sanitizePercentageInput(e.target.value))}
              placeholder="e.g. 85"
            />
            {result.errors?.percentage ? (
              <p className="mt-1 text-xs text-red-600">{result.errors.percentage}</p>
            ) : null}

            <fieldset className="mt-5">
              <legend className={labelClass}>Grading scale</legend>
              <div className="space-y-2">
                {SCALE_OPTIONS.map((scale) => (
                  <label
                    key={scale.id}
                    className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-surface-muted/40 px-4 py-3 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                  >
                    <input
                      type="radio"
                      name="scale"
                      value={scale.id}
                      checked={scaleId === scale.id}
                      onChange={() => setScaleId(scale.id)}
                      className="mt-1 accent-primary"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-text">{scale.label}</span>
                      <span className="mt-0.5 block text-xs text-text-muted">{scale.tooltip}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <div
            className={`rounded-2xl border p-6 ${styles.border} ${styles.bg} flex flex-col items-center justify-center text-center`}
          >
            {showResult ? (
              <>
                <PercentageRing percent={result.percentage} strokeColor={styles.ring} />
                <p className="mt-4 text-3xl font-bold text-text">{result.gpa}</p>
                <p className="text-sm font-medium text-text-muted">GPA on {result.scale.label}</p>
                <p className={`mt-2 text-sm font-semibold ${styles.text}`}>
                  {result.letterGrade} · {result.descriptor}
                </p>
                <Button variant="secondary" size="sm" className="mt-4" onClick={handleCopy}>
                  {copyLabel}
                </Button>
              </>
            ) : (
              <p className="text-sm text-text-muted">
                Enter a percentage between 0 and 100 to see the equivalent GPA.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <h2 className="text-lg font-semibold text-text">Reference table</h2>
        <p className="mt-1 text-sm text-text-muted">
          Common percentage to GPA mappings on the {GPA_SCALES[scaleId].label}.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[320px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-text-muted">
                <th className="py-2 pr-4 font-semibold">Percentage</th>
                <th className="py-2 pr-4 font-semibold">GPA</th>
                <th className="py-2 pr-4 font-semibold">Grade</th>
                <th className="py-2 font-semibold">Descriptor</th>
              </tr>
            </thead>
            <tbody>
              {referenceRows.map((row) => (
                <tr key={row.percentage} className="border-b border-border/60">
                  <td className="py-2 pr-4">{row.percentage}%</td>
                  <td className="py-2 pr-4 font-medium text-primary">{row.gpa}</td>
                  <td className="py-2 pr-4">{row.letterGrade}</td>
                  <td className="py-2">{row.descriptor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
