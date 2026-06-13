import { normalizePostSlug } from "@/sanity/normalizeSlug";
import { handlePostsRequest } from "@/lib/posts-handler";
import { SITE_URL, NAV_PAGES, TOOL_PAGES } from "@/lib/sitemap-data";

function formatLastmod(date) {
  if (!date) return new Date().toISOString().slice(0, 10);
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }
  return parsed.toISOString().slice(0, 10);
}

export default async function sitemap() {
  const today = formatLastmod(new Date());
  const siteUrl = process.env.SITE_URL || SITE_URL;

  const navEntries = NAV_PAGES.map((page) => ({
    url: page.path === "/" ? siteUrl : `${siteUrl}${page.path}`,
    lastModified: today,
    changeFrequency: page.changefreq,
    priority: Number(page.priority),
  }));

  const toolEntries = TOOL_PAGES.map((page) => ({
    url: `${siteUrl}${page.path}`,
    lastModified: today,
    changeFrequency: page.changefreq,
    priority: Number(page.priority),
  }));

  let blogEntries = [];
  try {
    const posts = await handlePostsRequest("all");
    blogEntries = (Array.isArray(posts) ? posts : [])
      .map((post) => {
        const slug = normalizePostSlug(post.slug);
        if (!slug) return null;
        return {
          url: `${siteUrl}/blog/${slug}`,
          lastModified: formatLastmod(post.publishedAt),
          changeFrequency: "weekly",
          priority: 0.7,
        };
      })
      .filter(Boolean);
  } catch {
    blogEntries = [];
  }

  return [...navEntries, ...toolEntries, ...blogEntries];
}
