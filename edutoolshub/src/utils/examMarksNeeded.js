export const EXAM_RESULT_STATUS = {
  INCOMPLETE: "incomplete",
  INVALID: "invalid",
  ALREADY_PASSED: "already_passed",
  ACHIEVABLE: "achievable",
  NOT_ACHIEVABLE: "not_achievable",
};

function parseNonNegative(value) {
  if (value === "" || value === null || value === undefined) return null;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return NaN;
  return n;
}

/**
 * Minimum marks required on the final exam to reach targetPercent overall.
 * Returns validation errors, status, and derived values for the UI.
 */
export function calculateExamMarksNeeded({
  marksObtained,
  totalCompleted,
  finalExamTotal,
  targetPercent = 50,
}) {
  const obtained = parseNonNegative(marksObtained);
  const completedTotal = parseNonNegative(totalCompleted);
  const finalTotal = parseNonNegative(finalExamTotal);
  const target = parseNonNegative(targetPercent);

  const errors = {};

  if (obtained === null || completedTotal === null || finalTotal === null || target === null) {
    return { status: EXAM_RESULT_STATUS.INCOMPLETE, errors };
  }

  if (Number.isNaN(obtained)) errors.marksObtained = "Enter a valid number (0 or higher).";
  if (Number.isNaN(completedTotal)) errors.totalCompleted = "Enter a valid number (0 or higher).";
  if (Number.isNaN(finalTotal)) errors.finalExamTotal = "Enter a valid number (0 or higher).";
  if (Number.isNaN(target)) errors.targetPercent = "Enter a valid percentage (0 or higher).";

  if (Object.keys(errors).length > 0) {
    return { status: EXAM_RESULT_STATUS.INVALID, errors };
  }

  if (obtained > completedTotal) {
    errors.marksObtained = "Marks obtained cannot exceed total marks of completed assessments.";
  }
  if (completedTotal === 0) {
    errors.totalCompleted = "Total completed marks must be greater than 0.";
  }
  if (finalTotal === 0) {
    errors.finalExamTotal = "Final exam total marks must be greater than 0.";
  }
  if (target > 100) {
    errors.targetPercent = "Target percentage cannot exceed 100%.";
  }

  if (Object.keys(errors).length > 0) {
    return { status: EXAM_RESULT_STATUS.INVALID, errors };
  }

  const grandTotal = completedTotal + finalTotal;
  const targetMarks = (target / 100) * grandTotal;
  const marksNeeded = targetMarks - obtained;
  const currentPercent = (obtained / grandTotal) * 100;
  const maxPossiblePercent = ((obtained + finalTotal) / grandTotal) * 100;

  const round2 = (n) => Math.round(n * 100) / 100;

  if (marksNeeded <= 0) {
    return {
      status: EXAM_RESULT_STATUS.ALREADY_PASSED,
      errors,
      marksNeeded: 0,
      projectedPercent: round2(currentPercent),
      currentPercent: round2((obtained / completedTotal) * 100),
      maxPossiblePercent: round2(maxPossiblePercent),
      message: "You've already passed!",
    };
  }

  const roundedNeeded = round2(marksNeeded);

  if (marksNeeded > finalTotal) {
    return {
      status: EXAM_RESULT_STATUS.NOT_ACHIEVABLE,
      errors,
      marksNeeded: roundedNeeded,
      projectedPercent: round2(target),
      currentPercent: round2(currentPercent),
      maxPossiblePercent: round2(maxPossiblePercent),
      message: "Not achievable even with full marks",
      statusLabel: "Not achievable ✗",
    };
  }

  const projectedPercent = ((obtained + marksNeeded) / grandTotal) * 100;

  return {
    status: EXAM_RESULT_STATUS.ACHIEVABLE,
    errors,
    marksNeeded: roundedNeeded,
    projectedPercent: round2(projectedPercent),
    currentPercent: round2(currentPercent),
    maxPossiblePercent: round2(maxPossiblePercent),
    message: "Achievable ✓",
    statusLabel: "Achievable ✓",
  };
}
