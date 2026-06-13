import { activeTools } from "../data/tools";
import ToolCard from "./ToolCard";

export default function ToolsSection() {
  const liveCount = activeTools.length;

  return (
    <section id="tools" className="bg-surface-muted py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Tools</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-text sm:text-4xl">
            Start with our live tools
          </h2>
          <p className="mt-4 text-lg text-text-muted">
            {liveCount} {liveCount === 1 ? "tool" : "tools"} ready now — free, no signup required.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activeTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  );
}
