import { createClient } from "@sanity/client";
import { sanityDataset, sanityProjectId } from "./env.js";

/** Cache tag applied to every post-related query. Bust it with
 *  revalidateTag(POSTS_TAG, "max") to instantly refresh the home page,
 *  blog listing, individual posts, and the sitemap after publishing. */
export const POSTS_TAG = "posts";

/** Per-post cache tag so a single article can be revalidated in isolation. */
export const postTag = (slug) => `post:${slug}`;

/** Default time-based fallback (seconds). On-demand tag revalidation keeps
 *  content fresh instantly; this only matters if a webhook is ever missed. */
const DEFAULT_REVALIDATE = 300;

/** Server-side Sanity client (no CORS — used by RSC, API routes, sitemap). */
export function getSanityServerClient() {
  const projectId = sanityProjectId();

  if (!projectId) {
    throw new Error("Sanity project ID is not configured on the server.");
  }

  return createClient({
    projectId,
    dataset: sanityDataset(),
    apiVersion: "2025-01-01",
    useCdn: false,
    perspective: "published",
  });
}

/**
 * Fetch from Sanity with explicit Next.js caching.
 *
 * Next.js 16 does not cache fetches by default, so we opt in here with a
 * cache tag (for instant on-demand revalidation when a post is published)
 * plus a time-based fallback (self-heals if a webhook is missed).
 */
export function sanityServerFetch(query, params = {}, options = {}) {
  const { tags = [POSTS_TAG], revalidate = DEFAULT_REVALIDATE } = options;
  const client = getSanityServerClient();

  return client.fetch(query, params, {
    next: { tags, revalidate },
  });
}
