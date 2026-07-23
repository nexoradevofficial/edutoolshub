import ToolCard from "../components/ToolCard";
import SaasPromoSection from "../components/SaasPromoSection";
import { activeTools } from "../data/tools";

export default function Tools() {
  const liveCount = activeTools.length;

  return (
    <>
      <SaasPromoSection variant="banner" />

      <section className="bg-surface-muted py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <header className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              All tools
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-text sm:text-4xl">
              Free Educational Tools, ready to use
            </h1>
            <p className="mt-4 text-lg text-text-muted">
              {liveCount} {liveCount === 1 ? "tool" : "tools"} live · Free, no signup required.
            </p>
          </header>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activeTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>

          {liveCount === 0 && (
            <p className="mt-12 text-center text-text-muted">No tools available yet.</p>
          )}
        </div>
      </section>

      <SaasPromoSection variant="compact" id="saas-school-erp" />
    </>
  );
}
