import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import Button from "../../../ui/Button";
import { IconPrint } from "../../../icons/ToolIcons";
import { generateId } from "../../../../utils/lessonPlanner/storage";
import { useLessonPlanner } from "../LessonPlannerContext";
import PlannerCard from "../shared/PlannerCard";
import CustomOptionSelect from "../shared/CustomOptionSelect";
import { FormField, inputClass, textareaClass } from "../shared/FormField";
import SubstitutePrintView from "./SubstitutePrintView";

const DEFAULT_SCHEDULE = [
  { time: "8:00 AM", activity: "Attendance & morning routine" },
  { time: "8:15 AM", activity: "Lesson activity (see attached plan)" },
  { time: "9:00 AM", activity: "Break" },
  { time: "9:15 AM", activity: "Continued lesson / independent work" },
  { time: "10:00 AM", activity: "Wrap-up & dismissal prep" },
];

function createBlankSubstitutePlan() {
  return {
    id: generateId(),
    className: "",
    subject: "Mathematics",
    grade: "6",
    date: new Date().toISOString().slice(0, 10),
    teacherName: "",
    room: "",
    period: "",
    schedule: DEFAULT_SCHEDULE.map((s) => ({ ...s })),
    attachedLessonPlanIds: [],
    emergencyFallback:
      "If technology fails or materials are missing:\n1. Silent reading for 15 minutes\n2. Journal writing: 'What I learned this week'\n3. Review worksheet from folder on teacher's desk\n4. Educational video (link on whiteboard) if available",
    behaviorNotes: "",
    generalNotes: "",
    createdAt: new Date().toISOString(),
  };
}

export default function SubstitutePlanCreator() {
  const { lessonPlans, substitute, customOptions } = useLessonPlanner();
  const [editingId, setEditingId] = useState(null);
  const [plan, setPlan] = useState(createBlankSubstitutePlan());
  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Substitute_Plan_${plan.date}`,
  });

  const activePlan = editingId
    ? substitute.getById(editingId) ?? plan
    : plan;

  function update(patch) {
    const updated = { ...activePlan, ...patch };
    setPlan(updated);
    if (editingId) substitute.save(updated);
  }

  function updateSchedule(index, field, value) {
    const schedule = activePlan.schedule.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    update({ schedule });
  }

  function addScheduleRow() {
    update({
      schedule: [...activePlan.schedule, { time: "", activity: "" }],
    });
  }

  function removeScheduleRow(index) {
    update({
      schedule: activePlan.schedule.filter((_, i) => i !== index),
    });
  }

  function toggleLessonAttachment(lessonId) {
    const ids = activePlan.attachedLessonPlanIds ?? [];
    const next = ids.includes(lessonId)
      ? ids.filter((id) => id !== lessonId)
      : [...ids, lessonId];
    update({ attachedLessonPlanIds: next });
  }

  function savePlan() {
    substitute.save(activePlan);
    setEditingId(activePlan.id);
  }

  function startNew() {
    const newPlan = createBlankSubstitutePlan();
    setPlan(newPlan);
    setEditingId(null);
  }

  const attachedLessons = (activePlan.attachedLessonPlanIds ?? [])
    .map((id) => lessonPlans.getById(id))
    .filter(Boolean);

  return (
    <div ref={printRef}>
      <SubstitutePrintView plan={activePlan} attachedLessons={attachedLessons} />

      <div className="space-y-6 print:hidden">
        <PlannerCard
          title="Saved Substitute Plans"
          actions={<Button size="sm" onClick={startNew}>New Plan</Button>}
        >
          {substitute.list.length === 0 ? (
            <p className="text-sm text-text-muted">No saved plans yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {substitute.list.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setEditingId(p.id);
                    setPlan(p);
                  }}
                  className={`rounded-xl border px-3 py-2 text-sm transition-all ${
                    editingId === p.id
                      ? "border-primary bg-primary/5 font-medium text-primary"
                      : "border-border text-text-muted hover:border-primary/30"
                  }`}
                >
                  {p.className || "Class"} — {p.date}
                </button>
              ))}
            </div>
          )}
        </PlannerCard>

        <PlannerCard
          title="Class Information"
          description="Quick-fill template for substitute teachers"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FormField label="Class">
              <input
                type="text"
                value={activePlan.className}
                onChange={(e) => update({ className: e.target.value })}
                placeholder="e.g. 8B"
                className={inputClass}
              />
            </FormField>
            <FormField label="Subject">
              <CustomOptionSelect
                value={activePlan.subject}
                onChange={(subject) => update({ subject })}
                options={customOptions.subjects}
                onAddCustom={customOptions.addSubject}
                inputPlaceholder="e.g. ESL"
              />
            </FormField>
            <FormField label="Grade">
              <CustomOptionSelect
                value={activePlan.grade}
                onChange={(grade) => update({ grade })}
                options={customOptions.grades}
                onAddCustom={customOptions.addGrade}
                inputPlaceholder="e.g. Reception"
              />
            </FormField>
            <FormField label="Date">
              <input
                type="date"
                value={activePlan.date}
                onChange={(e) => update({ date: e.target.value })}
                className={inputClass}
              />
            </FormField>
            <FormField label="Regular Teacher">
              <input
                type="text"
                value={activePlan.teacherName}
                onChange={(e) => update({ teacherName: e.target.value })}
                className={inputClass}
              />
            </FormField>
            <FormField label="Room">
              <input
                type="text"
                value={activePlan.room}
                onChange={(e) => update({ room: e.target.value })}
                className={inputClass}
              />
            </FormField>
            <FormField label="Period">
              <input
                type="text"
                value={activePlan.period}
                onChange={(e) => update({ period: e.target.value })}
                placeholder="e.g. Period 3"
                className={inputClass}
              />
            </FormField>
          </div>
        </PlannerCard>

        <PlannerCard title="Daily Schedule">
          <div className="space-y-2">
            {activePlan.schedule.map((row, i) => (
              <div key={i} className="flex flex-wrap gap-2">
                <input
                  type="text"
                  value={row.time}
                  onChange={(e) => updateSchedule(i, "time", e.target.value)}
                  placeholder="Time"
                  className="w-28 rounded-xl border border-border px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  value={row.activity}
                  onChange={(e) => updateSchedule(i, "activity", e.target.value)}
                  placeholder="Activity"
                  className="min-w-0 flex-1 rounded-xl border border-border px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeScheduleRow(i)}
                  className="rounded-lg px-2 text-text-muted hover:text-red-600"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addScheduleRow}
              className="text-sm font-medium text-primary hover:underline"
            >
              + Add time slot
            </button>
          </div>
        </PlannerCard>

        <PlannerCard
          title="Attach Lesson Plans"
          description="Include full lesson plans for the substitute"
        >
          {lessonPlans.list.length === 0 ? (
            <p className="text-sm text-text-muted">
              Create lesson plans in the Lesson Plans module first.
            </p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {lessonPlans.list.map((lp) => {
                const attached = (activePlan.attachedLessonPlanIds ?? []).includes(lp.id);
                return (
                  <button
                    key={lp.id}
                    type="button"
                    onClick={() => toggleLessonAttachment(lp.id)}
                    className={`rounded-xl border p-3 text-left text-sm transition-all ${
                      attached
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <p className="font-medium text-text">{lp.title}</p>
                    <p className="text-xs text-text-muted">
                      {lp.subject} · {lp.duration} min
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </PlannerCard>

        <PlannerCard
          title="Emergency Fallback"
          description="Backup activities if plans cannot be followed"
        >
          <textarea
            value={activePlan.emergencyFallback}
            onChange={(e) => update({ emergencyFallback: e.target.value })}
            className={textareaClass}
            rows={5}
          />
        </PlannerCard>

        <PlannerCard title="Student Behavior Notes">
          <textarea
            value={activePlan.behaviorNotes}
            onChange={(e) => update({ behaviorNotes: e.target.value })}
            placeholder="Students who need extra support, seating arrangements, medical notes..."
            className={textareaClass}
            rows={4}
          />
        </PlannerCard>

        <PlannerCard title="Additional Notes">
          <textarea
            value={activePlan.generalNotes}
            onChange={(e) => update({ generalNotes: e.target.value })}
            placeholder="Where to find materials, lunch duty, dismissal procedures..."
            className={textareaClass}
            rows={3}
          />
        </PlannerCard>

        <div className="flex flex-wrap gap-3">
          <Button onClick={savePlan}>Save Plan</Button>
          <Button variant="secondary" onClick={handlePrint}>
            <IconPrint className="h-4 w-4" />
            Print
          </Button>
          {editingId && (
            <Button
              variant="ghost"
              className="text-red-600"
              onClick={() => {
                if (confirm("Delete this substitute plan?")) {
                  substitute.remove(editingId);
                  startNew();
                }
              }}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
