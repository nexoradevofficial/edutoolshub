import { SITE_URL } from "@/constants/site";
import { getSaasSitemapPages } from "@/lib/saas-seo";

/** Navbar links — keep in sync with src/components/Navbar.jsx navLinks */
export const NAV_PAGES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/tools", priority: "0.9", changefreq: "weekly" },
  { path: "/saas", priority: "0.9", changefreq: "weekly" },
  { path: "/blog", priority: "0.9", changefreq: "weekly" },
  { path: "/about", priority: "0.6", changefreq: "monthly" },
  { path: "/contact", priority: "0.6", changefreq: "monthly" },
  { path: "/privacy", priority: "0.3", changefreq: "yearly" },
  { path: "/terms", priority: "0.3", changefreq: "yearly" },
  { path: "/cookies", priority: "0.3", changefreq: "yearly" },
];

/**
 * SaaS product landings — generated automatically from src/data/saasSolutions.js.
 * Prefer getSaasSitemapPages() in sitemap.js so new products appear without edits here.
 * @deprecated Use getSaasSitemapPages from @/lib/saas-seo
 */
export const SAAS_PAGES = getSaasSitemapPages();

export const TOOL_PAGES = [
  { path: "/tools/gpa-to-percentage", priority: "0.8", changefreq: "monthly" },
  { path: "/tools/percentage-to-gpa", priority: "0.8", changefreq: "monthly" },
  { path: "/tools/gpa-calculator", priority: "0.8", changefreq: "monthly" },
  {
    path: "/tools/college-university-gpa-requirement-checker",
    priority: "0.8",
    changefreq: "monthly",
  },
  { path: "/tools/attendance-sheet", priority: "0.8", changefreq: "monthly" },
  { path: "/tools/lesson-planner", priority: "0.8", changefreq: "monthly" },
  { path: "/tools/final-grade-calculator", priority: "0.8", changefreq: "monthly" },
  { path: "/tools/citation-generator", priority: "0.8", changefreq: "monthly" },
  { path: "/tools/study-time-calculator", priority: "0.8", changefreq: "monthly" },
  { path: "/tools/report-card-comment-generator", priority: "0.8", changefreq: "monthly" },
  { path: "/tools/rubric-generator", priority: "0.8", changefreq: "monthly" },
  { path: "/tools/certificate-maker", priority: "0.8", changefreq: "monthly" },
  { path: "/tools/fee-receipt", priority: "0.8", changefreq: "monthly" },
  { path: "/tools/tracing-sheet-generator", priority: "0.8", changefreq: "monthly" },
  { path: "/tools/behavior-chart-generator", priority: "0.8", changefreq: "monthly" },
];

export { SITE_URL, getSaasSitemapPages };
