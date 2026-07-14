import { revalidateTag, revalidatePath } from "next/cache";
import { POSTS_TAG, postTag } from "@/lib/sanity-server";

/** This endpoint mutates the cache, so it must never be statically cached. */
export const dynamic = "force-dynamic";

/**
 * Shared secret used to authenticate revalidation requests.
 * Set SANITY_REVALIDATE_SECRET in your environment; falls back to CRON_SECRET
 * so it keeps working even before the dedicated secret is configured.
 */
function getSecret() {
  return (
    process.env.SANITY_REVALIDATE_SECRET?.trim() ||
    process.env.CRON_SECRET?.trim() ||
    ""
  );
}

function isAuthorized(request) {
  const secret = getSecret();
  if (!secret) {
    // No secret configured: allow only in explicit dev-open mode.
    return process.env.ALLOW_OPEN_ADMIN_REFRESH === "true";
  }

  const authHeader = request.headers.get("authorization") || "";
  const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;
  const headerSecret = request.headers.get("x-webhook-secret")?.trim();
  const { searchParams } = new URL(request.url);
  const querySecret = searchParams.get("secret")?.trim();

  return bearer === secret || headerSecret === secret || querySecret === secret;
}

/** Best-effort read of a post slug from the Sanity webhook payload. */
async function readSlug(request) {
  try {
    const body = await request.json();
    const slug =
      body?.slug?.current ?? body?.slug ?? body?.document?.slug?.current ?? null;
    return typeof slug === "string" && slug.trim() ? slug.trim() : null;
  } catch {
    return null;
  }
}

function revalidateBlogCaches(slug) {
  revalidateTag(POSTS_TAG, "max");
  if (slug) {
    revalidateTag(postTag(slug), "max");
    revalidatePath(`/blog/${slug}`);
  }
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
}

export async function POST(request) {
  if (!isAuthorized(request)) {
    return Response.json({ revalidated: false, error: "Unauthorized" }, { status: 401 });
  }

  const slug = await readSlug(request);

  try {
    revalidateBlogCaches(slug);
    return Response.json({
      revalidated: true,
      slug: slug ?? null,
      now: Date.now(),
    });
  } catch (err) {
    return Response.json(
      { revalidated: false, error: err?.message || "Revalidation failed" },
      { status: 500 }
    );
  }
}

/** GET support for manually forcing a refresh from a browser or curl. */
export async function GET(request) {
  if (!isAuthorized(request)) {
    return Response.json({ revalidated: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug")?.trim() || null;

  try {
    revalidateBlogCaches(slug);
    return Response.json({
      revalidated: true,
      slug: slug ?? null,
      now: Date.now(),
    });
  } catch (err) {
    return Response.json(
      { revalidated: false, error: err?.message || "Revalidation failed" },
      { status: 500 }
    );
  }
}
