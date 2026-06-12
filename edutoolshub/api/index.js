/**
 * Sole Vercel serverless function — all /api/* and SSR blog routes rewrite here.
 * Server logic lives in server/lib/ (outside /api so Vercel does not bundle each file).
 */
import { handlePostsApi } from "../server/lib/handlers/posts.js";
import { handleRefreshUniversities } from "../server/lib/handlers/refresh-universities.js";
import { handleSitemap } from "../server/lib/handlers/sitemap.js";
import { handleUniversities } from "../server/lib/handlers/universities.js";

const ROUTES = new Map([
  ["posts", handlePostsApi],
  ["sitemap", handleSitemap],
  ["universities", handleUniversities],
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
