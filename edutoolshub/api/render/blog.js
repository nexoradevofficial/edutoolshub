import { handleRenderBlog } from "../../server/lib/handlers/render-blog.js";

/** SSR blog listing — served at /api/render/blog, rewritten from /blog in vercel.json */
export default async function handler(req, res) {
  return handleRenderBlog(req, res);
}
