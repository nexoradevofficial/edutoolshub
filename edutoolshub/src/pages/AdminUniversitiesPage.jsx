/**
 * Admin panel for university data management.
 *
 * TODO: Add authentication before going to production.
 * This page is currently open — protect with auth middleware or route guard.
 */
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Button from "../components/ui/Button";
import { fetchAllUniversities } from "../services/universities";

function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function AdminUniversitiesPage() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState(null);

  async function loadUniversities() {
    setLoading(true);
    const { data } = await fetchAllUniversities();
    setUniversities(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadUniversities();
  }, []);

  async function handleRefresh() {
    setRefreshing(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/refresh-universities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Refresh failed");
      setMessage(`Refresh successful at ${formatDate(json.timestamp)}`);
      await loadUniversities();
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>Admin — Universities | EduToolsHub</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-[calc(100vh-4rem)] bg-surface-muted py-6 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text">University Data Admin</h1>
              <p className="mt-1 text-sm text-text-muted">
                Manage GPA requirement data — Updated 2026
              </p>
            </div>
            <Button onClick={handleRefresh} disabled={refreshing}>
              {refreshing ? "Refreshing…" : "Refresh All Data"}
            </Button>
          </header>

          {message && (
            <div className="mb-4 rounded-xl border border-border bg-white p-4 text-sm text-text">
              {message}
            </div>
          )}

          {loading ? (
            <div className="h-48 animate-pulse rounded-2xl bg-white/80" />
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border bg-white shadow-sm">
              <table className="min-w-full divide-y divide-border text-sm">
                <thead className="bg-surface-muted">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-text">Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-text">Min GPA</th>
                    <th className="px-4 py-3 text-left font-semibold text-text">Avg GPA</th>
                    <th className="px-4 py-3 text-left font-semibold text-text">Last Fetched</th>
                    <th className="px-4 py-3 text-left font-semibold text-text">Data Year</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {universities.map((u) => (
                    <tr key={u.slug} className="hover:bg-surface-muted/50">
                      <td className="px-4 py-3 font-medium text-text">{u.name}</td>
                      <td className="px-4 py-3">{Number(u.min_gpa).toFixed(2)}</td>
                      <td className="px-4 py-3">{Number(u.avg_gpa).toFixed(2)}</td>
                      <td className="px-4 py-3 text-text-muted">
                        {formatDate(u.last_fetched_at)}
                      </td>
                      <td className="px-4 py-3">{u.data_year}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
