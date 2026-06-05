import { useMemo, useState } from "react";
import Button from "../../../ui/Button";
import {
  COVERAGE_STATUSES,
  SAMPLE_STANDARDS,
  STANDARDS_FRAMEWORKS,
} from "../../../../utils/lessonPlanner/constants";
import {
  exportCurriculumCsv,
  exportCurriculumPdf,
  getWeeksInRange,
} from "../../../../utils/lessonPlanner/export";
import { generateId } from "../../../../utils/lessonPlanner/storage";
import { useLessonPlanner } from "../LessonPlannerContext";
import PlannerCard from "../shared/PlannerCard";
import { FormField, inputClass, selectClass, textareaClass } from "../shared/FormField";

export default function CurriculumMapper() {
  const { curriculum } = useLessonPlanner();
  const data = curriculum.data;
  const [framework, setFramework] = useState("ib");
  const [newTopic, setNewTopic] = useState({
    weekNumber: 1,
    title: "",
    standard: "",
    notes: "",
  });

  const weeks = useMemo(
    () => getWeeksInRange(data.schoolYearStart, data.schoolYearEnd),
    [data.schoolYearStart, data.schoolYearEnd]
  );

  const enrichedTopics = useMemo(() => {
    return data.topics.map((t) => {
      const week = weeks.find((w) => w.weekNumber === t.weekNumber);
      return {
        ...t,
        weekStart: week?.weekStart,
        weekEnd: week?.weekEnd,
      };
    });
  }, [data.topics, weeks]);

  const coverage = useMemo(() => {
    const total = data.topics.length;
    const taught = data.topics.filter((t) => t.status === "taught").length;
    const skipped = data.topics.filter((t) => t.status === "skipped").length;
    const pending = data.topics.filter((t) => t.status === "pending" || !t.status).length;
    return { total, taught, skipped, pending };
  }, [data.topics]);

  function addTerm() {
    curriculum.addTerm({
      id: generateId(),
      name: `Term ${data.terms.length + 1}`,
      start: "",
      end: "",
    });
  }

  function addTopic() {
    if (!newTopic.title.trim()) return;
    curriculum.addTopic({
      id: generateId(),
      weekNumber: newTopic.weekNumber,
      title: newTopic.title,
      framework: STANDARDS_FRAMEWORKS.find((f) => f.id === framework)?.label ?? framework,
      standard: newTopic.standard,
      status: "pending",
      notes: newTopic.notes,
    });
    setNewTopic({ weekNumber: newTopic.weekNumber, title: "", standard: "", notes: "" });
  }

  return (
    <div className="space-y-6">
      <PlannerCard title="School Year & Terms">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="School Year Start">
            <input
              type="date"
              value={data.schoolYearStart}
              onChange={(e) => curriculum.update({ schoolYearStart: e.target.value })}
              className={inputClass}
            />
          </FormField>
          <FormField label="School Year End">
            <input
              type="date"
              value={data.schoolYearEnd}
              onChange={(e) => curriculum.update({ schoolYearEnd: e.target.value })}
              className={inputClass}
            />
          </FormField>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-text">Terms</p>
            <Button size="sm" variant="secondary" onClick={addTerm}>
              Add Term
            </Button>
          </div>
          {data.terms.length === 0 ? (
            <p className="text-xs text-text-muted">Add terms to divide your school year.</p>
          ) : (
            <div className="space-y-2">
              {data.terms.map((term) => (
                <div key={term.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-border p-3">
                  <input
                    type="text"
                    value={term.name}
                    onChange={(e) =>
                      curriculum.update({
                        terms: data.terms.map((t) =>
                          t.id === term.id ? { ...t, name: e.target.value } : t
                        ),
                      })
                    }
                    className="flex-1 rounded-lg border border-border px-2 py-1 text-sm"
                  />
                  <input
                    type="date"
                    value={term.start}
                    onChange={(e) =>
                      curriculum.update({
                        terms: data.terms.map((t) =>
                          t.id === term.id ? { ...t, start: e.target.value } : t
                        ),
                      })
                    }
                    className="rounded-lg border border-border px-2 py-1 text-sm"
                  />
                  <span className="text-text-muted">to</span>
                  <input
                    type="date"
                    value={term.end}
                    onChange={(e) =>
                      curriculum.update({
                        terms: data.terms.map((t) =>
                          t.id === term.id ? { ...t, end: e.target.value } : t
                        ),
                      })
                    }
                    className="rounded-lg border border-border px-2 py-1 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => curriculum.removeTerm(term.id)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </PlannerCard>

      <div className="grid gap-4 sm:grid-cols-4">
        {COVERAGE_STATUSES.map((s) => {
          const count =
            s.id === "pending"
              ? coverage.pending
              : s.id === "taught"
                ? coverage.taught
                : coverage.skipped;
          return (
            <div
              key={s.id}
              className="rounded-xl border border-border bg-surface p-4 text-center"
            >
              <p className="text-2xl font-bold" style={{ color: s.color }}>
                {count}
              </p>
              <p className="text-xs font-medium text-text-muted">{s.label}</p>
            </div>
          );
        })}
        <div className="rounded-xl border border-border bg-surface p-4 text-center">
          <p className="text-2xl font-bold text-text">{coverage.total}</p>
          <p className="text-xs font-medium text-text-muted">Total Topics</p>
        </div>
      </div>

      <PlannerCard
        title="Map Topics Week by Week"
        description="Align topics to curriculum standards"
        actions={
          <>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => exportCurriculumCsv(data, enrichedTopics)}
            >
              Export CSV
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => exportCurriculumPdf(data, enrichedTopics)}
            >
              Export PDF
            </Button>
          </>
        }
      >
        <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <FormField label="Framework">
            <select
              value={framework}
              onChange={(e) => setFramework(e.target.value)}
              className={selectClass}
            >
              {STANDARDS_FRAMEWORKS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Week">
            <select
              value={newTopic.weekNumber}
              onChange={(e) =>
                setNewTopic((t) => ({ ...t, weekNumber: Number(e.target.value) }))
              }
              className={selectClass}
            >
              {weeks.length === 0 ? (
                <option value={1}>Set school year dates first</option>
              ) : (
                weeks.map((w) => (
                  <option key={w.weekNumber} value={w.weekNumber}>
                    Week {w.weekNumber} ({w.weekStart})
                  </option>
                ))
              )}
            </select>
          </FormField>
          <FormField label="Topic Title" className="sm:col-span-2">
            <input
              type="text"
              value={newTopic.title}
              onChange={(e) => setNewTopic((t) => ({ ...t, title: e.target.value }))}
              placeholder="e.g. Introduction to Algebra"
              className={inputClass}
            />
          </FormField>
          <FormField label="Standard" className="sm:col-span-2">
            <select
              value={newTopic.standard}
              onChange={(e) => setNewTopic((t) => ({ ...t, standard: e.target.value }))}
              className={selectClass}
            >
              <option value="">Select or type below</option>
              {(SAMPLE_STANDARDS[framework] ?? []).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={newTopic.standard}
              onChange={(e) => setNewTopic((t) => ({ ...t, standard: e.target.value }))}
              placeholder="Custom standard reference"
              className={`${inputClass} mt-2`}
            />
          </FormField>
          <FormField label="Notes" className="sm:col-span-2">
            <textarea
              value={newTopic.notes}
              onChange={(e) => setNewTopic((t) => ({ ...t, notes: e.target.value }))}
              className={textareaClass}
              rows={2}
            />
          </FormField>
        </div>
        <Button size="sm" onClick={addTopic}>
          Add Topic
        </Button>

        {data.topics.length === 0 ? (
          <p className="mt-6 text-center text-sm text-text-muted">
            No topics mapped yet. Set your school year and add topics.
          </p>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs font-medium text-text-muted">
                  <th className="pb-2 pr-4">Week</th>
                  <th className="pb-2 pr-4">Topic</th>
                  <th className="pb-2 pr-4">Standard</th>
                  <th className="pb-2 pr-4">Status</th>
                  <th className="pb-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[...data.topics]
                  .sort((a, b) => a.weekNumber - b.weekNumber)
                  .map((topic) => {
                    const week = weeks.find((w) => w.weekNumber === topic.weekNumber);
                    const statusInfo = COVERAGE_STATUSES.find(
                      (s) => s.id === (topic.status ?? "pending")
                    );
                    return (
                      <tr key={topic.id}>
                        <td className="py-3 pr-4">
                          <span className="font-medium">W{topic.weekNumber}</span>
                          {week && (
                            <p className="text-[10px] text-text-muted">
                              {week.weekStart}
                            </p>
                          )}
                        </td>
                        <td className="py-3 pr-4">
                          <p className="font-medium text-text">{topic.title}</p>
                          {topic.notes && (
                            <p className="text-xs text-text-muted">{topic.notes}</p>
                          )}
                        </td>
                        <td className="py-3 pr-4 text-xs text-text-muted">
                          <p>{topic.framework}</p>
                          <p>{topic.standard}</p>
                        </td>
                        <td className="py-3 pr-4">
                          <select
                            value={topic.status ?? "pending"}
                            onChange={(e) =>
                              curriculum.updateTopic(topic.id, { status: e.target.value })
                            }
                            className="rounded-lg border border-border px-2 py-1 text-xs"
                            style={{ color: statusInfo?.color }}
                          >
                            {COVERAGE_STATUSES.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3">
                          <button
                            type="button"
                            onClick={() => curriculum.removeTopic(topic.id)}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </PlannerCard>
    </div>
  );
}
