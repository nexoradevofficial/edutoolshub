import { normalizePostSlug } from "@/sanity/normalizeSlug";
import { handlePostsRequest } from "@/lib/posts-handler";
import { SITE_URL, NAV_PAGES, TOOL_PAGES, getSaasSitemapPages } from "@/lib/sitemap-data";
import { getBlogRewriteRedirect } from "@/content/blogRewrites";
import { getSupabaseServer } from "@/lib/supabase-server";

/** Blog entries are cached under the shared `posts` tag, so publishing a post
 *  busts this sitemap instantly. This time-based value is only a fallback. */
export const revalidate = 300;

function formatLastmod(date) {
  if (!date) return new Date().toISOString().slice(0, 10);
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }
  return parsed.toISOString().slice(0, 10);
}

async function getUniversitySitemapEntries(siteUrl) {
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from("universities")
      .select("slug,updated_at")
      .order("slug", { ascending: true });

    if (error || !Array.isArray(data)) return [];

    return data
      .filter((row) => row?.slug)
      .map((row) => ({
        url: `${siteUrl}/tools/college-university-gpa-requirement-checker/${row.slug}`,
        lastModified: formatLastmod(row.updated_at),
        changeFrequency: "monthly",
        priority: 0.6,
      }));
  } catch {
    return [];
  }
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

  const saasEntries = getSaasSitemapPages().map((page) => ({
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
        if (!slug || getBlogRewriteRedirect(slug)) return null;
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

  const universityEntries = await getUniversitySitemapEntries(siteUrl);

  return [
    ...navEntries,
    ...toolEntries,
    ...saasEntries,
    ...blogEntries,
    ...universityEntries,
  ];
}
