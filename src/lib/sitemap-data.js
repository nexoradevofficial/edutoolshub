import { SITE_URL } from "@/constants/site";

export const STATIC_PAGES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/tools", priority: "0.9", changefreq: "weekly" },
  { path: "/blog", priority: "0.9", changefreq: "weekly" },
  { path: "/about", priority: "0.6", changefreq: "monthly" },
  { path: "/contact", priority: "0.6", changefreq: "monthly" },
  { path: "/privacy", priority: "0.3", changefreq: "yearly" },
  { path: "/terms", priority: "0.3", changefreq: "yearly" },
];

export const TOOL_PAGES = [
  { path: "/tools/gpa-to-percentage", priority: "0.8", changefreq: "monthly" },
  { path: "/tools/gpa-calculator", priority: "0.8", changefreq: "monthly" },
  {
    path: "/tools/college-university-gpa-requirement-checker",
    priority: "0.8",
    changefreq: "monthly",
  },
  { path: "/tools/attendance-sheet", priority: "0.8", changefreq: "monthly" },
  { path: "/tools/lesson-planner", priority: "0.8", changefreq: "monthly" },
  { path: "/tools/final-grade-calculator", priority: "0.8", changefreq: "monthly" },
  { path: "/tools/fee-receipt", priority: "0.8", changefreq: "monthly" },
  { path: "/tools/tracing-sheet-generator", priority: "0.8", changefreq: "monthly" },
  { path: "/tools/behavior-chart-generator", priority: "0.8", changefreq: "monthly" },
];

export { SITE_URL };
