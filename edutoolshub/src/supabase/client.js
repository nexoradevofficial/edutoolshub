import { createClient } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseUrl } from "@/lib/env";

const url = supabaseUrl();
const anonKey = supabaseAnonKey();

if (!url && process.env.NODE_ENV === "development") {
  console.warn(
    "[supabase] NEXT_PUBLIC_SUPABASE_URL is missing. Copy .env.example to .env.local " +
      "and fill in Supabase credentials, then restart `npm run dev`."
  );
}

export const supabase = url && anonKey ? createClient(url, anonKey) : null;
