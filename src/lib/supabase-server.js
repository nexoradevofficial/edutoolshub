import { createClient } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseUrl } from "./env.js";

export function getSupabaseServer() {
  const url = supabaseUrl() || process.env.SUPABASE_URL;
  const key = supabaseAnonKey() || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase environment variables are not configured");
  }

  return createClient(url, key);
}

export function getSupabaseAdmin() {
  const url = supabaseUrl() || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey();

  if (!url || !key) {
    throw new Error("Supabase environment variables are not configured");
  }

  return createClient(url, key);
}
