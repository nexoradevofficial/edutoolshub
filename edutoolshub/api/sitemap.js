/**
 * Dynamic sitemap — always includes the latest published blog slugs from Sanity.
 * Vercel rewrites /sitemap.xml → this handler (see vercel.json).
 */

import { createClient } from "@sanity/client";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

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

  const slugs = await client.fetch(
    `*[_type == "post" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()]{
      "slug": select(slug.current match "/*" => string::split(slug.current, "/")[1], slug.current)
    }.slug`
  );
  return Array.isArray(slugs) ? slugs.filter(Boolean) : [];
}

async function fetchUniversitySlugs() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return [];

  const client = createSupabaseClient(url, key);
  const { data, error } = await client
    .from("universities")
    .select("slug")
    .order("qs_ranking", { ascending: true, nullsFirst: false });

  if (error) throw error;
  return Array.isArray(data) ? data.map((r) => r.slug).filter(Boolean) : [];
}

function buildSitemapXml(routes) {
  const now = new Date().toISOString().slice(0, 10);
  const items = routes
    .map(
      (route) =>
        `  <url>\n    <loc>${SITE_URL}${route === "/" ? "" : route}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>${route.startsWith("/blog") ? "weekly" : "monthly"}</changefreq>\n  </url>`
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
    const [blogSlugs, uniSlugs] = await Promise.all([
      fetchBlogSlugs(),
      fetchUniversitySlugs(),
    ]);

    const routes = [
      ...STATIC_ROUTES,
      ...blogSlugs.map((s) => `/blog/${s}`),
      ...uniSlugs.map((s) => `/tools/college-university-gpa-requirement-checker/${s}`),
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
