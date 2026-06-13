export {
  COUNTRIES,
  COUNTRY_CODES,
  GPA_TYPES,
  getCountryByCode,
  getDefaultCountryCode,
} from "./countries.js";

export {
  LETTER_GRADES,
  DEFAULT_GRADE,
  getGradeOptions,
  getGradePoints,
} from "./gradeScales.js";

export {
  GRADE_INPUT_MODES,
  parseCourseGpa,
  isCourseComplete,
} from "./courseInput.js";

export {
  calculateGpa,
  getGpaSettingsForCountry,
  getScaleMax,
  resolveCourseGradePoints,
} from "./calculator.js";

export {
  PRESET_SCALES,
  SCALE_MIN,
  SCALE_MAX,
  BASE_SCALE,
  parseCustomScaleMax,
  formatScaleMax,
  resolveScaleMax,
  scaleGradePoints,
  getWeightedBonus,
  getCountryDefaultScale,
} from "./scaleConfig.js";
