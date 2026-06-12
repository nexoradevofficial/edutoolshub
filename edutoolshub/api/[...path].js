/**
 * Single Vercel serverless entry for all /api/* routes (Hobby plan limit).
 * Individual handlers live in api/lib/handlers/.
 */
import { handlePostsApi } from "./lib/handlers/posts.js";
import { handleRefreshUniversities } from "./lib/handlers/refresh-universities.js";
import { handleRenderBlog } from "./lib/handlers/render-blog.js";
import { handleRenderBlogPost } from "./lib/handlers/render-blog-post.js";
import { handleSitemap } from "./lib/handlers/sitemap.js";
import { handleUniversities } from "./lib/handlers/universities.js";

const ROUTES = new Map([
  ["posts", handlePostsApi],
  ["sitemap", handleSitemap],
  ["universities", handleUniversities],
  ["render-blog", handleRenderBlog],
  ["render-blog-post", handleRenderBlogPost],
  ["admin/refresh-universities", handleRefreshUniversities],
]);

function routeKeyFromQuery(pathParam) {
  if (!pathParam) return "";
  return Array.isArray(pathParam) ? pathParam.join("/") : String(pathParam);
}

export default async function handler(req, res) {
  const key = routeKeyFromQuery(req.query.path);
  const routeHandler = ROUTES.get(key);

  if (!routeHandler) {
    return res.status(404).json({ error: `Unknown API route: /api/${key}` });
  }

  return routeHandler(req, res);
}
