/**
 * Dynamic sitemap — core site pages plus published blog posts (no university detail URLs).
 * Vercel rewrites /sitemap.xml → this handler (see vercel.json).
 */

import { createClient } from "@sanity/client";

const SITE_URL = process.env.SITE_URL || "https://edutoolshub.com";

const STATIC_ROUTES = [
  "/",
  "/tools",
  "/blog",
  "/tools/gpa-calculator",
  "/tools/college-university-gpa-requirement-checker",
  "/tools/attendance-sheet",
  "/tools/final-grade-calculator",
  "/tools/gpa-to-percentage",
  "/about",
  "/contact",
  "/privacy",
];

function normalizeSlug(slug) {
  if (slug == null || slug === "") return "";
  return String(slug).replace(/^\/+|\/+$/g, "").trim();
}

async function fetchBlogSlugs() {
  const projectId = process.env.VITE_SANITY_PROJECT_ID;
  const dataset = process.env.VITE_SANITY_DATASET || "production";
  if (!projectId) return [];

  const client = createClient({
    projectId,
    dataset,
    apiVersion: "2025-01-01",
    useCdn: false,
  });

  const rows = await client.fetch(
    `*[_type == "post" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()]{
      "slug": slug.current
    }`
  );
  return Array.isArray(rows)
    ? rows.map((r) => normalizeSlug(r.slug)).filter(Boolean)
    : [];
}

function buildSitemapXml(routes) {
  const now = new Date().toISOString().slice(0, 10);
  const items = routes
    .map(
      (route) =>
        `  <url>\n    <loc>${SITE_URL}${route === "/" ? "" : route}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>${route.startsWith("/blog/") ? "weekly" : route === "/blog" ? "weekly" : "monthly"}</changefreq>\n  </url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>\n`;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end("Method not allowed");
  }

  try {
    const blogSlugs = await fetchBlogSlugs();
    const routes = [
      ...STATIC_ROUTES,
      ...blogSlugs.map((s) => `/blog/${s}`),
    ];
    const uniqueRoutes = Array.from(new Set(routes));

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400"
    );
    return res.status(200).send(buildSitemapXml(uniqueRoutes));
  } catch (err) {
    console.error("[sitemap]", err);
    return res.status(500).end("Failed to generate sitemap");
  }
}
