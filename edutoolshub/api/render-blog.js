import { buildBlogListPage } from "./lib/blog-html.js";
import { CACHE_MAX_AGE, handlePostsRequest } from "./lib/posts-handler.js";
import { buildSsrPage } from "./lib/ssr-shell.js";

/**
 * Server-side render /blog with post cards in the initial HTML.
 * Rewritten from /blog via vercel.json — new Sanity posts appear on each request.
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end("Method not allowed");
  }

  try {
    const rawPosts = await handlePostsRequest("all");
    const page = buildBlogListPage(rawPosts);
    const html = buildSsrPage(page);

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader(
      "Cache-Control",
      `public, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate=600`
    );
    return res.status(200).send(html);
  } catch (err) {
    console.error("[ssr/blog]", err);
    return res.status(500).end("Failed to render blog page");
  }
}
