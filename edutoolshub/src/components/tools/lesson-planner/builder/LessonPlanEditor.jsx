import { trackGenerateResult } from "../../../../utils/analytics";
import Button from "../../../ui/Button";
import { IconPrint } from "../../../icons/ToolIcons";
import { exportLessonPlanPdf } from "../../../../utils/lessonPlanner/export";
import { generateId } from "../../../../utils/lessonPlanner/storage";
import { useLessonPlanner } from "../LessonPlannerContext";
import PlannerCard from "../shared/PlannerCard";
import CustomOptionSelect from "../shared/CustomOptionSelect";
import { FormField, inputClass, selectClass } from "../shared/FormField";
import SectionDragDrop from "./SectionDragDrop";
import LessonPlanPrintView from "./LessonPlanPrintView";

export default function LessonPlanEditor({ plan, onSave, onCancel, onDelete }) {
  const { units, customOptions } = useLessonPlanner();

  function update(patch) {
    onSave({ ...plan, ...patch });
  }

  function handlePrint() {
    window.print();
  }

  function handlePdf() {
    exportLessonPlanPdf(plan);
    trackGenerateResult("Lesson Planner", "pdf");
  }

  function addSection() {
    const maxOrder = Math.max(...plan.sections.map((s) => s.order), -1);
    update({
      sections: [
        ...plan.sections,
        {
          id: generateId(),
          type: "custom",
          title: "Custom Section",
          content: "",
          order: maxOrder + 1,
        },
      ],
    });
  }

  function removeSection(id) {
    const filtered = plan.sections.filter((s) => s.id !== id);
    update({ sections: filtered.map((s, i) => ({ ...s, order: i })) });
  }

  return (
    <div>
      <LessonPlanPrintView plan={plan} />

      <div className="print:hidden">
        <PlannerCard
          title="Edit Lesson Plan"
          actions={
            <>
              <Button variant="secondary" size="sm" onClick={handlePrint}>
                <IconPrint className="h-4 w-4" />
                Print
              </Button>
              <Button variant="secondary" size="sm" onClick={handlePdf}>
                PDF
              </Button>
              {onDelete && (
                <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-600">
                  Delete
                </Button>
              )}
            </>
          }
        >
          <div className="space-y-4">
            <FormField label="Lesson Title">
              <input
                type="text"
                value={plan.title}
                onChange={(e) => update({ title: e.target.value })}
                className={inputClass}
              />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <FormField label="Subject">
                <CustomOptionSelect
                  value={plan.subject}
                  onChange={(subject) => update({ subject })}
                  options={customOptions.subjects}
                  onAddCustom={customOptions.addSubject}
                  inputPlaceholder="e.g. Environmental Science"
                />
              </FormField>
              <FormField label="Grade">
                <CustomOptionSelect
                  value={plan.grade}
                  onChange={(grade) => update({ grade })}
                  options={customOptions.grades}
                  onAddCustom={customOptions.addGrade}
                  inputPlaceholder="e.g. Year 9 or Pre-K"
                />
              </FormField>
              <FormField label="Duration (min)">
                <CustomOptionSelect
                  value={plan.duration}
                  onChange={(duration) => update({ duration })}
                  options={customOptions.durations}
                  onAddCustom={customOptions.addDuration}
                  formatOption={(d) => `${d} min`}
                  parseInput={(input) => Number(input.trim())}
                  inputType="number"
                  inputPlaceholder="e.g. 55"
                />
              </FormField>
              <FormField label="Class">
                <input
                  type="text"
                  value={plan.className}
                  onChange={(e) => update({ className: e.target.value })}
                  placeholder="e.g. 7A"
                  className={inputClass}
                />
              </FormField>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Date">
                <input
                  type="date"
                  value={plan.date}
                  onChange={(e) => update({ date: e.target.value })}
                  className={inputClass}
                />
              </FormField>
              <FormField label="Link to Unit">
                <select
                  value={plan.unitId ?? ""}
                  onChange={(e) => update({ unitId: e.target.value || null })}
                  className={selectClass}
                >
                  <option value="">No unit</option>
                  {units.list.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            <SectionDragDrop
              sections={plan.sections}
              onChange={(sections) => update({ sections })}
              onRemove={removeSection}
              onAdd={addSection}
            />

            <div className="flex flex-wrap gap-2 pt-2">
              <Button onClick={() => onSave(plan)}>Save Plan</Button>
              {onCancel && (
                <Button variant="secondary" onClick={onCancel}>
                  Back to List
                </Button>
              )}
            </div>
          </div>
        </PlannerCard>
      </div>
    </div>
  );
}
