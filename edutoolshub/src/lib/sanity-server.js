import { createClient } from "@sanity/client";
import { sanityDataset, sanityProjectId } from "./env.js";

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
