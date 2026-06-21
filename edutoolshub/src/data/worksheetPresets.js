export const GRADE_LEVELS = [
  { id: "prek", label: "Pre-K" },
  { id: "k", label: "Kindergarten" },
  { id: "1", label: "1st Grade" },
  { id: "2", label: "2nd Grade" },
];

export const WORKSHEET_SUBJECTS = [
  { id: "ela", label: "English Language Arts" },
  { id: "math", label: "Mathematics" },
  { id: "writing", label: "Handwriting" },
];

export const WORKSHEET_TYPES = [
  { id: "tracing", label: "Tracing" },
  { id: "cvc", label: "CVC Words" },
  { id: "sight", label: "Sight Words" },
  { id: "numbers", label: "Numbers" },
];

/** Curated presets inspired by common early-literacy worksheet libraries. */
export const WORKSHEET_PRESETS = [
  {
    id: "alphabet-upper",
    title: "Uppercase Alphabet Tracing",
    subject: "writing",
    grades: ["prek", "k"],
    type: "tracing",
    contentType: "letters",
    letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
    caseMode: "upper",
    sheetTitle: "Uppercase Letter Tracing",
    description: "Practice writing every uppercase letter with guide and dotted rows.",
  },
  {
    id: "alphabet-lower",
    title: "Lowercase Alphabet Tracing",
    subject: "ela",
    grades: ["k", "1"],
    type: "tracing",
    contentType: "letters",
    letters: "abcdefghijklmnopqrstuvwxyz".split("").map((c) => c.toUpperCase()),
    caseMode: "lower",
    sheetTitle: "Lowercase Letter Tracing",
    description: "Build fine-motor skills with lowercase letter practice rows.",
  },
  {
    id: "numbers-0-9",
    title: "Numbers 0–9 Tracing",
    subject: "math",
    grades: ["prek", "k"],
    type: "numbers",
    contentType: "numbers",
    numbers: "0123456789".split(""),
    sheetTitle: "Number Tracing 0–9",
    description: "Count and trace numerals with dotted practice lines.",
  },
  {
    id: "cvc-short-a",
    title: "Short A CVC Words",
    subject: "ela",
    grades: ["k", "1"],
    type: "cvc",
    contentType: "custom",
    customText: "cat hat mat rat bat",
    caseMode: "lower",
    sheetTitle: "Short A CVC Word Tracing",
    description: "Phonics practice for consonant-vowel-consonant words with short A.",
  },
  {
    id: "cvc-short-e",
    title: "Short E CVC Words",
    subject: "ela",
    grades: ["k", "1"],
    type: "cvc",
    contentType: "custom",
    customText: "bed red hen pen net",
    caseMode: "lower",
    sheetTitle: "Short E CVC Word Tracing",
    description: "Trace common short-E CVC words for beginning readers.",
  },
  {
    id: "cvc-short-i",
    title: "Short I CVC Words",
    subject: "ela",
    grades: ["k", "1"],
    type: "cvc",
    contentType: "custom",
    customText: "pig dig wig sit hit",
    caseMode: "lower",
    sheetTitle: "Short I CVC Word Tracing",
    description: "Hands-on CVC tracing for short I vowel patterns.",
  },
  {
    id: "sight-words-1",
    title: "Dolch Sight Words — Set 1",
    subject: "ela",
    grades: ["k", "1"],
    type: "sight",
    contentType: "custom",
    customText: "the and a to in is you",
    caseMode: "lower",
    sheetTitle: "Sight Word Tracing — Set 1",
    description: "High-frequency sight words for kindergarten and first grade.",
  },
  {
    id: "sight-words-2",
    title: "Dolch Sight Words — Set 2",
    subject: "ela",
    grades: ["1", "2"],
    type: "sight",
    contentType: "custom",
    customText: "said was that with have from",
    caseMode: "lower",
    sheetTitle: "Sight Word Tracing — Set 2",
    description: "Second set of common sight words for early readers.",
  },
  {
    id: "name-practice",
    title: "Custom Name Practice",
    subject: "writing",
    grades: ["prek", "k", "1"],
    type: "tracing",
    contentType: "custom",
    customText: "",
    caseMode: "both",
    sheetTitle: "Name Tracing Practice",
    description: "Type a student name or word to generate a personalized tracing sheet.",
  },
];

export function filterPresets({ subject, grade, type, query }) {
  const q = String(query ?? "")
    .trim()
    .toLowerCase();

  return WORKSHEET_PRESETS.filter((preset) => {
    if (subject && preset.subject !== subject) return false;
    if (grade && !preset.grades.includes(grade)) return false;
    if (type && preset.type !== type) return false;
    if (q && !preset.title.toLowerCase().includes(q) && !preset.description.toLowerCase().includes(q)) {
      return false;
    }
    return true;
  });
}

export function applyPreset(preset) {
  return {
    contentType: preset.contentType,
    selectedLetters: preset.letters ?? [],
    selectedNumbers: preset.numbers ?? [],
    customText: preset.customText ?? "",
    caseMode: preset.caseMode ?? "upper",
    title: preset.sheetTitle ?? preset.title,
  };
}
