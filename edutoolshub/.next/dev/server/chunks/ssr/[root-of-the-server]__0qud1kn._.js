module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/src/lib/metadata.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildPageMetadata",
    ()=>buildPageMetadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$site$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/site.js [app-rsc] (ecmascript)");
;
const DEFAULT_OG_IMAGE = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$site$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SITE_URL"]}/logo.png`;
function buildPageMetadata({ title, description, path = "", keywords, noIndex = false }) {
    const url = path ? `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$site$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SITE_URL"]}${path}` : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$site$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SITE_URL"];
    return {
        title,
        description,
        keywords,
        alternates: {
            canonical: url
        },
        openGraph: {
            type: "website",
            siteName: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$site$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SITE_NAME"],
            title,
            description,
            url,
            images: [
                {
                    url: DEFAULT_OG_IMAGE,
                    width: 1024,
                    height: 1024,
                    alt: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$site$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SITE_NAME"]} logo`
                }
            ]
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [
                DEFAULT_OG_IMAGE
            ]
        },
        robots: noIndex ? {
            index: false,
            follow: false
        } : {
            index: true,
            follow: true
        }
    };
}
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/src/lib/env.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Public env vars — supports both Next.js and legacy Vite names during migration. */ __turbopack_context__.s([
    "publicEnv",
    ()=>publicEnv,
    "sanityDataset",
    ()=>sanityDataset,
    "sanityProjectId",
    ()=>sanityProjectId,
    "supabaseAnonKey",
    ()=>supabaseAnonKey,
    "supabaseUrl",
    ()=>supabaseUrl
]);
function publicEnv(name) {
    const nextKey = `NEXT_PUBLIC_${name}`;
    const viteKey = `VITE_${name}`;
    return process.env[nextKey] ?? process.env[viteKey] ?? "";
}
const sanityProjectId = ()=>publicEnv("SANITY_PROJECT_ID") || process.env.SANITY_STUDIO_PROJECT_ID || "";
const sanityDataset = ()=>publicEnv("SANITY_DATASET") || process.env.SANITY_STUDIO_DATASET || "production";
const supabaseUrl = ()=>publicEnv("SUPABASE_URL") || process.env.SUPABASE_URL || "";
const supabaseAnonKey = ()=>publicEnv("SUPABASE_ANON_KEY") || "";
}),
"[project]/src/lib/sanity-server.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSanityServerClient",
    ()=>getSanityServerClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$sanity$2f$client$2f$dist$2f$index$2e$browser$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@sanity/client/dist/index.browser.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/env.js [app-rsc] (ecmascript)");
;
;
function getSanityServerClient() {
    const projectId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sanityProjectId"])();
    if (!projectId) {
        throw new Error("Sanity project ID is not configured on the server.");
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$sanity$2f$client$2f$dist$2f$index$2e$browser$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])({
        projectId,
        dataset: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sanityDataset"])(),
        apiVersion: "2025-01-01",
        useCdn: false,
        perspective: "published"
    });
}
}),
"[project]/src/sanity/normalizeSlug.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Normalize post slugs from Sanity (handles accidental leading/trailing slashes).
 */ __turbopack_context__.s([
    "SLUG_MATCH_FILTER",
    ()=>SLUG_MATCH_FILTER,
    "blogPostHref",
    ()=>blogPostHref,
    "normalizePost",
    ()=>normalizePost,
    "normalizePostSlug",
    ()=>normalizePostSlug,
    "normalizePosts",
    ()=>normalizePosts
]);
function normalizePostSlug(slug) {
    if (slug == null || slug === "") return "";
    if (typeof slug === "object" && slug.current != null) {
        slug = slug.current;
    }
    const s = String(slug).replace(/^\/+|\/+$/g, "").trim();
    if (s === "null" || s === "undefined") return "";
    return s;
}
function blogPostHref(slug) {
    const normalized = normalizePostSlug(slug);
    return normalized ? `/blog/${normalized}` : null;
}
const SLUG_MATCH_FILTER = `(slug.current == $slug || slug.current == "/" + $slug)`;
function normalizePost(post) {
    if (!post) return post;
    return {
        ...post,
        slug: normalizePostSlug(post.slug)
    };
}
function normalizePosts(posts) {
    if (!Array.isArray(posts)) return posts;
    return posts.map(normalizePost);
}
}),
"[project]/src/sanity/queries.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "allPostSlugsQuery",
    ()=>allPostSlugsQuery,
    "allPostsQuery",
    ()=>allPostsQuery,
    "postBySlugQuery",
    ()=>postBySlugQuery,
    "recentPostsQuery",
    ()=>recentPostsQuery
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$sanity$2f$normalizeSlug$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/sanity/normalizeSlug.js [app-rsc] (ecmascript)");
;
const POST_CARD_PROJECTION = `
  _id,
  title,
  "slug": slug.current,
  mainImage{
    ...,
    asset->{
      _id,
      url,
      metadata{ lqip, dimensions }
    },
    alt
  },
  excerpt,
  publishedAt
`;
const POST_FULL_PROJECTION = `
  _id,
  title,
  "slug": slug.current,
  mainImage{
    ...,
    asset->{
      _id,
      url,
      metadata{ lqip, dimensions }
    },
    alt,
    caption
  },
  excerpt,
  body[]{
    ...,
    _type == "image" => {
      ...,
      asset->{
        _id,
        url,
        metadata{ lqip, dimensions }
      }
    },
    markDefs[]{ ... }
  },
  publishedAt,
  seoTitle,
  metaDescription
`;
const recentPostsQuery = `*[_type == "post" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()]
  | order(publishedAt desc)[0...5]{${POST_CARD_PROJECTION}}`;
const allPostsQuery = `*[_type == "post" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()]
  | order(publishedAt desc){${POST_CARD_PROJECTION}}`;
const postBySlugQuery = `*[_type == "post" && ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$sanity$2f$normalizeSlug$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SLUG_MATCH_FILTER"]} && defined(publishedAt) && publishedAt <= now()][0]{${POST_FULL_PROJECTION}}`;
const allPostSlugsQuery = `*[_type == "post" && defined(slug.current)]{"slug": slug.current}.slug`;
}),
"[project]/src/data/tools.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "activeTools",
    ()=>activeTools,
    "comingSoonTools",
    ()=>comingSoonTools,
    "tools",
    ()=>tools
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2f$ToolIcons$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/icons/ToolIcons.jsx [app-rsc] (ecmascript)");
;
const tools = [
    {
        id: "gpa-to-percentage",
        name: "GPA to Percentage Converter",
        description: "Convert GPA to percentage on 4.0, 5.0, or 10.0 scales with letter grades, descriptors, and a visual score indicator.",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2f$ToolIcons$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["IconGpaPercent"],
        status: "active",
        path: "/tools/gpa-to-percentage",
        color: "bg-accent/10 text-accent-dark"
    },
    {
        id: "gpa-calculator",
        name: "GPA / CGPA Calculator",
        description: "Weighted & unweighted GPA and CGPA with country presets and a fully customizable scale — works with any college or university grading system worldwide.",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2f$ToolIcons$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["IconGpa"],
        status: "active",
        path: "/tools/gpa-calculator",
        color: "bg-primary/10 text-primary"
    },
    {
        id: "gpa-requirement-checker",
        name: "College / University GPA Requirement Checker",
        description: "Search universities by GPA requirements across the US, Canada, UK, Australia, and Germany. Enter your GPA to see match results instantly.",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2f$ToolIcons$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["IconGpaChecker"],
        status: "active",
        path: "/tools/college-university-gpa-requirement-checker",
        color: "bg-primary/10 text-primary-dark"
    },
    {
        id: "attendance-sheet",
        name: "Attendance Sheet Generator",
        description: "Create printable class attendance sheets in seconds.",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2f$ToolIcons$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["IconAttendance"],
        status: "active",
        path: "/tools/attendance-sheet",
        color: "bg-accent/10 text-accent"
    },
    {
        id: "lesson-planner",
        name: "Lesson Planner",
        description: "Build lesson plans, schedule units on a calendar, map curriculum standards, and create substitute teacher plans — all saved locally in your browser.",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2f$ToolIcons$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["IconReport"],
        status: "active",
        path: "/tools/lesson-planner",
        color: "bg-accent/10 text-accent-dark"
    },
    {
        id: "exam-marks-needed",
        name: "Final Grade Calculator",
        description: "See how many marks you need on your final exam to hit your target percentage — updates instantly as you type.",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2f$ToolIcons$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["IconExamMarks"],
        status: "active",
        path: "/tools/final-grade-calculator",
        color: "bg-primary/10 text-primary-dark"
    },
    {
        id: "fee-receipt",
        name: "Fee Receipt Generator",
        description: "Generate printable school fee receipts with subject-wise fees, discounts, tax, and payment status — download as PDF in one click.",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2f$ToolIcons$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["IconReceipt"],
        status: "active",
        path: "/tools/fee-receipt",
        color: "bg-accent/10 text-accent-dark"
    },
    {
        id: "tracing-sheet",
        name: "Tracing Sheet Generator",
        description: "Create printable alphabet and number tracing sheets with dotted guide lines — perfect for kindergarten handwriting practice.",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2f$ToolIcons$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["IconTracing"],
        status: "active",
        path: "/tools/tracing-sheet-generator",
        color: "bg-amber-100/80 text-amber-800"
    },
    {
        id: "behavior-chart",
        name: "Behavior Star Chart Generator",
        description: "Build weekly or monthly reward star charts for up to 30 students — print clean A4 sheets for stickers and stamps.",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2f$ToolIcons$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["IconStarChart"],
        status: "active",
        path: "/tools/behavior-chart-generator",
        color: "bg-violet-100/80 text-violet-800"
    }
];
const activeTools = tools.filter((t)=>t.status === "active");
const comingSoonTools = tools.filter((t)=>t.status === "coming-soon");
}),
"[project]/src/components/Hero.jsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Hero
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Button.jsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2f$ToolIcons$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/icons/ToolIcons.jsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$tools$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/tools.js [app-rsc] (ecmascript)");
;
;
;
;
function Hero() {
    const liveCount = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$tools$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["activeTools"].length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        id: "home",
        className: "relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white pt-12 pb-16 sm:pt-16 sm:pb-20",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl",
                "aria-hidden": true
            }, void 0, false, {
                fileName: "[project]/src/components/Hero.jsx",
                lineNumber: 12,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl",
                "aria-hidden": true
            }, void 0, false, {
                fileName: "[project]/src/components/Hero.jsx",
                lineNumber: 16,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "h-2 w-2 rounded-full bg-accent"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Hero.jsx",
                                lineNumber: 23,
                                columnNumber: 11
                            }, this),
                            liveCount,
                            " ",
                            liveCount === 1 ? "tool" : "tools",
                            " live · Free, no signup"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Hero.jsx",
                        lineNumber: 22,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight text-text sm:text-5xl lg:text-[3.25rem]",
                        children: [
                            "Smart Tools for",
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-primary",
                                children: "Students & Teachers"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Hero.jsx",
                                lineNumber: 29,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Hero.jsx",
                        lineNumber: 27,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-text-muted",
                        children: "Free GPA calculator, college GPA requirement checker, attendance sheets, and educational utilities for modern learners and educators."
                    }, void 0, false, {
                        fileName: "[project]/src/components/Hero.jsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                href: "/tools/college-university-gpa-requirement-checker",
                                size: "lg",
                                children: [
                                    "College / University GPA Requirement Checker",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2f$ToolIcons$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["IconArrowRight"], {}, void 0, false, {
                                        fileName: "[project]/src/components/Hero.jsx",
                                        lineNumber: 40,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Hero.jsx",
                                lineNumber: 38,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                href: "/tools",
                                variant: "secondary",
                                size: "lg",
                                children: "View All Tools"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Hero.jsx",
                                lineNumber: 42,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Hero.jsx",
                        lineNumber: 37,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-6 text-sm text-text-muted",
                        children: "No login required · 100% free · Available worldwide"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Hero.jsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Hero.jsx",
                lineNumber: 21,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Hero.jsx",
        lineNumber: 8,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/page.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HomePage,
    "metadata",
    ()=>metadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$metadata$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/metadata.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sanity$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/sanity-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$sanity$2f$queries$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/sanity/queries.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Hero$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Hero.jsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$site$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/site.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
const ToolsSection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/src/components/ToolsSection.jsx [app-rsc] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/src/components/ToolsSection.jsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    }
});
const HowItWorks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/src/components/HowItWorks.jsx [app-rsc] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/src/components/HowItWorks.jsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    }
});
const WhyUse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/src/components/WhyUse.jsx [app-rsc] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/src/components/WhyUse.jsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    }
});
const LatestInsights = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/src/components/LatestInsights.jsx [app-rsc] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/src/components/LatestInsights.jsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    }
});
const TITLE = "Free Education Tools for Students & Teachers | EduToolsHub";
const DESCRIPTION = "Free online education tools for students and teachers — GPA calculator, college GPA requirement checker, attendance sheet generator, lesson planner, fee receipt maker, and final grade calculator. No signup required.";
const KEYWORDS = "education tools, free tools for students, free tools for teachers, GPA calculator, GPA to percentage, college GPA requirement checker, minimum GPA for college, attendance sheet generator, student attendance tracker, lesson plan maker, lesson planner online, school fee receipt generator, fee receipt maker, final grade calculator, what grade do I need to pass, EduToolsHub";
const metadata = {
    ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$metadata$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["buildPageMetadata"])({
        title: TITLE,
        description: DESCRIPTION,
        path: "/"
    }),
    keywords: KEYWORDS
};
const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$site$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SITE_NAME"],
    url: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$site$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SITE_URL"],
    description: DESCRIPTION,
    publisher: {
        "@type": "Organization",
        name: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$site$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SITE_NAME"],
        url: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$site$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SITE_URL"],
        logo: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$site$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SITE_URL"]}/logo.png`
    }
};
async function HomePage() {
    let recentPosts = [];
    try {
        const client = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sanity$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSanityServerClient"])();
        recentPosts = await client.fetch(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$sanity$2f$queries$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["recentPostsQuery"]);
    } catch  {
        recentPosts = [];
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("script", {
                type: "application/ld+json",
                dangerouslySetInnerHTML: {
                    __html: JSON.stringify(websiteLd)
                }
            }, void 0, false, {
                fileName: "[project]/src/app/page.js",
                lineNumber: 49,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Hero$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/page.js",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(ToolsSection, {}, void 0, false, {
                fileName: "[project]/src/app/page.js",
                lineNumber: 54,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(HowItWorks, {}, void 0, false, {
                fileName: "[project]/src/app/page.js",
                lineNumber: 55,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(WhyUse, {}, void 0, false, {
                fileName: "[project]/src/app/page.js",
                lineNumber: 56,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(LatestInsights, {
                initialPosts: recentPosts
            }, void 0, false, {
                fileName: "[project]/src/app/page.js",
                lineNumber: 57,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
}),
"[project]/src/app/page.js [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/page.js [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0qud1kn._.js.map