import GpaMeter from "./GpaMeter";
import { GPA_VIEW_MODES } from "../../../utils/gpa";

/**
 * The "dashboard" panel: meter, view toggle, per-semester chips.
 */
export default function GpaSummary({
  viewMode,
  onViewModeChange,
  semesters,
  semesterResults,
  cumulativeResult,
  activeSemesterId,
  onSelectSemester,
  scaleLabel,
  gpaTypeLabel,
}) {
  const activeSem = semesters.find((s) => s.id === activeSemesterId);
  const activeRes = activeSem ? semesterResults[activeSem.id] : null;

  const meterResult =
    viewMode === GPA_VIEW_MODES.CUMULATIVE ? cumulativeResult : activeRes;

  const meterLabel =
    viewMode === GPA_VIEW_MODES.CUMULATIVE
      ? `Cumulative GPA · ${semesters.length} semester${
          semesters.length === 1 ? "" : "s"
        }`
      : `${activeSem?.name ?? "Semester"} · ${gpaTypeLabel}`;

  const meterSubLabel =
    viewMode === GPA_VIEW_MODES.CUMULATIVE
      ? gpaTypeLabel
      : meterResult?.courseCount
        ? `${meterResult.courseCount} course${
            meterResult.courseCount === 1 ? "" : "s"
          } · ${meterResult.totalCredits} cr`
        : "";

  const buttonBase =
    "flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors";

  return (
    <section className="rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-white to-accent/5 p-6 shadow-sm sm:p-8 print:hidden">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="flex flex-col items-center">
          <div className="mb-4 flex w-full max-w-xs rounded-xl border border-border bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => onViewModeChange(GPA_VIEW_MODES.SEMESTER)}
              className={`${buttonBase} ${
                viewMode === GPA_VIEW_MODES.SEMESTER
                  ? "bg-primary text-white shadow-sm shadow-primary/30"
                  : "text-text-muted hover:text-text"
              }`}
            >
              Current Semester
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange(GPA_VIEW_MODES.CUMULATIVE)}
              className={`${buttonBase} ${
                viewMode === GPA_VIEW_MODES.CUMULATIVE
                  ? "bg-primary text-white shadow-sm shadow-primary/30"
                  : "text-text-muted hover:text-text"
              }`}
            >
              Cumulative
            </button>
          </div>

          <GpaMeter
            gpa={meterResult?.gpa ?? null}
            scaleMax={meterResult?.scaleMax}
            scaleLabel={scaleLabel}
            label={meterLabel}
            subLabel={meterSubLabel}
          />

          {!meterResult?.gpa && (
            <p className="mt-4 max-w-xs text-center text-xs text-text-muted">
              {viewMode === GPA_VIEW_MODES.CUMULATIVE
                ? "Add at least one completed course in any semester to see your cumulative GPA."
                : "Fill in this semester’s courses (name, grade, credits) to see the GPA appear here."}
            </p>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
            Per-semester breakdown
          </p>
          <ul className="mt-3 space-y-2">
            {semesters.map((sem, idx) => {
              const res = semesterResults[sem.id];
              const active = sem.id === activeSemesterId;
              return (
                <li key={sem.id}>
                  <button
                    type="button"
                    onClick={() => onSelectSemester(sem.id)}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
                      active
                        ? "border-primary bg-white shadow-sm"
                        : "border-border bg-white/70 hover:border-primary/30 hover:bg-white"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-sm font-semibold text-text">
                        <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary/10 text-[10px] font-bold text-primary">
                          {idx + 1}
                        </span>
                        <span className="truncate">{sem.name}</span>
                      </p>
                      <p className="mt-0.5 text-xs text-text-muted">
                        {res?.courseCount
                          ? `${res.courseCount} course${
                              res.courseCount === 1 ? "" : "s"
                            } · ${res.totalCredits} credits`
                          : "No completed courses yet"}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-lg px-2.5 py-1 text-sm font-bold tabular-nums ${
                        res?.gpa
                          ? "bg-primary/10 text-primary"
                          : "bg-surface-muted text-text-muted"
                      }`}
                    >
                      {res?.gpa ?? "—"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {cumulativeResult?.gpa && (
            <div className="mt-4 flex items-center justify-between rounded-xl border border-primary bg-primary/5 px-4 py-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
                  Cumulative
                </p>
                <p className="mt-0.5 text-xs text-text-muted">
                  {cumulativeResult.courseCount} course
                  {cumulativeResult.courseCount === 1 ? "" : "s"} ·{" "}
                  {cumulativeResult.totalCredits} credits
                </p>
              </div>
              <span className="rounded-lg bg-primary px-3 py-1.5 text-base font-bold tabular-nums text-white">
                {cumulativeResult.gpa}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
