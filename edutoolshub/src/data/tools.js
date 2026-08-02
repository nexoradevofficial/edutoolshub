import {
  IconAttendance,
  IconCertificate,
  IconCitation,
  IconComment,
  IconExamMarks,
  IconGpa,
  IconGpaChecker,
  IconGpaPercent,
  IconPercentToGpa,
  IconReceipt,
  IconReport,
  IconRubric,
  IconStarChart,
  IconStudy,
  IconTracing,
} from "../components/icons/ToolIcons";

export const tools = [
  {
    id: "gpa-to-percentage",
    name: "GPA to Percentage Converter",
    description:
      "Convert GPA to percentage on 4.0, 5.0, or 10.0 scales with letter grades, descriptors, and a visual score indicator.",
    icon: IconGpaPercent,
    status: "active",
    audience: "student",
    path: "/tools/gpa-to-percentage",
    color: "bg-accent/10 text-accent-dark",
  },
  {
    id: "percentage-to-gpa",
    name: "Percentage to GPA Converter",
    description:
      "Convert percentage scores to GPA on 4.0, 5.0, or 10.0 scales — the perfect companion to our GPA to percentage tool.",
    icon: IconPercentToGpa,
    status: "active",
    audience: "student",
    path: "/tools/percentage-to-gpa",
    color: "bg-primary/10 text-primary",
  },
  {
    id: "gpa-calculator",
    name: "GPA / CGPA Calculator",
    description:
      "Weighted & unweighted GPA and CGPA with country presets and a fully customizable scale — works with any college or university grading system worldwide.",
    icon: IconGpa,
    status: "active",
    audience: "student",
    path: "/tools/gpa-calculator",
    color: "bg-primary/10 text-primary",
  },
  {
    id: "gpa-requirement-checker",
    name: "College / University GPA Requirement Checker",
    description:
      "Search universities by GPA requirements across the US, Canada, UK, Australia, and Germany. Enter your GPA to see match results instantly.",
    icon: IconGpaChecker,
    status: "active",
    audience: "student",
    path: "/tools/college-university-gpa-requirement-checker",
    color: "bg-primary/10 text-primary-dark",
  },
  {
    id: "exam-marks-needed",
    name: "Final Grade Calculator",
    description:
      "See how many marks you need on your final exam to hit your target percentage — updates instantly as you type.",
    icon: IconExamMarks,
    status: "active",
    audience: "student",
    path: "/tools/final-grade-calculator",
    color: "bg-primary/10 text-primary-dark",
  },
  {
    id: "citation-generator",
    name: "Citation & Bibliography Generator",
    description:
      "Create APA 7 and MLA 9 citations for websites, books, and journal articles — with copy-ready bibliography and in-text citations.",
    icon: IconCitation,
    status: "active",
    audience: "student",
    path: "/tools/citation-generator",
    color: "bg-violet-100/80 text-violet-800",
  },
  {
    id: "study-time-calculator",
    name: "Study Time Calculator",
    description:
      "Plan exam revision by subject — enter days left, hours needed, and get a daily study breakdown that fits your schedule.",
    icon: IconStudy,
    status: "active",
    audience: "student",
    path: "/tools/study-time-calculator",
    color: "bg-accent/10 text-accent-dark",
  },
  {
    id: "attendance-sheet",
    name: "Attendance Sheet Generator",
    description:
      "Create printable monthly class registers with holidays, roll numbers, optional live P/A/L marking, and institute branding — ready to print or save as PDF.",
    icon: IconAttendance,
    status: "active",
    audience: "teacher",
    path: "/tools/attendance-sheet",
    color: "bg-accent/10 text-accent",
  },
  {
    id: "lesson-planner",
    name: "Lesson Planner",
    description:
      "Build lesson plans, schedule units on a calendar, map curriculum standards, and create substitute teacher plans — all saved locally in your browser.",
    icon: IconReport,
    status: "active",
    audience: "teacher",
    path: "/tools/lesson-planner",
    color: "bg-accent/10 text-accent-dark",
  },
  {
    id: "report-card-comments",
    name: "Report Card Comment Generator",
    description:
      "Generate professional report card comments by performance level — academic, behavior, participation, and work habits.",
    icon: IconComment,
    status: "active",
    audience: "teacher",
    path: "/tools/report-card-comment-generator",
    color: "bg-primary/10 text-primary-dark",
  },
  {
    id: "rubric-generator",
    name: "Rubric Generator",
    description:
      "Build customizable assessment rubrics with criteria and performance levels — print landscape rubrics for any assignment.",
    icon: IconRubric,
    status: "active",
    audience: "teacher",
    path: "/tools/rubric-generator",
    color: "bg-violet-100/80 text-violet-800",
  },
  {
    id: "certificate-maker",
    name: "Certificate Maker",
    description:
      "Design printable student achievement certificates with custom names, titles, and styles — ready to print and sign.",
    icon: IconCertificate,
    status: "active",
    audience: "teacher",
    path: "/tools/certificate-maker",
    color: "bg-amber-100/80 text-amber-800",
  },
  {
    id: "fee-receipt",
    name: "Fee Receipt Generator",
    description:
      "Generate printable school fee receipts with subject-wise fees, discounts, tax, and payment status — download as PDF in one click.",
    icon: IconReceipt,
    status: "active",
    audience: "teacher",
    path: "/tools/fee-receipt",
    color: "bg-accent/10 text-accent-dark",
  },
  {
    id: "tracing-sheet",
    name: "Worksheet & Tracing Sheet Generator",
    description:
      "Browse phonics, CVC, sight word, and alphabet worksheets — customize and print tracing sheets for Pre-K through 2nd grade.",
    icon: IconTracing,
    status: "active",
    audience: "both",
    path: "/tools/tracing-sheet-generator",
    color: "bg-amber-100/80 text-amber-800",
  },
  {
    id: "behavior-chart",
    name: "Behavior Star Chart Generator",
    description:
      "Build weekly or monthly reward star charts for up to 30 students — print clean A4 sheets for stickers and stamps.",
    icon: IconStarChart,
    status: "active",
    audience: "teacher",
    path: "/tools/behavior-chart-generator",
    color: "bg-violet-100/80 text-violet-800",
  },
];

export const activeTools = tools.filter((t) => t.status === "active");

export const studentTools = activeTools.filter((t) => t.audience === "student");
export const teacherTools = activeTools.filter((t) => t.audience === "teacher" || t.audience === "both");
