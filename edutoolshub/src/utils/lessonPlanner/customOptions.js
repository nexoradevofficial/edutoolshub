import { CLASS_COLORS, DURATIONS, GRADES, SUBJECTS, SUBJECT_COLORS } from "./constants";

export function uniqueStrings(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = String(item).trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function uniqueNumbers(items) {
  const seen = new Set();
  return items
    .map((n) => Number(n))
    .filter((n) => {
      if (!Number.isFinite(n) || n <= 0 || seen.has(n)) return false;
      seen.add(n);
      return true;
    })
    .sort((a, b) => a - b);
}

export function mergeSubjects(defaults, customs, inUse = []) {
  return uniqueStrings([...defaults, ...customs, ...inUse]);
}

export function mergeGrades(defaults, customs, inUse = []) {
  return uniqueStrings([...defaults, ...customs, ...inUse]);
}

export function mergeDurations(defaults, customs, inUse = []) {
  return uniqueNumbers([...defaults, ...customs, ...inUse]);
}

export function getSubjectColor(subject) {
  if (!subject) return "#64748b";
  if (SUBJECT_COLORS[subject]) return SUBJECT_COLORS[subject];
  const hash = subject.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return CLASS_COLORS[hash % CLASS_COLORS.length];
}

export function collectInUseOptions(state) {
  const subjects = [];
  const grades = [];
  const durations = [];

  for (const plan of state.lessonPlans ?? []) {
    if (plan.subject) subjects.push(plan.subject);
    if (plan.grade) grades.push(plan.grade);
    if (plan.duration) durations.push(plan.duration);
  }
  for (const unit of state.units ?? []) {
    if (unit.subject) subjects.push(unit.subject);
    if (unit.grade) grades.push(unit.grade);
  }
  for (const sub of state.substitutePlans ?? []) {
    if (sub.subject) subjects.push(sub.subject);
    if (sub.grade) grades.push(sub.grade);
  }

  return { subjects, grades, durations };
}

export function buildOptionLists(state) {
  const inUse = collectInUseOptions(state);
  const customs = state.settings ?? {};

  return {
    subjects: mergeSubjects(SUBJECTS, customs.customSubjects ?? [], inUse.subjects),
    grades: mergeGrades(GRADES, customs.customGrades ?? [], inUse.grades),
    durations: mergeDurations(DURATIONS, customs.customDurations ?? [], inUse.durations),
  };
}
