import { createClient } from "@sanity/client";

/** Server-side Sanity client (no CORS — used by API routes and prerender). */
export function getSanityServerClient() {
  const projectId =
    process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID;
  const dataset =
    process.env.VITE_SANITY_DATASET ||
    process.env.SANITY_STUDIO_DATASET ||
    "production";

  if (!projectId) {
    throw new Error("Sanity project ID is not configured on the server.");
  }

  return createClient({
    projectId,
    dataset,
    apiVersion: "2025-01-01",
    useCdn: false,
    perspective: "published",
  });
}
