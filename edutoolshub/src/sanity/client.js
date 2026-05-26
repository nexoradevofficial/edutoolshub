import { createClient } from "@sanity/client";

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET || "production";

if (!projectId && import.meta.env.DEV) {
  console.warn(
    "[sanity] VITE_SANITY_PROJECT_ID is missing. Copy .env.example to .env.local " +
      "and fill it in, then restart `npm run dev`. Blog queries will return empty results until this is set."
  );
}

export const sanityClient = createClient({
  projectId: projectId || "missing-project-id",
  dataset,
  apiVersion: "2025-01-01",
  useCdn: true,
  perspective: "published",
});
