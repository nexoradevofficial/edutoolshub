/**
 * Circular progress ring showing percentage (0–100%).
 * Complements the linear bar in the result card.
 */

const SIZE = 160;
const CENTER = SIZE / 2;
const RADIUS = 62;
const STROKE = 10;

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

export default function PercentageRing({ percent = 0, strokeColor = "#2563eb", label = "Score" }) {
  const clamped = Math.max(0, Math.min(100, percent ?? 0));
  const startAngle = -90;
  const sweep = (clamped / 100) * 360;
  const endAngle = startAngle + sweep;
  const filledPath =
    clamped > 0 ? describeArc(CENTER, CENTER, RADIUS, startAngle, endAngle) : null;

  const display =
    percent == null || Number.isNaN(percent) ? "—" : `${clamped.toFixed(1)}%`;

  return (
    <div
      className="relative mx-auto h-40 w-40 sm:h-44 sm:w-44"
      role="img"
      aria-label={`${label}: ${display}`}
    >
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-full w-full" aria-hidden>
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={STROKE}
        />
        {filledPath && (
          <path
            d={filledPath}
            fill="none"
            stroke={strokeColor}
            strokeWidth={STROKE}
            strokeLinecap="round"
            style={{ transition: "stroke 200ms ease, d 400ms ease" }}
          />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-2xl font-bold text-text sm:text-3xl">{display}</p>
        <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-text-muted">
          {label}
        </p>
      </div>
    </div>
  );
}
