import { getSupabaseAdmin } from "../supabase-admin.js";

const CACHE_MAX_AGE = 3600;

export async function handleUniversities(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("universities")
      .select("*")
      .order("qs_ranking", { ascending: true, nullsFirst: false });

    if (error) throw error;

    res.setHeader("Cache-Control", `public, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate`);
    return res.status(200).json({ data: data ?? [] });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Failed to fetch universities" });
  }
}
