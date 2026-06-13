/**
 * Seed universities table from scripts/universities-seed-data.js
 * Run: node scripts/seed-universities.mjs
 * Requires SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL in .env.local
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { loadEnvFiles, supabaseUrlFromEnv } from "./load-env.mjs";
import { universitiesSeed } from "./universities-seed-data.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const env = loadEnvFiles(projectRoot);

const url = supabaseUrlFromEnv(env);
const key = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL (or VITE_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(url, key);

function escapeSql(str) {
  return String(str).replace(/'/g, "''");
}

function toRow(u) {
  const programs = `{${u.popular_programs.map((p) => `"${p.replace(/"/g, '\\"')}"`).join(",")}}`;
  return `(
    '${escapeSql(u.slug)}',
    '${escapeSql(u.name)}',
    '${escapeSql(u.country)}',
    ${u.state_province ? `'${escapeSql(u.state_province)}'` : "NULL"},
    '${escapeSql(u.city)}',
    '${u.type}',
    ${u.qs_ranking ?? "NULL"},
    ${u.min_gpa},
    ${u.avg_gpa},
    4.0,
    ${u.acceptance_rate ?? "NULL"},
    ${u.sat_range ? `'${escapeSql(u.sat_range)}'` : "NULL"},
    ${u.act_range ? `'${escapeSql(u.act_range)}'` : "NULL"},
    '${programs}'::text[],
    '${escapeSql(u.admission_policy)}',
    '${escapeSql(u.admission_notes)}',
    '${escapeSql(u.website_url)}',
    '${escapeSql(u.source_url)}',
    NOW(),
    2026
  )`;
}

async function main() {
  console.log(`Seeding ${universitiesSeed.length} universities…`);

  const { error: deleteError } = await supabase.from("universities").delete().neq("slug", "");
  if (deleteError) {
    console.warn("Clear existing data warning:", deleteError.message);
  }

  const batchSize = 20;
  for (let i = 0; i < universitiesSeed.length; i += batchSize) {
    const batch = universitiesSeed.slice(i, i + batchSize).map((u) => ({
      ...u,
      gpa_scale: 4.0,
      data_year: 2026,
      last_fetched_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from("universities").upsert(batch, {
      onConflict: "slug",
    });

    if (error) {
      console.error("Batch failed:", error.message);
      process.exit(1);
    }
    console.log(`  ✓ ${Math.min(i + batchSize, universitiesSeed.length)} / ${universitiesSeed.length}`);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
