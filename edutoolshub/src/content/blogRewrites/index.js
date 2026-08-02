import { blogRewritePosts, blogRewriteRedirects } from "./posts.js";
import { blocksFromOutline } from "./portableText.js";

export { blogRewritePosts, blogRewriteRedirects };

const bodyCache = new Map();

export function getBlogRewrite(slug) {
  if (!slug) return null;
  return blogRewritePosts[slug] || null;
}

export function getBlogRewriteRedirect(slug) {
  if (!slug) return null;
  return blogRewriteRedirects[slug] || null;
}

export function getRewriteBody(slug) {
  const rewrite = getBlogRewrite(slug);
  if (!rewrite) return null;
  if (!bodyCache.has(slug)) {
    bodyCache.set(slug, blocksFromOutline(rewrite.outline));
  }
  return bodyCache.get(slug);
}

/**
 * Overlay Sanity post fields with policy-compliant rewrite content when available.
 * Preserves Sanity image, dates, and _id.
 */
export function applyBlogRewrite(post) {
  if (!post) return post;
  const slug =
    typeof post.slug === "string" ? post.slug : post.slug?.current || "";
  const rewrite = getBlogRewrite(slug);
  if (!rewrite) return post;

  return {
    ...post,
    title: rewrite.title,
    excerpt: rewrite.excerpt,
    seoTitle: rewrite.seoTitle,
    metaDescription: rewrite.metaDescription,
    body: getRewriteBody(slug),
  };
}

export function applyBlogRewriteList(posts) {
  if (!Array.isArray(posts)) return [];
  return posts
    .map((post) => {
      const slug =
        typeof post.slug === "string" ? post.slug : post.slug?.current || "";
      // Hide duplicate redirect sources from listings
      if (getBlogRewriteRedirect(slug)) return null;
      return applyBlogRewrite(post);
    })
    .filter(Boolean);
}
