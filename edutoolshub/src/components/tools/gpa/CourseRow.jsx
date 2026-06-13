import { GRADE_INPUT_MODES } from "../../../services/gpa";
import { IconTrash } from "../../icons/ToolIcons";
import CourseGradeInput from "./CourseGradeInput";

const inputClass =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

/**
 * Single course row used inside a semester. Layout mirrors the original
 * single-semester GPA calculator so existing users feel right at home,
 * with one tweak: the optional "Honors" cell collapses on mobile so the
 * row never overflows on narrow screens.
 */
export default function CourseRow({
  course,
  index,
  showAdvancedColumn,
  advancedLabel,
  scaleMax,
  scaleLabel,
  gradeOptions,
  rowCols,
  canRemove,
  onPatch,
  onRemove,
}) {
  return (
    <div
      className={`grid gap-3 rounded-xl border border-border/60 bg-surface-muted/50 p-4 sm:items-center sm:border-0 sm:bg-transparent sm:p-0 sm:grid ${rowCols}`}
    >
      <div>
        <label className="mb-1 block text-xs font-medium text-text-muted sm:sr-only">
          Course {index + 1}
        </label>
        <input
          type="text"
          placeholder={`e.g. Course ${index + 1}`}
          value={course.name}
          onChange={(e) => onPatch({ name: e.target.value })}
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-text-muted sm:sr-only">
          Grade or course GPA
        </label>
        <CourseGradeInput
          course={course}
          gradeOptions={gradeOptions}
          scaleMax={scaleMax}
          scaleLabel={scaleLabel}
          onUpdate={onPatch}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-text-muted sm:sr-only">
          Credits
        </label>
        <input
          type="number"
          min="0.5"
          max="12"
          step="0.5"
          value={course.credits}
          onChange={(e) =>
            onPatch({ credits: parseFloat(e.target.value) || 0 })
          }
          className={inputClass}
        />
      </div>
      {showAdvancedColumn && course.gradeInputMode !== GRADE_INPUT_MODES.NUMERIC ? (
        <div className="flex items-center justify-start sm:justify-center">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={course.isAdvanced}
              onChange={(e) => onPatch({ isAdvanced: e.target.checked })}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              aria-label={`${advancedLabel} for course ${index + 1}`}
            />
            <span className="text-xs text-text-muted sm:hidden">
              {advancedLabel}
            </span>
          </label>
        </div>
      ) : showAdvancedColumn ? (
        <span className="hidden sm:block" aria-hidden />
      ) : null}
      <button
        type="button"
        onClick={onRemove}
        disabled={!canRemove}
        className="flex h-10 w-10 items-center justify-center justify-self-end rounded-lg text-text-muted transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-30"
        aria-label={`Remove course ${index + 1}`}
      >
        <IconTrash />
      </button>
    </div>
  );
}
