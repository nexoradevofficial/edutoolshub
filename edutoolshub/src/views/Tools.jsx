import ToolCard from "../components/ToolCard";
import SaasPromoSection from "../components/SaasPromoSection";
import { studentTools, teacherTools } from "../data/tools";

function ToolGroup({ id, eyebrow, title, description, tools }) {
  return (
    <div id={id} className="scroll-mt-24">
      <header className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-text sm:text-3xl">{title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-text-muted sm:text-base">{description}</p>
      </header>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}

export default function Tools() {
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
              Free educational tools, organized for real work
            </h1>
            <p className="mt-4 text-lg text-text-muted">
              Browse by audience — every tool is free, runs in your browser, and needs no account.
            </p>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-text-muted sm:text-base">
              Student tools help with GPA, finals, citations, and study planning. Teacher tools
              cover attendance, lesson planning, rubrics, comments, certificates, and classroom
              printables. Pick a category below or jump straight into a tool.
            </p>
            <nav
              aria-label="Tool categories"
              className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm font-medium"
            >
              <a
                href="#students"
                className="rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-primary transition-colors hover:bg-primary/10"
              >
                Student tools
              </a>
              <a
                href="#teachers"
                className="rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-accent-dark transition-colors hover:bg-accent/20"
              >
                Teacher tools
              </a>
            </nav>
          </header>

          <div className="mt-16 space-y-20">
            <ToolGroup
              id="students"
              eyebrow="For students"
              title="GPA, exams, citations & study planning"
              description="Calculate grades, convert scales, plan revision hours, and cite sources correctly — without signup."
              tools={studentTools}
            />
            <ToolGroup
              id="teachers"
              eyebrow="For teachers"
              title="Attendance, planning, assessment & classroom printables"
              description="Build registers, lesson plans, rubrics, report comments, certificates, worksheets, and behavior charts in minutes."
              tools={teacherTools}
            />
          </div>
        </div>
      </section>

      <SaasPromoSection variant="compact" id="saas-school-erp" />
    </>
  );
}
