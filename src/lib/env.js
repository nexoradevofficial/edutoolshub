/** Public env vars — supports both Next.js and legacy Vite names during migration. */
export function publicEnv(name) {
  const nextKey = `NEXT_PUBLIC_${name}`;
  const viteKey = `VITE_${name}`;
  return process.env[nextKey] ?? process.env[viteKey] ?? "";
}

export const sanityProjectId = () =>
  publicEnv("SANITY_PROJECT_ID") ||
  process.env.SANITY_STUDIO_PROJECT_ID ||
  "";

export const sanityDataset = () =>
  publicEnv("SANITY_DATASET") ||
  process.env.SANITY_STUDIO_DATASET ||
  "production";

export const supabaseUrl = () =>
  publicEnv("SUPABASE_URL") || process.env.SUPABASE_URL || "";

export const supabaseAnonKey = () => publicEnv("SUPABASE_ANON_KEY") || "";
