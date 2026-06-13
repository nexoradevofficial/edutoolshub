import { getSupabaseServer } from "./supabase-server";

const UNIVERSITY_COLUMNS =
  "id,name,slug,country,state_province,city,type,qs_ranking,min_gpa,avg_gpa,gpa_scale,acceptance_rate,sat_range,act_range,popular_programs,admission_policy,admission_notes,website_url,source_url,last_fetched_at,data_year,created_at,updated_at";

/** Load all universities on the server (no browser Supabase client required). */
export async function loadUniversitiesForPage() {
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from("universities")
      .select(UNIVERSITY_COLUMNS)
      .order("qs_ranking", { ascending: true, nullsFirst: false });

    if (error) {
      return { data: [], error: error.message };
    }

    if ((data ?? []).length === 0) {
      return {
        data: [],
        error:
          "No universities in the database yet. Run `npm run seed:universities` after applying the Supabase migration.",
      };
    }

    return { data: data ?? [], error: null };
  } catch (err) {
    return {
      data: [],
      error: err.message || "Failed to load university data.",
    };
  }
}
