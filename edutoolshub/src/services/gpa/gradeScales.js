/**
 * Letter grade → grade point mappings (unweighted 4.0 base).
 * Weighted US courses apply +1.0 bonus in calculator.js (capped at 5.0).
 */

export const LETTER_GRADES = [
  { label: "A+", points: 4.0 },
  { label: "A", points: 4.0 },
  { label: "A-", points: 3.7 },
  { label: "B+", points: 3.3 },
  { label: "B", points: 3.0 },
  { label: "B-", points: 2.7 },
  { label: "C+", points: 2.3 },
  { label: "C", points: 2.0 },
  { label: "C-", points: 1.7 },
  { label: "D+", points: 1.3 },
  { label: "D", points: 1.0 },
  { label: "F", points: 0.0 },
];

export const DEFAULT_GRADE = "A";

export function getGradePoints(gradeLabel) {
  const grade = LETTER_GRADES.find((g) => g.label === gradeLabel);
  return grade?.points ?? null;
}

export function getGradeOptions() {
  return LETTER_GRADES.map((g) => g.label);
}
