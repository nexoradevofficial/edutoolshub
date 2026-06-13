export function FormField({ label, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="mb-1.5 block text-xs font-medium text-text-muted sm:text-sm">{label}</span>
      )}
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

export const selectClass = inputClass;

export const textareaClass =
  "w-full resize-y rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px]";
