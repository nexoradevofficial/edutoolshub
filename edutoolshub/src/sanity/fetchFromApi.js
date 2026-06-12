import {
  allPostsQuery,
  postBySlugQuery,
  recentPostsQuery,
} from "./queries.js";

const QUERY_SCOPES = new Map([
  [allPostsQuery, "all"],
  [recentPostsQuery, "recent"],
  [postBySlugQuery, "post"],
]);

export function getPostsApiScope(query) {
  return QUERY_SCOPES.get(query) ?? null;
}

/** Fetch published blog data via same-origin API (no Sanity CORS). */
export async function fetchPostsFromApi(scope, params) {
  const url = new URL("/api/posts", window.location.origin);
  url.searchParams.set("scope", scope);

  if (scope === "post" && params?.slug) {
    url.searchParams.set("slug", params.slug);
  }

  const response = await fetch(url.toString());
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || `Blog API error (${response.status})`);
  }

  return payload.data ?? null;
}
