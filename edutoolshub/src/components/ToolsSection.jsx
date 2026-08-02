import { studentTools, teacherTools } from "../data/tools";
import ToolCard from "./ToolCard";

export default function ToolsSection() {
  return (
    <section id="tools" className="bg-surface-muted py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Tools</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-text sm:text-4xl">
            Start with tools that solve real school tasks
          </h2>
          <p className="mt-4 text-lg text-text-muted">
            Organized for students and teachers — free to use, no signup required.
          </p>
        </div>

        <div className="mt-14 space-y-14">
          <div>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <h3 className="text-xl font-semibold text-text">Student tools</h3>
              <a
                href="/tools#students"
                className="text-sm font-medium text-primary underline-offset-2 hover:underline"
              >
                View all student tools
              </a>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {studentTools.slice(0, 6).map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>

          <div>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <h3 className="text-xl font-semibold text-text">Teacher tools</h3>
              <a
                href="/tools#teachers"
                className="text-sm font-medium text-primary underline-offset-2 hover:underline"
              >
                View all teacher tools
              </a>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {teacherTools.slice(0, 6).map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
