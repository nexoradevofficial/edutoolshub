import {
  IconAttendance,
  IconExamMarks,
  IconGpa,
  IconGpaChecker,
  IconGpaPercent,
} from "../components/icons/ToolIcons";

export const tools = [
  {
    id: "gpa-to-percentage",
    name: "GPA to Percentage Converter",
    description:
      "Convert GPA to percentage on 4.0, 5.0, or 10.0 scales with letter grades, descriptors, and a visual score indicator.",
    icon: IconGpaPercent,
    status: "active",
    path: "/tools/gpa-to-percentage",
    color: "bg-accent/10 text-accent-dark",
  },
  {
    id: "gpa-calculator",
    name: "GPA / CGPA Calculator",
    description:
      "Weighted & unweighted GPA and CGPA with country presets and a fully customizable scale — works with any college or university grading system worldwide.",
    icon: IconGpa,
    status: "active",
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
    path: "/tools/gpa-requirement-checker",
    color: "bg-primary/10 text-primary-dark",
  },
  {
    id: "attendance-sheet",
    name: "Attendance Sheet Generator",
    description: "Create printable class attendance sheets in seconds.",
    icon: IconAttendance,
    status: "active",
    path: "/tools/attendance-sheet",
    color: "bg-accent/10 text-accent",
  },
  {
    id: "exam-marks-needed",
    name: "Exam Marks Needed Calculator",
    description:
      "See how many marks you need on your final exam to hit your target percentage — updates instantly as you type.",
    icon: IconExamMarks,
    status: "active",
    path: "/tools/exam-marks-needed",
    color: "bg-primary/10 text-primary-dark",
  },
];

export const activeTools = tools.filter((t) => t.status === "active");
export const comingSoonTools = tools.filter((t) => t.status === "coming-soon");
