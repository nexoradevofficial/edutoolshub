import { handlePostsRequest } from "./posts-handler.js";
import { STATIC_PAGES, TOOL_PAGES } from "./sitemap-data.js";

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatLastmod(date) {
  if (!date) return new Date().toISOString().slice(0, 10);
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }
  return parsed.toISOString().slice(0, 10);
}

function normalizeSlug(slug) {
  if (slug == null || slug === "") return "";
  return String(slug).replace(/^\/+|\/+$/g, "").trim();
}

function buildUrlEntry({ path, lastmod, changefreq, priority }, siteUrl) {
  const loc = path === "/" ? siteUrl : `${siteUrl}${path}`;
  return [
    "  <url>",
    `    <loc>${escapeXml(loc)}</loc>`,
    `    <lastmod>${escapeXml(lastmod)}</lastmod>`,
    `    <changefreq>${escapeXml(changefreq)}</changefreq>`,
    `    <priority>${escapeXml(priority)}</priority>`,
    "  </url>",
  ].join("\n");
}

export async function buildSitemapXml(siteUrl) {
  const today = formatLastmod(new Date());

  const staticEntries = STATIC_PAGES.map((page) => ({
    ...page,
    lastmod: today,
  }));

  const toolEntries = TOOL_PAGES.map((page) => ({
    ...page,
    lastmod: today,
  }));

  const posts = await handlePostsRequest("all");
  const blogEntries = (Array.isArray(posts) ? posts : [])
    .map((post) => {
      const slug = normalizeSlug(post.slug);
      if (!slug) return null;
      return {
        path: `/blog/${slug}`,
        lastmod: formatLastmod(post.publishedAt),
        changefreq: "weekly",
        priority: "0.7",
      };
    })
    .filter(Boolean);

  const entries = [...staticEntries, ...toolEntries, ...blogEntries];
  const items = entries.map((entry) => buildUrlEntry(entry, siteUrl)).join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    items,
    "</urlset>",
    "",
  ].join("\n");
}
