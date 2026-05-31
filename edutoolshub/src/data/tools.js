import { IconAttendance, IconGpa, IconGpaChecker } from "../components/icons/ToolIcons";

export const tools = [
  {
    id: "gpa-calculator",
    name: "GPA Calculator",
    description:
      "Weighted & unweighted GPA with country presets and a fully customizable scale — works with any school's grading system worldwide.",
    icon: IconGpa,
    status: "active",
    path: "/tools/gpa-calculator",
    color: "bg-primary/10 text-primary",
  },
  {
    id: "gpa-requirement-checker",
    name: "College GPA Requirement Checker",
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
];

export const activeTools = tools.filter((t) => t.status === "active");
export const comingSoonTools = tools.filter((t) => t.status === "coming-soon");
