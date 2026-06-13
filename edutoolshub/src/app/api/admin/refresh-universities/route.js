import { getSupabaseAdmin } from "@/lib/supabase-server";

function isAuthorized(request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization") || "";
  const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const headerSecret = request.headers.get("x-cron-secret");
  const { searchParams } = new URL(request.url);
  const querySecret = searchParams.get("secret");

  if (cronSecret) {
    if (bearer === cronSecret || headerSecret === cronSecret || querySecret === cronSecret) {
      return true;
    }
  }

  return process.env.ALLOW_OPEN_ADMIN_REFRESH === "true";
}

async function refreshUniversities() {
  const supabase = getSupabaseAdmin();
  const now = new Date().toISOString();

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

  return { success: true, universities_updated: count, timestamp: now };
}

export async function GET(request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await refreshUniversities();
    return Response.json(result);
  } catch (err) {
    const supabase = getSupabaseAdmin();
    await supabase.from("data_fetch_logs").insert({
      universities_updated: 0,
      success: false,
      error_message: err.message || "Unknown error",
    });
    return Response.json({ error: err.message || "Refresh failed" }, { status: 500 });
  }
}

export async function POST(request) {
  return GET(request);
}
