/**
 * Normalize post slugs from Sanity (handles accidental leading/trailing slashes).
 */
export function normalizePostSlug(slug) {
  if (slug == null || slug === "") return "";
  return String(slug).replace(/^\/+|\/+$/g, "").trim();
}

/** GROQ expression: canonical slug from slug.current (strips accidental leading "/"). */
export const SLUG_NORMALIZE_GROQ = `select(slug.current match "/*" => string::split(slug.current, "/")[1], slug.current)`;

/** GROQ filter: post matches URL slug param (with or without leading "/"). */
export const SLUG_MATCH_FILTER = `(slug.current == $slug || slug.current == "/" + $slug)`;
