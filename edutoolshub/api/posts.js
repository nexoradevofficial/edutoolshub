import { CACHE_MAX_AGE, handlePostsRequest } from "./lib/posts-handler.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const scope = req.query.scope;
  const slug = req.query.slug;

  try {
    const data = await handlePostsRequest(scope, slug);
    res.setHeader(
      "Cache-Control",
      `public, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate=600`
    );
    return res.status(200).json({ data });
  } catch (err) {
    const message = err?.message || "Failed to fetch blog posts.";
    const status = message.includes("Invalid scope") || message.includes("Missing slug")
      ? 400
      : 500;
    return res.status(status).json({ error: message });
  }
}
