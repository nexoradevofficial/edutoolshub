import {
  allPostsQuery,
  postBySlugQuery,
  recentPostsQuery,
} from "../../src/sanity/queries.js";
import { getSanityServerClient } from "./sanity-server.js";

const CACHE_MAX_AGE = 120;

/**
 * Fetch blog posts server-side (avoids browser CORS to Sanity).
 * @param {"all"|"recent"|"post"} scope
 * @param {string} [slug]
 */
export async function handlePostsRequest(scope, slug) {
  const client = getSanityServerClient();

  if (scope === "all") {
    return client.fetch(allPostsQuery);
  }

  if (scope === "recent") {
    return client.fetch(recentPostsQuery);
  }

  if (scope === "post") {
    if (!slug) {
      throw new Error("Missing slug parameter.");
    }
    return client.fetch(postBySlugQuery, { slug });
  }

  throw new Error(`Invalid scope "${scope}". Use all, recent, or post.`);
}

export { CACHE_MAX_AGE };
