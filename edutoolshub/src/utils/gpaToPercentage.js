/**
 * GPA → percentage conversion for multiple grading scales.
 * Pure logic (no React) so it can be tested and reused by the UI.
 */

export const GPA_SCALE_IDS = {
  SCALE_4: "scale_4",
  SCALE_5: "scale_5",
  SCALE_10: "scale_10",
};

/** Metadata for each scale: max GPA, formula, and tooltip copy. */
export const GPA_SCALES = {
  [GPA_SCALE_IDS.SCALE_4]: {
    id: GPA_SCALE_IDS.SCALE_4,
    label: "4.0 Scale (US Standard)",
    maxGpa: 4,
    tooltip:
      "Common in the United States. Percentage = (GPA ÷ 4.0) × 100. A 4.0 GPA equals 100%.",
    convert(gpa) {
      return (gpa / 4) * 100;
    },
  },
  [GPA_SCALE_IDS.SCALE_5]: {
    id: GPA_SCALE_IDS.SCALE_5,
    label: "5.0 Scale",
    maxGpa: 5,
    tooltip:
      "Used when courses are graded on a 5-point scale (often with weighted honors). Percentage = (GPA ÷ 5.0) × 100.",
    convert(gpa) {
      return (gpa / 5) * 100;
    },
  },
  [GPA_SCALE_IDS.SCALE_10]: {
    id: GPA_SCALE_IDS.SCALE_10,
    label: "10.0 Scale (India / South Asia)",
    maxGpa: 10,
    tooltip:
      "Widely used in India and neighbouring countries. Percentage ≈ GPA × 9.5 (e.g. 8.0 GPA → 76%).",
    convert(gpa) {
      return gpa * 9.5;
    },
  },
};

export const CONVERSION_STATUS = {
  INCOMPLETE: "incomplete",
  INVALID: "invalid",
  VALID: "valid",
};

const round2 = (n) => Math.round(n * 100) / 100;

/**
 * Sanitize raw input: trim, allow only digits and one decimal point.
 * Returns the cleaned string (may be empty).
 */
export function sanitizeGpaInput(raw) {
  if (raw == null) return "";
  const trimmed = String(raw).trim();
  if (trimmed === "") return "";
  let out = "";
  let seenDot = false;
  for (const ch of trimmed) {
    if (ch >= "0" && ch <= "9") {
      out += ch;
    } else if (ch === "." && !seenDot) {
      seenDot = true;
      out += ch;
    }
  }
  return out;
}

/**
 * Map overall percentage to a letter grade (simplified bands).
 */
export function percentageToLetterGrade(percent) {
  if (percent == null || Number.isNaN(percent)) return "—";
  if (percent >= 90) return "A+";
  if (percent >= 80) return "A";
  if (percent >= 70) return "B+";
  if (percent >= 60) return "B";
  if (percent >= 50) return "C";
  if (percent >= 40) return "D";
  return "F";
}

/**
 * Human-readable performance descriptor from percentage.
 */
export function percentageToDescriptor(percent) {
  if (percent == null || Number.isNaN(percent)) return "—";
  if (percent >= 80) return "Excellent";
  if (percent >= 60) return "Good";
  if (percent >= 50) return "Average";
  return "Poor";
}

/**
 * Styling hints for the result card based on descriptor tier.
 */
export function getDescriptorStyles(descriptor) {
  switch (descriptor) {
    case "Excellent":
      return {
        border: "border-emerald-200",
        bg: "bg-gradient-to-br from-emerald-50 via-white to-accent/5",
        accent: "bg-emerald-500",
        text: "text-emerald-800",
        ring: "#10b981",
      };
    case "Good":
      return {
        border: "border-blue-200",
        bg: "bg-gradient-to-br from-blue-50 via-white to-primary/5",
        accent: "bg-blue-500",
        text: "text-blue-800",
        ring: "#2563eb",
      };
    case "Average":
      return {
        border: "border-amber-200",
        bg: "bg-gradient-to-br from-amber-50 via-white to-amber-50/30",
        accent: "bg-amber-500",
        text: "text-amber-800",
        ring: "#f59e0b",
      };
    case "Poor":
      return {
        border: "border-red-200",
        bg: "bg-gradient-to-br from-red-50 via-white to-red-50/30",
        accent: "bg-red-500",
        text: "text-red-800",
        ring: "#ef4444",
      };
    default:
      return {
        border: "border-border",
        bg: "bg-white",
        accent: "bg-slate-300",
        text: "text-text-muted",
        ring: "#cbd5e1",
      };
  }
}

/**
 * Convert GPA string + scale id into percentage, grade, and validation state.
 */
export function convertGpaToPercentage(gpaInput, scaleId = GPA_SCALE_IDS.SCALE_4) {
  const scale = GPA_SCALES[scaleId] ?? GPA_SCALES[GPA_SCALE_IDS.SCALE_4];
  const cleaned = sanitizeGpaInput(gpaInput);

  if (cleaned === "" || cleaned === ".") {
    return {
      status: CONVERSION_STATUS.INCOMPLETE,
      scale,
      cleaned,
      errors: {},
    };
  }

  const gpa = Number(cleaned);
  const errors = {};

  if (!Number.isFinite(gpa)) {
    errors.gpa = "Enter a valid number.";
    return { status: CONVERSION_STATUS.INVALID, scale, cleaned, gpa: null, errors };
  }

  if (gpa < 0) {
    errors.gpa = "GPA cannot be negative.";
  } else if (gpa > scale.maxGpa) {
    errors.gpa = `GPA cannot exceed ${scale.maxGpa} on the ${scale.label}.`;
  }

  if (Object.keys(errors).length > 0) {
    return { status: CONVERSION_STATUS.INVALID, scale, cleaned, gpa, errors };
  }

  const percentage = round2(scale.convert(gpa));
  const letterGrade = percentageToLetterGrade(percentage);
  const descriptor = percentageToDescriptor(percentage);

  return {
    status: CONVERSION_STATUS.VALID,
    scale,
    cleaned,
    gpa,
    percentage,
    letterGrade,
    descriptor,
    errors: {},
  };
}

/**
 * Build copy-friendly plain-text summary for clipboard.
 */
export function formatConversionResultText(result) {
  if (result.status !== CONVERSION_STATUS.VALID) return "";
  const { gpa, percentage, letterGrade, descriptor, scale } = result;
  return [
    "GPA to Percentage Conversion",
    `Scale: ${scale.label}`,
    `GPA: ${gpa}`,
    `Percentage: ${percentage}%`,
    `Letter grade: ${letterGrade}`,
    `Performance: ${descriptor}`,
  ].join("\n");
}

/**
 * Reference rows for the lookup table (GPA samples across the scale).
 */
export function buildReferenceTableRows(scaleId) {
  const scale = GPA_SCALES[scaleId] ?? GPA_SCALES[GPA_SCALE_IDS.SCALE_4];
  const max = scale.maxGpa;
  const steps =
    max <= 5
      ? [0, 1, 2, 3, 4, max]
      : [0, 2, 4, 6, 8, 10].filter((g) => g <= max);

  const unique = [...new Set(steps)];
  if (!unique.includes(max)) unique.push(max);

  return unique.map((gpa) => {
    const pct = round2(scale.convert(gpa));
    return {
      gpa,
      percentage: pct,
      letterGrade: percentageToLetterGrade(pct),
      descriptor: percentageToDescriptor(pct),
    };
  });
}
