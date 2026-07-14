import {
  allPostsQuery,
  postBySlugQuery,
  recentPostsQuery,
} from "@/sanity/queries";
import { POSTS_TAG, postTag, sanityServerFetch } from "@/lib/sanity-server";

export const CACHE_MAX_AGE = 120;

export async function handlePostsRequest(scope, slug) {
  if (scope === "all") {
    return sanityServerFetch(allPostsQuery, {}, { tags: [POSTS_TAG] });
  }

  if (scope === "recent") {
    return sanityServerFetch(recentPostsQuery, {}, { tags: [POSTS_TAG] });
  }

  if (scope === "post") {
    if (!slug) {
      throw new Error("Missing slug parameter.");
    }
    return sanityServerFetch(
      postBySlugQuery,
      { slug },
      { tags: [POSTS_TAG, postTag(slug)] }
    );
  }

  throw new Error(`Invalid scope "${scope}". Use all, recent, or post.`);
}
