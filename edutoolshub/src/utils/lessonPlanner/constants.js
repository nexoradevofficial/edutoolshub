export const STORAGE_KEY = "edutoolshub-lesson-planner";

export const MODULES = [
  { id: "builder", label: "Lesson Plans", shortLabel: "Plans" },
  { id: "units", label: "Unit Planner", shortLabel: "Units" },
  { id: "curriculum", label: "Curriculum", shortLabel: "Curriculum" },
  { id: "substitute", label: "Substitute", shortLabel: "Sub" },
];

export const SUBJECTS = [
  "Mathematics",
  "English",
  "Science",
  "Social Studies",
  "History",
  "Geography",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Art",
  "Music",
  "Physical Education",
  "Languages",
  "Other",
];

export const GRADES = [
  "K",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "IB PYP",
  "IB MYP",
  "IB DP",
  "A-Level",
  "IGCSE",
];

export const DURATIONS = [30, 40, 45, 50, 60, 75, 90, 120];

export const DEFAULT_SECTIONS = [
  { type: "objectives", title: "Learning Objectives" },
  { type: "activities", title: "Activities" },
  { type: "resources", title: "Resources" },
  { type: "assessment", title: "Assessment" },
];

export const STANDARDS_FRAMEWORKS = [
  { id: "ib", label: "IB (International Baccalaureate)" },
  { id: "cambridge", label: "Cambridge (IGCSE/A-Level)" },
  { id: "cbse", label: "CBSE (India)" },
];

export const SAMPLE_STANDARDS = {
  ib: [
    "MYP Criterion A: Knowing and understanding",
    "MYP Criterion B: Investigating patterns",
    "MYP Criterion C: Communicating",
    "MYP Criterion D: Applying mathematics in real-life contexts",
    "DP Topic 1: Number and algebra",
    "DP Topic 2: Functions",
  ],
  cambridge: [
    "0580: Number",
    "0580: Algebra and graphs",
    "0580: Geometry",
    "0580: Mensuration",
    "9709: Pure Mathematics 1",
    "9709: Mechanics",
  ],
  cbse: [
    "Class 10: Real Numbers",
    "Class 10: Polynomials",
    "Class 10: Pair of Linear Equations",
    "Class 12: Relations and Functions",
    "Class 12: Matrices",
    "Class 12: Calculus",
  ],
};

export const SUBJECT_COLORS = {
  Mathematics: "#2563eb",
  English: "#7c3aed",
  Science: "#059669",
  "Social Studies": "#d97706",
  History: "#b45309",
  Geography: "#0891b2",
  Physics: "#4f46e5",
  Chemistry: "#0d9488",
  Biology: "#16a34a",
  "Computer Science": "#6366f1",
  Art: "#db2777",
  Music: "#c026d3",
  "Physical Education": "#ea580c",
  Languages: "#0284c7",
  Other: "#64748b",
};

export const CLASS_COLORS = [
  "#2563eb",
  "#7c3aed",
  "#059669",
  "#d97706",
  "#db2777",
  "#0891b2",
  "#ea580c",
  "#4f46e5",
];

export const COVERAGE_STATUSES = [
  { id: "pending", label: "Pending", color: "#94a3b8" },
  { id: "taught", label: "Taught", color: "#10b981" },
  { id: "skipped", label: "Skipped", color: "#f59e0b" },
];

export const PLACEMENT_STATUSES = [
  { id: "planned", label: "Planned" },
  { id: "taught", label: "Taught" },
];
