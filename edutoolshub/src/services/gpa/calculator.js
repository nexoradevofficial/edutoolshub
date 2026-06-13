import { getCountryByCode, GPA_TYPES } from "./countries.js";
import { getGradePoints } from "./gradeScales.js";
import { GRADE_INPUT_MODES, isCourseComplete, parseCourseGpa } from "./courseInput.js";
import {
  formatScaleMax,
  getWeightedBonus,
  parseCustomScaleMax,
  resolveScaleMax,
  scaleGradePoints,
} from "./scaleConfig.js";

/**
 * @deprecated Use resolveScaleMax from scaleConfig.js
 */
export function getScaleMax(country, gpaType) {
  return resolveScaleMax({ country, gpaType, customScaleMax: null });
}

/**
 * Compute grade points for one course based on country rules and school scale.
 */
export function resolveCourseGradePoints(course, country, gpaType, scaleMax) {
  if (course.gradeInputMode === GRADE_INPUT_MODES.NUMERIC) {
    const parsed = parseCourseGpa(course.courseGpa, scaleMax);
    return parsed.valid ? parsed.value : null;
  }

  const base = getGradePoints(course.grade);
  if (base === null) return null;

  let points = scaleGradePoints(base, scaleMax);

  if (
    gpaType === GPA_TYPES.WEIGHTED &&
    country.supportsAdvancedCourses &&
    course.isAdvanced
  ) {
    points = Math.min(points + getWeightedBonus(scaleMax), scaleMax);
  }

  return points;
}

/**
 * Core GPA calculation — backend-ready pure function.
 *
 * @param {Object} input
 * @param {string} input.countryCode
 * @param {string} input.gpaType
 * @param {number} [input.customScaleMax] - School's GPA scale max (overrides country default)
 * @param {Array} input.courses
 */
export function calculateGpa(input) {
  const { countryCode, gpaType, courses, customScaleMax } = input;
  const country = getCountryByCode(countryCode);
  const countryDefaultScale = resolveScaleMax({ country, gpaType, customScaleMax: null });
  const scaleMax = resolveScaleMax({ country, gpaType, customScaleMax });
  const usingCustomScale =
    customScaleMax != null &&
    parseCustomScaleMax(customScaleMax).valid &&
    scaleMax !== countryDefaultScale;

  if (!country.allowedGpaTypes.includes(gpaType)) {
    return {
      success: false,
      error: `GPA type "${gpaType}" is not supported for ${country.name}.`,
      gpa: null,
      scaleMax,
      scaleMaxFormatted: formatScaleMax(scaleMax),
      countryDefaultScale,
      usingCustomScale,
      countryCode: country.code,
      gpaType: country.defaultGpaType,
      totalCredits: 0,
      courseCount: 0,
    };
  }

  const valid = courses.filter((c) => isCourseComplete(c, scaleMax));

  if (valid.length === 0) {
    return {
      success: true,
      gpa: null,
      scaleMax,
      scaleMaxFormatted: formatScaleMax(scaleMax),
      countryDefaultScale,
      usingCustomScale,
      countryCode: country.code,
      gpaType,
      totalCredits: 0,
      courseCount: 0,
      message: "Add at least one course with name, credits, and a letter grade or course GPA.",
    };
  }

  let totalPoints = 0;
  let totalCredits = 0;

  for (const course of valid) {
    const points = resolveCourseGradePoints(course, country, gpaType, scaleMax);
    if (points === null) continue;
    const credits = Number(course.credits);
    totalPoints += points * credits;
    totalCredits += credits;
  }

  if (totalCredits === 0) {
    return {
      success: true,
      gpa: null,
      scaleMax,
      scaleMaxFormatted: formatScaleMax(scaleMax),
      countryDefaultScale,
      usingCustomScale,
      countryCode: country.code,
      gpaType,
      totalCredits: 0,
      courseCount: 0,
      message: "Could not calculate — check grades and credits.",
    };
  }

  const gpa = totalPoints / totalCredits;

  return {
    success: true,
    gpa: gpa.toFixed(2),
    scaleMax,
    scaleMaxFormatted: formatScaleMax(scaleMax),
    countryDefaultScale,
    usingCustomScale,
    countryCode: country.code,
    gpaType,
    totalCredits,
    courseCount: valid.length,
    gpaTypeLabel: gpaType === GPA_TYPES.WEIGHTED ? "Weighted" : "Unweighted",
    countryName: country.name,
  };
}

/**
 * Settings returned when user picks a country (mirrors future GET /api/gpa/settings).
 */
export function getGpaSettingsForCountry(countryCode, gpaType) {
  const country = getCountryByCode(countryCode);
  const type = gpaType ?? country.defaultGpaType;
  const recommendedScale = resolveScaleMax({
    country,
    gpaType: type,
    customScaleMax: null,
  });

  return {
    countryCode: country.code,
    countryName: country.name,
    flag: country.flag,
    defaultGpaType: country.defaultGpaType,
    allowedGpaTypes: country.allowedGpaTypes,
    scales: country.scales,
    recommendedScale,
    supportsAdvancedCourses: country.supportsAdvancedCourses,
    advancedLabel: country.advancedLabel,
    summary: country.summary,
    gpaTypeHints: country.gpaTypeHints,
    canToggleGpaType: country.allowedGpaTypes.length > 1,
  };
}
