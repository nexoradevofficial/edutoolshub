import { STORAGE_KEY } from "./constants";

export const DEFAULT_STATE = {
  version: 1,
  lessonPlans: [],
  units: [],
  calendarPlacements: [],
  curriculum: {
    schoolYearStart: "",
    schoolYearEnd: "",
    terms: [],
    topics: [],
  },
  substitutePlans: [],
  settings: {
    colorMode: "subject",
    calendarView: "weekly",
    customSubjects: [],
    customGrades: [],
    customDurations: [],
    customFrameworks: [],
  },
};

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STATE,
      ...parsed,
      curriculum: { ...DEFAULT_STATE.curriculum, ...parsed.curriculum },
      settings: { ...DEFAULT_STATE.settings, ...parsed.settings },
    };
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function generateId() {
  return crypto.randomUUID();
}
