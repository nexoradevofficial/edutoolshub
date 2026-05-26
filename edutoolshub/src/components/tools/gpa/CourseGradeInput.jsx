import { GRADE_INPUT_MODES } from "../../../services/gpa";

const inputClass =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

export default function CourseGradeInput({
  course,
  gradeOptions,
  scaleMax,
  scaleLabel,
  onUpdate,
}) {
  const isNumeric = course.gradeInputMode === GRADE_INPUT_MODES.NUMERIC;

  const setMode = (mode) => {
    onUpdate({
      gradeInputMode: mode,
      ...(mode === GRADE_INPUT_MODES.NUMERIC ? { isAdvanced: false } : {}),
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex rounded-lg border border-border bg-surface-muted p-0.5">
        <button
          type="button"
          onClick={() => setMode(GRADE_INPUT_MODES.LETTER)}
          className={`flex-1 rounded-md px-2 py-1 text-xs font-semibold transition-colors ${
            !isNumeric ? "bg-white text-primary shadow-sm" : "text-text-muted"
          }`}
        >
          Letter
        </button>
        <button
          type="button"
          onClick={() => setMode(GRADE_INPUT_MODES.NUMERIC)}
          className={`flex-1 rounded-md px-2 py-1 text-xs font-semibold transition-colors ${
            isNumeric ? "bg-white text-primary shadow-sm" : "text-text-muted"
          }`}
        >
          GPA
        </button>
      </div>

      {isNumeric ? (
        <input
          type="number"
          min="0"
          max={scaleMax}
          step="0.01"
          placeholder={`e.g. 3.7 / ${scaleLabel}`}
          value={course.courseGpa}
          onChange={(e) => onUpdate({ courseGpa: e.target.value })}
          className={inputClass}
          aria-label="Course GPA on your school scale"
        />
      ) : (
        <select
          value={course.grade}
          onChange={(e) => onUpdate({ grade: e.target.value })}
          className={inputClass}
          aria-label="Letter grade"
        >
          {gradeOptions.map((label) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
