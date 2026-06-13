import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

/** Load .env.local and .env into a flat object (scripts only — no Vite dependency). */
export function loadEnvFiles(projectRoot) {
  const env = { ...process.env };

  for (const name of [".env", ".env.local"]) {
    const filePath = resolve(projectRoot, name);
    if (!existsSync(filePath)) continue;

    for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      env[key] = value;
    }
  }

  return env;
}

export function supabaseUrlFromEnv(env) {
  return (
    env.NEXT_PUBLIC_SUPABASE_URL ||
    env.VITE_SUPABASE_URL ||
    env.SUPABASE_URL ||
    ""
  );
}

export function sanityProjectIdFromEnv(env) {
  return (
    env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
    env.VITE_SANITY_PROJECT_ID ||
    env.SANITY_STUDIO_PROJECT_ID ||
    ""
  );
}

export function sanityDatasetFromEnv(env) {
  return (
    env.NEXT_PUBLIC_SANITY_DATASET ||
    env.VITE_SANITY_DATASET ||
    env.SANITY_STUDIO_DATASET ||
    "production"
  );
}
