import Button from "./ui/Button";
import { IconArrowRight } from "./icons/ToolIcons";
import { activeTools } from "../data/tools";

export default function Hero() {
  const liveCount = activeTools.length;
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white pt-12 pb-16 sm:pt-16 sm:pb-20"
    >
      <div
        className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
          <span className="h-2 w-2 rounded-full bg-accent" />
          {liveCount} {liveCount === 1 ? "tool" : "tools"} live · Free, no signup
        </p>

        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight text-text sm:text-5xl lg:text-[3.25rem]">
          Smart Tools for{" "}
          <span className="text-primary">Students & Teachers</span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-text-muted">
          Free GPA calculator, attendance tools, and educational utilities for
          modern learners and educators.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button to="/tools/gpa-calculator" size="lg">
            Try GPA Calculator
            <IconArrowRight />
          </Button>
          <Button to="/tools" variant="secondary" size="lg">
            View All Tools
          </Button>
        </div>

        <p className="mt-6 text-sm text-text-muted">
          No login required · 100% free · Available worldwide
        </p>
      </div>
    </section>
  );
}
