import { useState } from "react";
import { trackGenerateResult } from "../../../../utils/analytics";
import Button from "../../../ui/Button";
import { exportAllLessonPlansPdf } from "../../../../utils/lessonPlanner/export";
import { LESSON_TEMPLATES, createBlankPlan, createPlanFromTemplate } from "../../../../utils/lessonPlanner/templates";
import { useLessonPlanner } from "../LessonPlannerContext";
import PlannerCard from "../shared/PlannerCard";
import { FormField, selectClass } from "../shared/FormField";
import LessonPlanEditor from "./LessonPlanEditor";
import LessonPlanListItem from "./LessonPlanListItem";

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
    trackGenerateResult("Lesson Planner", "text");
    setDraft(null);
  }

  function handleDelete(id) {
    lessonPlans.remove(id);
    if (editingId === id) {
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
        onDelete={() => {
          if (confirm(`Delete "${editingPlan.title}"?`)) {
            handleDelete(editingPlan.id);
          }
        }}
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
        actions={
          lessonPlans.list.length > 0 ? (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => exportAllLessonPlansPdf(lessonPlans.list)}
            >
              Download All (PDF)
            </Button>
          ) : null
        }
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
                <LessonPlanListItem
                  key={plan.id}
                  plan={plan}
                  onEdit={setEditingId}
                  onDuplicate={lessonPlans.duplicate}
                  onDelete={handleDelete}
                />
              ))}
          </div>
        )}
      </PlannerCard>
    </div>
  );
}
