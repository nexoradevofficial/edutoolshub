import {
  PRESET_SCALES,
  SCALE_MAX,
  SCALE_MIN,
  formatScaleMax,
  parseCustomScaleMax,
} from "../../../services/gpa";

const inputClass =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

export default function ScaleSelector({
  value,
  onChange,
  recommendedScale,
  countryName,
}) {
  const parsed = parseCustomScaleMax(value);
  const showError = value !== "" && !parsed.valid;

  return (
    <div className="mt-6">
      <label className="mb-1 block text-sm font-semibold text-text">
        School GPA scale (maximum)
      </label>
      <p className="mb-3 text-xs text-text-muted">
        Recommended for {countryName}: <strong>{formatScaleMax(recommendedScale)}</strong>.
        Change this if your school uses a different scale.
      </p>

      <div className="flex flex-wrap gap-2">
        {PRESET_SCALES.map((preset) => {
          const active = parsed.valid && parsed.value === preset.value;
          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => onChange(preset.value)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors ${
                active
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-white text-text-muted hover:border-primary/40"
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-end gap-3">
        <div className="w-32">
          <label className="mb-1 block text-xs font-medium text-text-muted">Custom max</label>
          <input
            type="number"
            min={SCALE_MIN}
            max={SCALE_MAX}
            step="0.01"
            placeholder="e.g. 4.33"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`${inputClass} ${showError ? "border-red-400 focus:border-red-400 focus:ring-red-200" : ""}`}
          />
        </div>
        <p className="pb-2 text-sm text-text-muted">
          out of {parsed.valid ? formatScaleMax(parsed.value) : "?"} points
        </p>
      </div>

      {showError && (
        <p className="mt-1 text-xs text-red-600">
          {parseCustomScaleMax(value).error ?? `Use a value between ${SCALE_MIN} and ${SCALE_MAX}.`}
        </p>
      )}
    </div>
  );
}
