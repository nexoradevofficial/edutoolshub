import { useState } from "react";
import Button from "../../../ui/Button";
import { LESSON_TEMPLATES, createBlankPlan, createPlanFromTemplate } from "../../../../utils/lessonPlanner/templates";
import { useLessonPlanner } from "../LessonPlannerContext";
import PlannerCard from "../shared/PlannerCard";
import { FormField, selectClass } from "../shared/FormField";
import LessonPlanEditor from "./LessonPlanEditor";

export default function LessonPlanBuilder() {
  const { lessonPlans } = useLessonPlanner();
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [templateFilter, setTemplateFilter] = useState({ subject: "", grade: "", duration: "" });

  const editingPlan = editingId
    ? lessonPlans.list.find((p) => p.id === editingId) ?? draft
    : draft;

  function startNew() {
    const plan = createBlankPlan();
    setDraft(plan);
    setEditingId(plan.id);
  }

  function startFromTemplate(templateId) {
    const template = LESSON_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;
    const plan = createPlanFromTemplate(template);
    lessonPlans.save(plan);
    setEditingId(plan.id);
    setDraft(null);
  }

  function handleSave(plan) {
    lessonPlans.save(plan);
    setDraft(null);
  }

  function handleDelete(id) {
    if (confirm("Delete this lesson plan?")) {
      lessonPlans.remove(id);
      setEditingId(null);
      setDraft(null);
    }
  }

  const filteredTemplates = LESSON_TEMPLATES.filter((t) => {
    if (templateFilter.subject && t.subject !== templateFilter.subject) return false;
    if (templateFilter.grade && t.grade !== templateFilter.grade) return false;
    if (templateFilter.duration && t.duration !== Number(templateFilter.duration)) return false;
    return true;
  });

  if (editingPlan) {
    return (
      <LessonPlanEditor
        plan={editingPlan}
        onSave={handleSave}
        onCancel={() => {
          setEditingId(null);
          setDraft(null);
        }}
        onDelete={() => handleDelete(editingPlan.id)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PlannerCard
        title="Templates"
        description="Start from a subject, grade, and duration template. You can add custom subjects, grades, and durations when editing any plan."
        actions={<Button size="sm" onClick={startNew}>Blank Plan</Button>}
      >
        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          <FormField label="Subject">
            <select
              value={templateFilter.subject}
              onChange={(e) => setTemplateFilter((f) => ({ ...f, subject: e.target.value }))}
              className={selectClass}
            >
              <option value="">All subjects</option>
              {[...new Set(LESSON_TEMPLATES.map((t) => t.subject))].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Grade">
            <select
              value={templateFilter.grade}
              onChange={(e) => setTemplateFilter((f) => ({ ...f, grade: e.target.value }))}
              className={selectClass}
            >
              <option value="">All grades</option>
              {[...new Set(LESSON_TEMPLATES.map((t) => t.grade))].map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Duration">
            <select
              value={templateFilter.duration}
              onChange={(e) => setTemplateFilter((f) => ({ ...f, duration: e.target.value }))}
              className={selectClass}
            >
              <option value="">All durations</option>
              {[...new Set(LESSON_TEMPLATES.map((t) => t.duration))].map((d) => (
                <option key={d} value={d}>{d} min</option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => startFromTemplate(t.id)}
              className="rounded-xl border border-border bg-surface-muted/50 p-4 text-left transition-all hover:border-primary/40 hover:bg-primary/5"
            >
              <p className="font-semibold text-text">{t.name}</p>
              <p className="mt-1 text-xs text-text-muted">
                {t.subject} · Grade {t.grade} · {t.duration} min
              </p>
            </button>
          ))}
        </div>
      </PlannerCard>

      <PlannerCard
        title="Your Lesson Plans"
        description={`${lessonPlans.list.length} saved plan${lessonPlans.list.length !== 1 ? "s" : ""}`}
      >
        {lessonPlans.list.length === 0 ? (
          <p className="py-8 text-center text-sm text-text-muted">
            No lesson plans yet. Create one from a template or start blank.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {lessonPlans.list
              .slice()
              .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
              .map((plan) => (
                <div
                  key={plan.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="font-semibold text-text">{plan.title}</p>
                    <p className="mt-0.5 text-xs text-text-muted">
                      {plan.subject} · Grade {plan.grade} · {plan.duration} min
                      {plan.className && ` · ${plan.className}`}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="secondary" onClick={() => setEditingId(plan.id)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        lessonPlans.duplicate(plan.id);
                      }}
                    >
                      Duplicate
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </PlannerCard>
    </div>
  );
}
