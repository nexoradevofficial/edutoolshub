/**
 * Generates SQL INSERT batches for MCP seeding.
 * Run: node scripts/generate-seed-sql.mjs
 */
import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { universitiesSeed } from "./universities-seed-data.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

function esc(str) {
  return String(str ?? "").replace(/'/g, "''");
}

function rowSql(u) {
  const programs = `{${u.popular_programs.map((p) => `"${p.replace(/"/g, '\\"')}"`).join(",")}}`;
  return `('${esc(u.slug)}','${esc(u.name)}','${esc(u.country)}',${u.state_province ? `'${esc(u.state_province)}'` : "NULL"},'${esc(u.city)}','${u.type}',${u.qs_ranking ?? "NULL"},${u.min_gpa},${u.avg_gpa},4.0,${u.acceptance_rate ?? "NULL"},${u.sat_range ? `'${esc(u.sat_range)}'` : "NULL"},${u.act_range ? `'${esc(u.act_range)}'` : "NULL"},'${programs}'::text[],'${esc(u.admission_policy)}','${esc(u.admission_notes)}','${esc(u.website_url)}','${esc(u.source_url)}',NOW(),2026)`;
}

const batchSize = 10;
const batches = [];
for (let i = 0; i < universitiesSeed.length; i += batchSize) {
  const slice = universitiesSeed.slice(i, i + batchSize);
  const sql = `INSERT INTO universities (slug,name,country,state_province,city,type,qs_ranking,min_gpa,avg_gpa,gpa_scale,acceptance_rate,sat_range,act_range,popular_programs,admission_policy,admission_notes,website_url,source_url,last_fetched_at,data_year) VALUES ${slice.map(rowSql).join(",")} ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name,min_gpa=EXCLUDED.min_gpa,avg_gpa=EXCLUDED.avg_gpa,acceptance_rate=EXCLUDED.acceptance_rate,updated_at=NOW();`;
  batches.push(sql);
}

writeFileSync(resolve(__dirname, "seed-batches.json"), JSON.stringify(batches), "utf-8");
console.log(`Generated ${batches.length} batches for ${universitiesSeed.length} universities.`);
