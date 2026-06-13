/** How the user enters performance for a single course */
export const GRADE_INPUT_MODES = {
  LETTER: "letter",
  NUMERIC: "numeric",
};

/**
 * Parse per-course GPA (already on the school's scale).
 */
export function parseCourseGpa(raw, scaleMax) {
  if (raw === "" || raw == null) {
    return { valid: false, value: null };
  }

  const value = typeof raw === "string" ? parseFloat(raw.trim()) : Number(raw);

  if (Number.isNaN(value)) {
    return { valid: false, value: null, error: "Enter a valid number." };
  }
  if (value < 0) {
    return { valid: false, value: null, error: "GPA cannot be negative." };
  }
  if (value > scaleMax) {
    return {
      valid: false,
      value: null,
      error: `Cannot exceed your scale max (${scaleMax}).`,
    };
  }

  return { valid: true, value: Math.round(value * 100) / 100 };
}

/**
 * Whether a course row has enough data to include in the GPA average.
 */
export function isCourseComplete(course, scaleMax) {
  if (!course.name?.trim() || Number(course.credits) <= 0) {
    return false;
  }

  if (course.gradeInputMode === GRADE_INPUT_MODES.NUMERIC) {
    return parseCourseGpa(course.courseGpa, scaleMax).valid;
  }

  return Boolean(course.grade);
}
