export default function PlannerCard({ title, description, actions, children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-border bg-surface shadow-sm ${className}`}
    >
      {(title || actions) && (
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
          <div>
            {title && <h3 className="text-sm font-semibold text-text sm:text-base">{title}</h3>}
            {description && <p className="mt-0.5 text-xs text-text-muted sm:text-sm">{description}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}
