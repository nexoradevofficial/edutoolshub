import ToolAudienceBadge from "./ToolAudienceBadge";

export default function ToolUsageGuide({ title, steps = [], audience = "both" }) {
  if (!steps.length) return null;

  return (
    <section className="mb-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-white to-accent/5 p-6 shadow-sm sm:p-8 print:hidden">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          How to use this tool
        </p>
        <ToolAudienceBadge audience={audience} />
      </div>
      {title ? (
        <h2 className="mt-2 text-lg font-bold text-text sm:text-xl">{title}</h2>
      ) : null}
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-text-muted sm:text-base">
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </section>
  );
}
