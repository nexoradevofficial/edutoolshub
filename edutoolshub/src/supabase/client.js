import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl && import.meta.env.DEV) {
  console.warn(
    "[supabase] VITE_SUPABASE_URL is missing. Copy .env.example to .env.local " +
      "and fill in Supabase credentials, then restart `npm run dev`."
  );
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
