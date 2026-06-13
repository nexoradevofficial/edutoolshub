/**
 * Normalize post slugs from Sanity (handles accidental leading/trailing slashes).
 */
export function normalizePostSlug(slug) {
  if (slug == null || slug === "") return "";
  if (typeof slug === "object" && slug.current != null) {
    slug = slug.current;
  }
  const s = String(slug).replace(/^\/+|\/+$/g, "").trim();
  if (s === "null" || s === "undefined") return "";
  return s;
}

/** Safe internal path for a blog post, or null if slug is missing. */
export function blogPostHref(slug) {
  const normalized = normalizePostSlug(slug);
  return normalized ? `/blog/${normalized}` : null;
}

/** GROQ filter: post matches URL slug param (with or without leading "/"). */
export const SLUG_MATCH_FILTER = `(slug.current == $slug || slug.current == "/" + $slug)`;

/** Apply slug normalization to a Sanity post object. */
export function normalizePost(post) {
  if (!post) return post;
  return { ...post, slug: normalizePostSlug(post.slug) };
}

/** Apply slug normalization to an array of posts. */
export function normalizePosts(posts) {
  if (!Array.isArray(posts)) return posts;
  return posts.map(normalizePost);
}
