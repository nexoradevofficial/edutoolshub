import { IconPlus } from "../../icons/ToolIcons";
import { MAX_SEMESTERS } from "../../../utils/gpa";

/**
 * Horizontal scrollable tab strip for switching semesters and adding new
 * ones. Each tab also shows the semester GPA badge when available, so
 * students can quickly compare terms.
 */
export default function SemesterTabs({
  semesters,
  activeId,
  semesterResults,
  onSelect,
  onAddSemester,
}) {
  const atMax = semesters.length >= MAX_SEMESTERS;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex flex-1 flex-wrap items-center gap-2 overflow-x-auto">
        {semesters.map((sem) => {
          const active = sem.id === activeId;
          const res = semesterResults[sem.id];
          const gpaText = res?.gpa ?? null;
          return (
            <button
              key={sem.id}
              type="button"
              onClick={() => onSelect(sem.id)}
              aria-pressed={active}
              className={`group inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-all ${
                active
                  ? "border-primary bg-primary/10 text-primary shadow-sm"
                  : "border-border bg-white text-text-muted hover:border-primary/30 hover:text-text"
              }`}
            >
              <span className="max-w-[10rem] truncate">{sem.name}</span>
              {gpaText && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums tracking-wider ${
                    active ? "bg-primary/15 text-primary" : "bg-surface-muted text-text-muted"
                  }`}
                  aria-label={`GPA ${gpaText}`}
                >
                  {gpaText}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onAddSemester}
        disabled={atMax}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-dashed border-primary/40 bg-primary/5 px-3 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Add another semester"
      >
        <IconPlus className="h-4 w-4" />
        Add semester
      </button>
    </div>
  );
}
