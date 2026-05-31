/**
 * GPA match verdicts for the main checker (card grid) and detail pages.
 */

export const MATCH_LABELS = {
  STRONG: "Strong Match",
  POSSIBLE: "Possible Match",
  REACH: "Reach",
  BORDERLINE: "Borderline",
  BELOW: "Below Requirements",
};

/** Card-level match when student GPA is entered on the main tool page. */
export function getCardMatch(studentGpa, minGpa, avgGpa) {
  if (studentGpa == null || Number.isNaN(studentGpa)) return null;
  if (studentGpa >= avgGpa) return MATCH_LABELS.STRONG;
  if (studentGpa >= minGpa) return MATCH_LABELS.POSSIBLE;
  return MATCH_LABELS.REACH;
}

/** Detail-page verdict with explanations. */
export function getDetailVerdict(studentGpa, minGpa, avgGpa) {
  if (studentGpa == null || Number.isNaN(studentGpa)) {
    return { label: null, explanation: null, tone: "neutral" };
  }

  if (studentGpa >= avgGpa) {
    return {
      label: MATCH_LABELS.STRONG,
      tone: "success",
      explanation:
        "Your GPA meets or exceeds the average for admitted students. Continue building a strong application with extracurriculars, essays, and test scores where required.",
    };
  }

  if (studentGpa >= minGpa) {
    return {
      label: MATCH_LABELS.POSSIBLE,
      tone: "info",
      explanation:
        "Your GPA meets the typical minimum but is below the average for admitted students. A compelling personal statement, strong recommendations, and standout achievements can strengthen your application.",
    };
  }

  const gap = minGpa - studentGpa;
  if (gap <= 0.15) {
    return {
      label: MATCH_LABELS.BORDERLINE,
      tone: "warning",
      explanation:
        "Your GPA is slightly below the typical minimum. Consider highlighting an upward grade trend, rigorous coursework, or contextual factors in your application.",
    };
  }

  return {
    label: MATCH_LABELS.BELOW,
    tone: "danger",
    explanation:
      "Your GPA is significantly below the typical minimum for this university. Focus on schools where your GPA is competitive, or explore transfer pathways after improving your academic record.",
  };
}

export function matchBadgeClasses(label) {
  switch (label) {
    case MATCH_LABELS.STRONG:
      return "bg-accent/15 text-accent-dark border-accent/30";
    case MATCH_LABELS.POSSIBLE:
      return "bg-primary/10 text-primary border-primary/25";
    case MATCH_LABELS.REACH:
      return "bg-amber-50 text-amber-800 border-amber-200";
    case MATCH_LABELS.BORDERLINE:
      return "bg-orange-50 text-orange-800 border-orange-200";
    case MATCH_LABELS.BELOW:
      return "bg-red-50 text-red-800 border-red-200";
    default:
      return "bg-surface-muted text-text-muted border-border";
  }
}
