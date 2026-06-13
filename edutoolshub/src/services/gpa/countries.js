/**
 * Country-specific GPA rules.
 * Pure data — safe to move to a database or API later.
 */

export const GPA_TYPES = {
  UNWEIGHTED: "unweighted",
  WEIGHTED: "weighted",
};

export const COUNTRY_CODES = {
  US: "US",
  UK: "UK",
  CA: "CA",
  AU: "AU",
};

export const COUNTRIES = [
  {
    code: COUNTRY_CODES.US,
    name: "United States",
    flag: "🇺🇸",
    defaultGpaType: GPA_TYPES.WEIGHTED,
    allowedGpaTypes: [GPA_TYPES.WEIGHTED, GPA_TYPES.UNWEIGHTED],
    scales: {
      unweighted: 4.0,
      weighted: 5.0,
    },
    supportsAdvancedCourses: true,
    advancedLabel: "Honors / AP / IB",
    summary: "US high schools commonly report both weighted (5.0) and unweighted (4.0) GPA.",
    gpaTypeHints: {
      weighted:
        "Weighted GPA adds +1.0 for Honors/AP courses (max 5.0). Check the box on advanced classes.",
      unweighted:
        "Unweighted GPA uses a standard 4.0 scale — all courses count equally.",
    },
  },
  {
    code: COUNTRY_CODES.CA,
    name: "Canada",
    flag: "🇨🇦",
    defaultGpaType: GPA_TYPES.UNWEIGHTED,
    allowedGpaTypes: [GPA_TYPES.UNWEIGHTED],
    scales: {
      unweighted: 4.0,
      weighted: 4.0,
    },
    supportsAdvancedCourses: false,
    advancedLabel: null,
    summary: "Most Canadian schools use an unweighted 4.0 GPA (some provinces use 4.33).",
    gpaTypeHints: {
      unweighted: "Canadian institutions typically use an unweighted 4.0 scale.",
    },
  },
  {
    code: COUNTRY_CODES.UK,
    name: "United Kingdom",
    flag: "🇬🇧",
    defaultGpaType: GPA_TYPES.UNWEIGHTED,
    allowedGpaTypes: [GPA_TYPES.UNWEIGHTED],
    scales: {
      unweighted: 4.0,
      weighted: 4.0,
    },
    supportsAdvancedCourses: false,
    advancedLabel: null,
    summary:
      "UK schools usually use letter grades or degree classifications — this tool maps them to a 4.0 equivalent.",
    gpaTypeHints: {
      unweighted:
        "UK students: use this 4.0 equivalent when applying abroad. Official UK results may use different systems.",
    },
  },
  {
    code: COUNTRY_CODES.AU,
    name: "Australia",
    flag: "🇦🇺",
    defaultGpaType: GPA_TYPES.UNWEIGHTED,
    allowedGpaTypes: [GPA_TYPES.UNWEIGHTED],
    scales: {
      unweighted: 4.0,
      weighted: 4.0,
    },
    supportsAdvancedCourses: false,
    advancedLabel: null,
    summary:
      "Many Australian universities use a 4.0 GPA; some use a 7.0 scale (we use 4.0 here for consistency).",
    gpaTypeHints: {
      unweighted:
        "If your institution uses a 7.0 scale, check your transcript — this calculator uses the common 4.0 mapping.",
    },
  },
];

export function getCountryByCode(code) {
  return COUNTRIES.find((c) => c.code === code) ?? COUNTRIES[0];
}

export function getDefaultCountryCode() {
  return COUNTRY_CODES.US;
}
