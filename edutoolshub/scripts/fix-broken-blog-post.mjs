/**
 * One-off fix for a cron-published post with placeholder title/slug.
 * Run: node scripts/fix-broken-blog-post.mjs
 * Requires SANITY_TOKEN and Sanity project env vars in .env.local
 */
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";
import { loadEnvFiles, sanityDatasetFromEnv, sanityProjectIdFromEnv } from "./load-env.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const env = loadEnvFiles(projectRoot);

const POST_ID = "nwmgP0yEQuFb1sNPrYFmSd";
const TITLE = "How to Help Students Learn Better: Complete Guide for Teachers";
const SLUG = "how-to-help-students-learn-better";

const projectId = env.SANITY_PROJECT_ID || sanityProjectIdFromEnv(env);
const dataset = env.SANITY_DATASET || sanityDatasetFromEnv(env);
const token = env.SANITY_TOKEN;

if (!projectId || !token) {
  console.error("Missing SANITY_PROJECT_ID (or NEXT_PUBLIC_SANITY_PROJECT_ID) and SANITY_TOKEN in .env.local");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2025-01-01",
  useCdn: false,
});

const updated = await client
  .patch(POST_ID)
  .set({
    title: TITLE,
    slug: { _type: "slug", current: SLUG },
    seoTitle: TITLE.slice(0, 60),
  })
  .commit();

console.log("Updated post:", {
  id: updated._id,
  title: updated.title,
  slug: updated.slug?.current,
});
