import { createClient } from "@sanity/client";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  loadEnvFiles,
  sanityDatasetFromEnv,
  sanityProjectIdFromEnv,
} from "./load-env.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const env = loadEnvFiles(root);
const slug = process.argv[2] || "free-attendance-sheet-generator";

const projectId = sanityProjectIdFromEnv(env);
if (!projectId) {
  console.error("NEXT_PUBLIC_SANITY_PROJECT_ID missing in .env.local");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset: sanityDatasetFromEnv(env),
  apiVersion: "2025-01-01",
  useCdn: false,
  perspective: "published",
});

const loose = await client.fetch(
  `*[_type == "post" && slug.current == $slug][0]{title,"slug":slug.current,publishedAt,_id}`,
  { slug }
);

console.log("Loose match:", loose);

const strict = await client.fetch(
  `*[_type == "post" && slug.current == $slug && defined(publishedAt) && publishedAt <= now()][0]{title,"slug":slug.current,publishedAt,_id}`,
  { slug }
);

console.log("Strict match:", strict);

const allSlugs = await client.fetch(
  `*[_type == "post" && defined(slug.current)]{"slug": slug.current}.slug`
);

console.log("All slugs:", allSlugs);
