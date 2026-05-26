/**
 * Circular GPA gauge.
 *
 * A 240° arc with a 120° "gap" at the bottom — the classic speedometer
 * silhouette. The arc fills proportional to gpa / scaleMax and changes
 * colour depending on how close the GPA is to the maximum, so a quick
 * glance tells the student whether they are doing well.
 */

const SIZE = 220;
const CENTER = SIZE / 2;
const RADIUS = 90;
const STROKE = 14;
const ARC_DEGREES = 240;
const START_ANGLE = -ARC_DEGREES / 2; // -120°
const END_ANGLE = ARC_DEGREES / 2; // +120°

function polarToCartesian(cx, cy, r, angleDeg) {
  // 0° is "12 o'clock"; positive angles go clockwise.
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  if (Math.abs(endAngle - startAngle) < 0.01) {
    // Degenerate — just emit a point so React doesn't choke on NaN.
    const p = polarToCartesian(cx, cy, r, startAngle);
    return `M ${p.x} ${p.y}`;
  }
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

function getMeterColor(percent) {
  if (percent < 0.5) return { stroke: "#ef4444", chipBg: "bg-red-50", chip: "text-red-700", label: "Needs work" };
  if (percent < 0.7) return { stroke: "#f59e0b", chipBg: "bg-amber-50", chip: "text-amber-800", label: "Fair" };
  if (percent < 0.85) return { stroke: "#2563eb", chipBg: "bg-blue-50", chip: "text-blue-700", label: "Good" };
  return { stroke: "#10b981", chipBg: "bg-emerald-50", chip: "text-emerald-700", label: "Excellent" };
}

/**
 * Props:
 *   gpa        - numeric GPA (or null if not yet computed)
 *   scaleMax   - the maximum value for the scale (e.g. 4.0)
 *   scaleLabel - human label for the scale (e.g. "4.00")
 *   label      - small text under the meter ("Current semester" / "Cumulative")
 *   subLabel   - optional secondary text under the GPA (e.g. "Weighted")
 *   size       - "lg" (default) | "md"
 */
export default function GpaMeter({
  gpa,
  scaleMax,
  scaleLabel,
  label = "",
  subLabel = "",
  size = "lg",
}) {
  const gpaNumber = gpa !== null && gpa !== undefined ? Number(gpa) : null;
  const safeScale = scaleMax && scaleMax > 0 ? scaleMax : 4;
  const percent =
    gpaNumber === null
      ? 0
      : Math.max(0, Math.min(1, gpaNumber / safeScale));

  const filledEnd = START_ANGLE + ARC_DEGREES * percent;
  const trackPath = describeArc(CENTER, CENTER, RADIUS, START_ANGLE, END_ANGLE);
  const filledPath = describeArc(CENTER, CENTER, RADIUS, START_ANGLE, filledEnd);

  const color = gpaNumber === null
    ? { stroke: "#cbd5e1", chipBg: "bg-surface-muted", chip: "text-text-muted", label: "—" }
    : getMeterColor(percent);

  const displayGpa = gpaNumber === null ? "—" : gpaNumber.toFixed(2);

  const wrapperSize = size === "md" ? "h-44 w-44 sm:h-52 sm:w-52" : "h-56 w-56 sm:h-64 sm:w-64";
  const numberSize = size === "md" ? "text-4xl sm:text-5xl" : "text-5xl sm:text-6xl";

  return (
    <div className="flex flex-col items-center">
      <div className={`relative ${wrapperSize}`}>
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="h-full w-full"
          aria-hidden
        >
          <path
            d={trackPath}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={STROKE}
            strokeLinecap="round"
          />
          {gpaNumber !== null && percent > 0 && (
            <path
              d={filledPath}
              fill="none"
              stroke={color.stroke}
              strokeWidth={STROKE}
              strokeLinecap="round"
              style={{ transition: "stroke 200ms ease, d 300ms ease" }}
            />
          )}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pb-4">
          <p
            className={`font-bold leading-none tracking-tight ${numberSize}`}
            style={{ color: color.stroke }}
          >
            {displayGpa}
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-text-muted">
            of {scaleLabel ?? safeScale}
          </p>
          {subLabel && (
            <p className="mt-1 text-[11px] font-medium text-text-muted">
              {subLabel}
            </p>
          )}
        </div>
      </div>

      {label && (
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
          {label}
        </p>
      )}

      {gpaNumber !== null && (
        <span
          className={`mt-2 rounded-full px-3 py-1 text-xs font-semibold ${color.chipBg} ${color.chip}`}
        >
          {color.label}
        </span>
      )}
    </div>
  );
}
