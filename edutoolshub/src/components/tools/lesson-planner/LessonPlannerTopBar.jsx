import { MODULES } from "../../../utils/lessonPlanner/constants";

export default function LessonPlannerTopBar({ activeModule, onModuleChange }) {
  return (
    <nav className="sticky top-0 z-20 -mx-4 mb-6 border-b border-border bg-surface/95 px-4 backdrop-blur-sm sm:-mx-6 sm:px-6 print:hidden">
      <div className="flex gap-1 overflow-x-auto py-2 scrollbar-none">
        {MODULES.map((mod) => {
          const active = activeModule === mod.id;
          return (
            <button
              key={mod.id}
              type="button"
              onClick={() => onModuleChange(mod.id)}
              className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                active
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-text-muted hover:bg-surface-muted hover:text-text"
              }`}
            >
              <span className="hidden sm:inline">{mod.label}</span>
              <span className="sm:hidden">{mod.shortLabel}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
