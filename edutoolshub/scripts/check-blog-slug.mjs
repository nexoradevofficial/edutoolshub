import { createClient } from "@sanity/client";
import { loadEnv } from "vite";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const env = loadEnv("production", root, "");
const slug = process.argv[2] || "free-attendance-sheet-generator";

if (!env.VITE_SANITY_PROJECT_ID) {
  console.error("VITE_SANITY_PROJECT_ID missing in .env.local");
  process.exit(1);
}

const client = createClient({
  projectId: env.VITE_SANITY_PROJECT_ID,
  dataset: env.VITE_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  useCdn: false,
  perspective: "published",
});

const loose = await client.fetch(
  `*[_type == "post" && slug.current == $slug][0]{title,"slug":slug.current,publishedAt,_id}`,
  { slug }
);
const SLUG_FILTER = `(slug.current == $slug || slug.current == "/" + $slug)`;
const SLUG_NORM = `select(slug.current match "/*" => string::split(slug.current, "/")[1], slug.current)`;
const strict = await client.fetch(
  `*[_type == "post" && ${SLUG_FILTER} && defined(publishedAt) && publishedAt <= now()][0]{title,"slug": ${SLUG_NORM},publishedAt,_id}`,
  { slug }
);
const drafts = await createClient({
  projectId: env.VITE_SANITY_PROJECT_ID,
  dataset: env.VITE_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  useCdn: false,
  perspective: "raw",
}).fetch(
  `*[_type == "post" && slug.current == $slug][0]{title,"slug":slug.current,publishedAt,_id}`,
  { slug }
);

console.log("slug:", slug);
console.log("published perspective (loose):", loose);
console.log("published perspective (strict):", strict);
console.log("raw perspective:", drafts);

const all = await createClient({
  projectId: env.VITE_SANITY_PROJECT_ID,
  dataset: env.VITE_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  useCdn: false,
  perspective: "raw",
}).fetch(`*[_type == "post"]{title,"slug":slug.current,publishedAt,_id}`);
console.log("all posts:", all);
