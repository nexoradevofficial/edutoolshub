import {
  CONVERSION_STATUS,
  GPA_SCALE_IDS,
  GPA_SCALES,
  percentageToDescriptor,
  percentageToLetterGrade,
  sanitizeGpaInput,
} from "./gpaToPercentage";

const round2 = (n) => Math.round(n * 100) / 100;

export function sanitizePercentageInput(raw) {
  return sanitizeGpaInput(raw);
}

function invertScale(scale) {
  if (scale.id === GPA_SCALE_IDS.SCALE_10) {
    return (percent) => percent / 9.5;
  }
  return (percent) => (percent / 100) * scale.maxGpa;
}

export function convertPercentageToGpa(percentInput, scaleId = GPA_SCALE_IDS.SCALE_4) {
  const scale = GPA_SCALES[scaleId] ?? GPA_SCALES[GPA_SCALE_IDS.SCALE_4];
  const cleaned = sanitizePercentageInput(percentInput);

  if (cleaned === "" || cleaned === ".") {
    return { status: CONVERSION_STATUS.INCOMPLETE, scale, cleaned, errors: {} };
  }

  const percentage = Number(cleaned);
  const errors = {};

  if (!Number.isFinite(percentage)) {
    errors.percentage = "Enter a valid number.";
    return { status: CONVERSION_STATUS.INVALID, scale, cleaned, percentage: null, errors };
  }

  if (percentage < 0) {
    errors.percentage = "Percentage cannot be negative.";
  } else if (percentage > 100) {
    errors.percentage = "Percentage cannot exceed 100.";
  }

  if (Object.keys(errors).length > 0) {
    return { status: CONVERSION_STATUS.INVALID, scale, cleaned, percentage, errors };
  }

  const gpa = round2(invertScale(scale)(percentage));
  const letterGrade = percentageToLetterGrade(percentage);
  const descriptor = percentageToDescriptor(percentage);

  return {
    status: CONVERSION_STATUS.VALID,
    scale,
    cleaned,
    percentage,
    gpa,
    letterGrade,
    descriptor,
    errors: {},
  };
}

export function formatPercentageToGpaText(result) {
  if (result.status !== CONVERSION_STATUS.VALID) return "";
  const { gpa, percentage, letterGrade, descriptor, scale } = result;
  return [
    "Percentage to GPA Conversion",
    `Scale: ${scale.label}`,
    `Percentage: ${percentage}%`,
    `GPA: ${gpa}`,
    `Letter grade: ${letterGrade}`,
    `Performance: ${descriptor}`,
  ].join("\n");
}

export function buildPercentageReferenceRows(scaleId) {
  const scale = GPA_SCALES[scaleId] ?? GPA_SCALES[GPA_SCALE_IDS.SCALE_4];
  const invert = invertScale(scale);
  const samples = [40, 50, 60, 70, 80, 90, 100];

  return samples.map((percentage) => {
    const gpa = round2(invert(percentage));
    return {
      percentage,
      gpa,
      letterGrade: percentageToLetterGrade(percentage),
      descriptor: percentageToDescriptor(percentage),
    };
  });
}

export { CONVERSION_STATUS, GPA_SCALE_IDS, GPA_SCALES };
