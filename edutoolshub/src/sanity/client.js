import { createClient } from "@sanity/client";
import { sanityDataset, sanityProjectId } from "@/lib/env";

const projectId = sanityProjectId();
const dataset = sanityDataset();

if (!projectId && process.env.NODE_ENV === "development") {
  console.warn(
    "[sanity] NEXT_PUBLIC_SANITY_PROJECT_ID is missing. Copy .env.example to .env.local " +
      "and fill it in, then restart `npm run dev`. Blog queries will return empty results until this is set."
  );
}

export const sanityClient = createClient({
  projectId: projectId || "missing-project-id",
  dataset,
  apiVersion: "2025-01-01",
  // CDN is required for browser requests — the non-CDN API blocks cross-origin
  // calls from edutoolshub.com (CORS). Server scripts (prerender, sitemap) use
  // their own client with useCdn: false.
  useCdn: true,
  perspective: "published",
});
