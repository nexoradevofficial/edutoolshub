import { useMemo, useState } from "react";
import { useTrackGenerateResult } from "../../utils/analytics";
import { calculateStudyPlan } from "../../utils/studyTimeCalculator";
import Button from "../ui/Button";
import { IconPlus, IconTrash } from "../icons/ToolIcons";
import { inputClass, labelClass, sectionClass } from "./shared/toolFormStyles";

function emptySubject() {
  return { id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name: "", hours: "" };
}

export default function StudyTimeCalculator() {
  const [subjects, setSubjects] = useState([
    { id: "1", name: "Mathematics", hours: "12" },
    { id: "2", name: "Science", hours: "8" },
  ]);
  const [daysUntilExam, setDaysUntilExam] = useState("14");
  const [hoursPerDay, setHoursPerDay] = useState("2");

  const plan = useMemo(
    () =>
      calculateStudyPlan({
        subjects,
        daysUntilExam,
        hoursPerDay,
      }),
    [subjects, daysUntilExam, hoursPerDay]
  );

  useTrackGenerateResult("Study Time Calculator", plan.ok);

  const updateSubject = (id, key, value) => {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, [key]: value } : s)));
  };

  const addSubject = () => setSubjects((prev) => [...prev, emptySubject()]);
  const removeSubject = (id) =>
    setSubjects((prev) => (prev.length > 1 ? prev.filter((s) => s.id !== id) : prev));

  return (
    <div className="space-y-6">
      <section className={sectionClass}>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="days-until" className={labelClass}>
                  Days until exam
                </label>
                <input
                  id="days-until"
                  type="number"
                  min={1}
                  className={inputClass}
                  value={daysUntilExam}
                  onChange={(e) => setDaysUntilExam(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="hours-per-day" className={labelClass}>
                  Hours you can study per day
                </label>
                <input
                  id="hours-per-day"
                  type="number"
                  min={0.5}
                  step={0.5}
                  className={inputClass}
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(e.target.value)}
                />
              </div>
            </div>

            <div>
              <p className={labelClass}>Subjects & hours needed</p>
              <div className="space-y-3">
                {subjects.map((subject) => (
                  <div key={subject.id} className="flex gap-2">
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="Subject name"
                      value={subject.name}
                      onChange={(e) => updateSubject(subject.id, "name", e.target.value)}
                    />
                    <input
                      type="number"
                      min={0.5}
                      step={0.5}
                      className={`${inputClass} w-28`}
                      placeholder="Hours"
                      value={subject.hours}
                      onChange={(e) => updateSubject(subject.id, "hours", e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => removeSubject(subject.id)}
                      className="rounded-lg border border-border px-3 text-text-muted hover:text-red-600"
                      aria-label="Remove subject"
                    >
                      <IconTrash className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <Button variant="secondary" size="sm" className="mt-3" onClick={addSubject}>
                <IconPlus className="mr-1 h-4 w-4" />
                Add subject
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-white to-accent/5 p-6">
            <h2 className="text-lg font-semibold text-text">Your study plan</h2>
            {!plan.ok ? (
              <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-red-600">
                {Object.values(plan.errors).map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </ul>
            ) : (
              <>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-white p-4">
                    <p className="text-xs font-semibold uppercase text-text-muted">Total hours needed</p>
                    <p className="mt-1 text-2xl font-bold text-primary">{plan.totalHoursNeeded}h</p>
                  </div>
                  <div className="rounded-xl border border-border bg-white p-4">
                    <p className="text-xs font-semibold uppercase text-text-muted">Available hours</p>
                    <p className="mt-1 text-2xl font-bold text-text">{plan.totalAvailable}h</p>
                  </div>
                </div>
                <p
                  className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${
                    plan.isFeasible
                      ? "bg-accent/10 text-accent-dark"
                      : "bg-amber-50 text-amber-800"
                  }`}
                >
                  {plan.isFeasible
                    ? "Your schedule can cover all subjects. Follow the daily breakdown below."
                    : `You need about ${plan.recommendedDaily} hours per day, or ${Math.abs(plan.deficit)} more total hours, to cover everything.`}
                </p>
                <div className="mt-4 space-y-3">
                  {plan.schedule.map((item) => (
                    <div
                      key={item.name}
                      className="rounded-xl border border-border bg-white px-4 py-3 text-sm"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-text">{item.name}</span>
                        <span className="text-text-muted">{item.sharePercent}% of time</span>
                      </div>
                      <p className="mt-1 text-text-muted">
                        ~{item.minutesPerDay} min/day · {item.hours}h total
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
