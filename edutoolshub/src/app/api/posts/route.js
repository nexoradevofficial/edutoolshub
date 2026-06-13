import { CACHE_MAX_AGE, handlePostsRequest } from "@/lib/posts-handler";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const scope = searchParams.get("scope");
  const slug = searchParams.get("slug");

  try {
    const data = await handlePostsRequest(scope, slug);
    return Response.json(
      { data },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate=600`,
        },
      }
    );
  } catch (err) {
    const message = err?.message || "Failed to fetch blog posts.";
    const status =
      message.includes("Invalid scope") || message.includes("Missing slug") ? 400 : 500;
    return Response.json({ error: message }, { status });
  }
}
