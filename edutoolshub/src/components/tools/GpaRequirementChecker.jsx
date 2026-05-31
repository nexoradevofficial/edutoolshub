import { useEffect, useMemo, useState } from "react";
import {
  fetchAllUniversities,
  filterUniversities,
  getUniqueCountries,
} from "../../services/universities";
import FilterBar from "./gpa-checker/FilterBar";
import GpaInputBanner from "./gpa-checker/GpaInputBanner";
import UniversityCard from "./gpa-checker/UniversityCard";
import UniversityTable from "./gpa-checker/UniversityTable";

export default function GpaRequirementChecker() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [studentGpa, setStudentGpa] = useState("");
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("all");
  const [type, setType] = useState("all");
  const [sortBy, setSortBy] = useState("qs_ranking");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/universities");
        if (res.ok) {
          const json = await res.json();
          if (!cancelled) setUniversities(json.data ?? []);
        } else {
          const { data, error: supaError } = await fetchAllUniversities();
          if (supaError) throw supaError;
          if (!cancelled) setUniversities(data);
        }
      } catch (err) {
        const { data, error: supaError } = await fetchAllUniversities();
        if (!supaError && data.length) {
          if (!cancelled) setUniversities(data);
        } else if (!cancelled) {
          setError(err?.message || supaError?.message || "Failed to load universities");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const countries = useMemo(() => getUniqueCountries(universities), [universities]);

  const filtered = useMemo(
    () => filterUniversities(universities, { search, country, type, sortBy }),
    [universities, search, country, type, sortBy]
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-40 animate-pulse rounded-2xl bg-white/80" />
        <div className="h-24 animate-pulse rounded-2xl bg-white/80" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-white/80" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
        {error}. Check that Supabase is configured in your environment variables.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent-dark">
          Updated 2026
        </span>
      </div>

      <GpaInputBanner value={studentGpa} onChange={setStudentGpa} />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        country={country}
        onCountryChange={setCountry}
        countries={countries}
        type={type}
        onTypeChange={setType}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        matchCount={filtered.length}
      />

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white p-8 text-center text-sm text-text-muted">
          No universities match your filters. Try adjusting your search or filters.
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((u) => (
            <UniversityCard key={u.slug} university={u} studentGpa={studentGpa} />
          ))}
        </div>
      ) : (
        <UniversityTable universities={filtered} studentGpa={studentGpa} />
      )}
    </div>
  );
}
