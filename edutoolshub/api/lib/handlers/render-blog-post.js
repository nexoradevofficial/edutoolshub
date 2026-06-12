import { buildBlogPostNotFoundPage, buildBlogPostPage } from "../blog-html.js";
import { CACHE_MAX_AGE, handlePostsRequest } from "../posts-handler.js";
import { buildSsrPage } from "../ssr-shell.js";
import { normalizePostSlug } from "../../../src/sanity/normalizeSlug.js";

export async function handleRenderBlogPost(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end("Method not allowed");
  }

  const slug = normalizePostSlug(req.query.slug);

  if (!slug || slug === "null") {
    res.setHeader("Location", "/blog");
    return res.status(302).end();
  }

  try {
    const rawPost = await handlePostsRequest("post", slug);
    const page = buildBlogPostPage(rawPost);

    if (!page) {
      const notFound = buildBlogPostNotFoundPage(slug);
      const html = buildSsrPage(notFound);
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
      return res.status(404).send(html);
    }

    const html = buildSsrPage(page);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader(
      "Cache-Control",
      `public, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate=600`
    );
    return res.status(200).send(html);
  } catch (err) {
    console.error("[ssr/blog-post]", err);
    return res.status(500).end("Failed to render blog post");
  }
}
