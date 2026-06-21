const AUDIENCE_STYLES = {
  student: {
    label: "For Students",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  teacher: {
    label: "For Teachers",
    className: "bg-accent/10 text-accent-dark border-accent/20",
  },
  both: {
    label: "Students & Teachers",
    className: "bg-violet-100 text-violet-800 border-violet-200",
  },
};

export default function ToolAudienceBadge({ audience = "both", size = "sm" }) {
  const config = AUDIENCE_STYLES[audience] ?? AUDIENCE_STYLES.both;
  const sizeClass =
    size === "lg"
      ? "px-3 py-1.5 text-xs sm:text-sm"
      : "px-2.5 py-1 text-[11px] sm:text-xs";

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border font-semibold uppercase tracking-wide ${sizeClass} ${config.className}`}
    >
      {config.label}
    </span>
  );
}
