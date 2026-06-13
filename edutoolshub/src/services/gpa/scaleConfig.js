/** Common GPA scale maximums schools use worldwide */
export const PRESET_SCALES = [
  { value: 4.0, label: "4.0" },
  { value: 4.33, label: "4.33" },
  { value: 5.0, label: "5.0" },
  { value: 7.0, label: "7.0" },
  { value: 10.0, label: "10.0" },
];

export const SCALE_MIN = 1;
export const SCALE_MAX = 10;
export const BASE_SCALE = 4.0;

/**
 * Validate and normalize a user-entered scale max.
 * @returns {{ valid: boolean, value: number|null, error?: string }}
 */
export function parseCustomScaleMax(raw) {
  const value = typeof raw === "string" ? parseFloat(raw.trim()) : Number(raw);

  if (Number.isNaN(value)) {
    return { valid: false, value: null, error: "Enter a valid number." };
  }
  if (value < SCALE_MIN || value > SCALE_MAX) {
    return {
      valid: false,
      value: null,
      error: `Scale must be between ${SCALE_MIN} and ${SCALE_MAX}.`,
    };
  }

  return { valid: true, value: Math.round(value * 100) / 100 };
}

export function formatScaleMax(scaleMax) {
  if (scaleMax == null) return "—";
  return Number.isInteger(scaleMax) ? String(scaleMax) : scaleMax.toFixed(2).replace(/\.?0+$/, "");
}

/**
 * Resolve effective scale: explicit override > country default.
 */
function countryDefaultScale(country, gpaType) {
  if (gpaType === "weighted" && country.scales.weighted > country.scales.unweighted) {
    return country.scales.weighted;
  }
  return country.scales.unweighted;
}

export function resolveScaleMax({ country, gpaType, customScaleMax }) {
  if (customScaleMax != null && customScaleMax !== "") {
    const parsed = parseCustomScaleMax(customScaleMax);
    if (parsed.valid && parsed.value != null) {
      return parsed.value;
    }
  }

  return countryDefaultScale(country, gpaType);
}

export function getCountryDefaultScale(country, gpaType) {
  return countryDefaultScale(country, gpaType);
}

/**
 * Map 4.0-base letter points onto the school's scale (e.g. A = 7.0 on a 7-point scale).
 */
export function scaleGradePoints(basePoints, scaleMax) {
  if (basePoints == null) return null;
  if (scaleMax === BASE_SCALE) return basePoints;
  return Math.min((basePoints / BASE_SCALE) * scaleMax, scaleMax);
}

/**
 * Weighted bonus scaled to the school's max (equivalent to +1.0 on a 4.0 scale).
 */
export function getWeightedBonus(scaleMax) {
  return (1.0 / BASE_SCALE) * scaleMax;
}
