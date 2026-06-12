import { handleRenderBlogPost } from "../../server/lib/handlers/render-blog-post.js";

/** SSR blog article — served at /api/render/blog-post, rewritten from /blog/:slug in vercel.json */
export default async function handler(req, res) {
  return handleRenderBlogPost(req, res);
}
