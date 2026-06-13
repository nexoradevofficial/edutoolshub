import { useEffect, useMemo, useState } from "react";
import { useTrackGenerateResult } from "../../utils/analytics";
import {
  SUPPORTED_COUNTRIES,
  countByCountry,
  filterUniversities,
  getUniversitiesByCountry,
} from "../../services/universities";
import FilterBar from "./gpa-checker/FilterBar";
import GpaInputBanner from "./gpa-checker/GpaInputBanner";
import UniversityCard from "./gpa-checker/UniversityCard";
import UniversityTable from "./gpa-checker/UniversityTable";

const DEFAULT_COUNTRY = SUPPORTED_COUNTRIES[0];

export default function GpaRequirementChecker({
  initialUniversities = [],
  initialError = null,
}) {
  const [universities] = useState(initialUniversities);
  const [error] = useState(initialError);

  const [studentGpa, setStudentGpa] = useState("");
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [selectedUniversitySlug, setSelectedUniversitySlug] = useState("");
  const [type, setType] = useState("all");
  const [sortBy, setSortBy] = useState("qs_ranking");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    setSelectedUniversitySlug("");
    setType("all");
  }, [country]);

  const countryCounts = useMemo(() => countByCountry(universities), [universities]);

  const universitiesInCountry = useMemo(
    () => getUniversitiesByCountry(universities, country),
    [universities, country]
  );

  const filtered = useMemo(
    () =>
      filterUniversities(universities, {
        country,
        universitySlug: selectedUniversitySlug,
        type,
        sortBy,
      }),
    [universities, country, selectedUniversitySlug, type, sortBy]
  );

  const parsedStudentGpa = parseFloat(studentGpa);
  const hasGpaMatches =
    Number.isFinite(parsedStudentGpa) && parsedStudentGpa > 0;

  useTrackGenerateResult(
    "College / University GPA Requirement Checker",
    hasGpaMatches
  );

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
        {error}
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

      <FilterBar
        country={country}
        onCountryChange={setCountry}
        countries={SUPPORTED_COUNTRIES}
        countryCounts={countryCounts}
        universitiesInCountry={universitiesInCountry}
        selectedUniversitySlug={selectedUniversitySlug}
        onUniversityChange={setSelectedUniversitySlug}
        type={type}
        onTypeChange={setType}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        matchCount={filtered.length}
      />

      <GpaInputBanner value={studentGpa} onChange={setStudentGpa} />

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white p-8 text-center text-sm text-text-muted">
          No universities match your filters in {country}. Try selecting a different country
          or university.
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
