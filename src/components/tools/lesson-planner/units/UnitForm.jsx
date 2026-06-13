import { CLASS_COLORS } from "../../../../utils/lessonPlanner/constants";
import { generateId } from "../../../../utils/lessonPlanner/storage";
import { useLessonPlanner } from "../LessonPlannerContext";
import CustomOptionSelect from "../shared/CustomOptionSelect";
import { FormField, inputClass } from "../shared/FormField";

export default function UnitForm({ unit, onChange, onSubmit, onCancel }) {
  const { customOptions } = useLessonPlanner();
  const data = unit ?? {
    id: generateId(),
    name: "",
    subject: "Mathematics",
    grade: "6",
    className: "",
    startDate: "",
    endDate: "",
    color: CLASS_COLORS[0],
  };

  function update(patch) {
    onChange({ ...data, ...patch });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(data);
      }}
      className="space-y-4"
    >
      <FormField label="Unit Name">
        <input
          type="text"
          value={data.name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="e.g. Fractions & Decimals"
          className={inputClass}
          required
        />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-3">
        <FormField label="Subject">
          <CustomOptionSelect
            value={data.subject}
            onChange={(subject) => update({ subject })}
            options={customOptions.subjects}
            onAddCustom={customOptions.addSubject}
            inputPlaceholder="e.g. Drama"
          />
        </FormField>
        <FormField label="Grade">
          <CustomOptionSelect
            value={data.grade}
            onChange={(grade) => update({ grade })}
            options={customOptions.grades}
            onAddCustom={customOptions.addGrade}
            inputPlaceholder="e.g. Foundation"
          />
        </FormField>
        <FormField label="Class">
          <input
            type="text"
            value={data.className}
            onChange={(e) => update({ className: e.target.value })}
            placeholder="e.g. 7B"
            className={inputClass}
          />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Start Date">
          <input
            type="date"
            value={data.startDate}
            onChange={(e) => update({ startDate: e.target.value })}
            className={inputClass}
            required
          />
        </FormField>
        <FormField label="End Date">
          <input
            type="date"
            value={data.endDate}
            onChange={(e) => update({ endDate: e.target.value })}
            className={inputClass}
            required
          />
        </FormField>
      </div>

      <FormField label="Color">
        <div className="flex flex-wrap gap-2">
          {CLASS_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => update({ color })}
              className={`h-8 w-8 rounded-full border-2 transition-transform ${
                data.color === color ? "scale-110 border-text" : "border-transparent"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </FormField>

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          Save Unit
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-text-muted hover:text-text"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
