import Button from "../../ui/Button";
import { IconPlus, IconTrash } from "../../icons/ToolIcons";
import CourseRow from "./CourseRow";
import {
  MAX_COURSES_PER_SEMESTER,
  MIN_COURSES_PER_SEMESTER,
} from "../../../utils/gpa";

const inputClass =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

/**
 * The course editor for the currently-active semester.
 *
 * Includes:
 *   - An inline editable semester name (Fall 2025, "Summer Internship", etc.)
 *   - A "Delete semester" button (disabled when there's only one semester)
 *   - Per-semester live GPA pill
 *   - The course rows with add/remove
 */
export default function SemesterCourses({
  semester,
  semesterResult,
  semesterIndex,
  semesterCount,
  showAdvancedColumn,
  advancedLabel,
  scaleMax,
  scaleLabel,
  gradeOptions,
  onRenameSemester,
  onRemoveSemester,
  onAddCourse,
  onPatchCourse,
  onRemoveCourse,
}) {
  const courseCount = semester.courses.length;
  const atMaxCourses = courseCount >= MAX_COURSES_PER_SEMESTER;
  const canRemoveCourse = courseCount > MIN_COURSES_PER_SEMESTER;
  const canRemoveSemester = semesterCount > 1;

  const headerCols = showAdvancedColumn
    ? "sm:grid-cols-[minmax(0,1fr)_minmax(120px,140px)_72px_56px_40px]"
    : "sm:grid-cols-[minmax(0,1fr)_minmax(120px,140px)_72px_40px]";

  const gpaText = semesterResult?.gpa ?? null;
  const totalCredits = semesterResult?.totalCredits ?? 0;
  const validCount = semesterResult?.courseCount ?? 0;

  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8 print:hidden">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
            {semesterIndex + 1}
          </span>
          <input
            type="text"
            value={semester.name}
            onChange={(e) => onRenameSemester(e.target.value)}
            placeholder={`Semester ${semesterIndex + 1}`}
            className={`${inputClass} max-w-xs font-semibold`}
            aria-label="Semester name"
            maxLength={40}
          />
        </div>

        <div className="flex items-center gap-2">
          {gpaText && (
            <span className="rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-bold tabular-nums text-primary">
              GPA {gpaText}
              <span className="ml-1 text-[11px] font-medium text-primary/70">
                · {validCount} course{validCount === 1 ? "" : "s"}
                {" · "}
                {totalCredits} cr
              </span>
            </span>
          )}
          <button
            type="button"
            onClick={onRemoveSemester}
            disabled={!canRemoveSemester}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-text-muted transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Remove this semester"
          >
            <IconTrash className="h-4 w-4" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>

      <p className="mt-3 text-sm text-text-muted">
        Per course: pick a letter grade or enter the GPA your school gave you
        for that class. Add or remove courses freely — semesters start with
        four rows.
      </p>

      <div
        className={`mb-4 mt-4 hidden gap-3 text-xs font-semibold uppercase tracking-wide text-text-muted sm:grid ${headerCols}`}
      >
        <span>Course name</span>
        <span>Grade / GPA</span>
        <span>Credits</span>
        {showAdvancedColumn && <span className="text-center">Honors</span>}
        <span />
      </div>

      <div className="space-y-3">
        {semester.courses.map((course, index) => (
          <CourseRow
            key={course.id}
            course={course}
            index={index}
            showAdvancedColumn={showAdvancedColumn}
            advancedLabel={advancedLabel}
            scaleMax={scaleMax}
            scaleLabel={scaleLabel}
            gradeOptions={gradeOptions}
            rowCols={headerCols}
            canRemove={canRemoveCourse}
            onPatch={(patch) => onPatchCourse(course.id, patch)}
            onRemove={() => onRemoveCourse(course.id)}
          />
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={onAddCourse}
          disabled={atMaxCourses}
        >
          <IconPlus />
          Add course
        </Button>
        {atMaxCourses && (
          <span className="text-xs text-text-muted">
            Maximum of {MAX_COURSES_PER_SEMESTER} courses per semester reached.
          </span>
        )}
      </div>
    </div>
  );
}
