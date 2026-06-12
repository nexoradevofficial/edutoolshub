import { getSupabaseAdmin } from "../supabase-admin.js";

function isAuthorized(req) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.authorization || "";
  const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const headerSecret = req.headers["x-cron-secret"];
  const querySecret = req.query?.secret;

  if (cronSecret) {
    if (bearer === cronSecret || headerSecret === cronSecret || querySecret === cronSecret) {
      return true;
    }
  }

  return process.env.ALLOW_OPEN_ADMIN_REFRESH === "true";
}

export async function handleRefreshUniversities(req, res) {
  if (req.method !== "POST" && req.method !== "GET") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!isAuthorized(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const supabase = getSupabaseAdmin();
  const now = new Date().toISOString();

  try {
    const { data: universities, error: fetchError } = await supabase
      .from("universities")
      .select("id");

    if (fetchError) throw fetchError;

    const count = universities?.length ?? 0;

    const { error: updateError } = await supabase
      .from("universities")
      .update({ last_fetched_at: now, data_year: 2026 })
      .not("id", "is", null);

    if (updateError) throw updateError;

    const { error: logError } = await supabase.from("data_fetch_logs").insert({
      universities_updated: count,
      success: true,
      error_message: null,
    });

    if (logError) throw logError;

    return res.status(200).json({
      success: true,
      universities_updated: count,
      timestamp: now,
    });
  } catch (err) {
    await supabase.from("data_fetch_logs").insert({
      universities_updated: 0,
      success: false,
      error_message: err.message || "Unknown error",
    });

    return res.status(500).json({ error: err.message || "Refresh failed" });
  }
}
