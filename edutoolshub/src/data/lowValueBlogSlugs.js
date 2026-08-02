/**
 * Formerly blocked thin listicles. Content is now rewritten via
 * src/content/blogRewrites and shown again — keep this empty unless a new
 * low-value slug needs temporary suppression.
 */
export const LOW_VALUE_BLOG_SLUGS = new Set();

export function isLowValueBlogSlug(slug) {
  if (!slug) return false;
  return LOW_VALUE_BLOG_SLUGS.has(String(slug).toLowerCase());
}

export function filterQualityPosts(posts) {
  if (!Array.isArray(posts)) return [];
  return posts.filter((post) => {
    const slug = typeof post?.slug === "string" ? post.slug : post?.slug?.current;
    return !isLowValueBlogSlug(slug);
  });
}
