import { Link } from "react-router-dom";
import { IconArrowRight, IconLock } from "./icons/ToolIcons";

export default function ToolCard({ tool }) {
  const isActive = tool.status === "active";
  const Icon = tool.icon;

  if (isActive) {
    return (
      <Link
        to={tool.path}
        className="group relative flex flex-col rounded-2xl border-2 border-primary/20 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-lg hover:shadow-primary/10"
      >
        <span className="absolute right-4 top-4 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
          Active
        </span>
        <div
          className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tool.color} transition-transform group-hover:scale-105`}
        >
          <Icon className="h-6 w-6 shrink-0" />
        </div>
        <h3 className="mt-4 pr-16 text-lg font-semibold text-text group-hover:text-primary transition-colors">
          {tool.name}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">{tool.description}</p>
        <span className="mt-4 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-primary">
          Open tool
          <IconArrowRight className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
    );
  }

  return (
    <div
      className="relative flex flex-col rounded-2xl border border-border bg-slate-50/80 p-6 opacity-60"
      aria-disabled="true"
    >
      <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-500">
        <IconLock className="h-3.5 w-3.5" />
        Coming Soon
      </span>
      <div className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tool.color}`}>
        <Icon className="h-6 w-6 shrink-0" />
      </div>
      <h3 className="mt-4 pr-24 text-lg font-semibold text-slate-500">{tool.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{tool.description}</p>
      <span className="mt-4 text-sm font-medium text-slate-400">Not available yet</span>
    </div>
  );
}
