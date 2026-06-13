import Link from "next/link";

const selectClass =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

export default function FilterBar({
  country,
  onCountryChange,
  countries,
  countryCounts = {},
  universitiesInCountry = [],
  selectedUniversitySlug,
  onUniversityChange,
  type,
  onTypeChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  matchCount,
}) {
  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-4 rounded-xl border border-primary/15 bg-primary/5 p-4">
        <label htmlFor="uni-country" className="mb-1 block text-sm font-semibold text-text">
          Step 1 — Select your country
        </label>
        <p className="mb-3 text-xs text-text-muted">
          Choose a country to load its universities and GPA requirements.
        </p>
        <select
          id="uni-country"
          value={country}
          onChange={(e) => onCountryChange(e.target.value)}
          className={selectClass}
        >
          {countries.map((c) => {
            const count = countryCounts[c];
            return (
              <option key={c} value={c}>
                {count != null ? `${c} (${count} universities)` : c}
              </option>
            );
          })}
        </select>
      </div>

      <div className="mb-4 rounded-xl border border-accent/20 bg-accent/5 p-4">
        <label htmlFor="uni-name" className="mb-1 block text-sm font-semibold text-text">
          Step 2 — Select a university
        </label>
        <p className="mb-3 text-xs text-text-muted">
          {universitiesInCountry.length > 0
            ? `${universitiesInCountry.length} universities loaded for ${country}. Pick one or browse all below.`
            : `Loading universities for ${country}…`}
        </p>
        <select
          id="uni-name"
          value={selectedUniversitySlug}
          onChange={(e) => onUniversityChange(e.target.value)}
          className={selectClass}
          disabled={universitiesInCountry.length === 0}
        >
          <option value="">All universities in {country}</option>
          {universitiesInCountry.map((u) => (
            <option key={u.slug} value={u.slug}>
              {u.name}
              {u.city ? ` — ${u.city}` : ""}
            </option>
          ))}
        </select>
      </div>

      <p className="mb-4 rounded-lg border border-border bg-surface-muted/80 px-3 py-2.5 text-xs leading-relaxed text-text-muted">
        More countries and universities will be added soon.{" "}
        <Link href="/contact" className="font-semibold text-primary hover:underline">
          Contact us
        </Link>{" "}
        to request your country or a specific university.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label htmlFor="uni-type" className="mb-1 block text-sm font-medium text-text">
            Type
          </label>
          <select
            id="uni-type"
            value={type}
            onChange={(e) => onTypeChange(e.target.value)}
            className={selectClass}
          >
            <option value="all">All</option>
            <option value="Public">Public</option>
            <option value="Private">Private</option>
          </select>
        </div>

        <div>
          <label htmlFor="uni-sort" className="mb-1 block text-sm font-medium text-text">
            Sort by
          </label>
          <select
            id="uni-sort"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className={selectClass}
          >
            <option value="qs_ranking">QS World Ranking</option>
            <option value="min_gpa_desc">Minimum GPA (high to low)</option>
            <option value="min_gpa_asc">Minimum GPA (low to high)</option>
            <option value="acceptance_rate">Acceptance Rate</option>
          </select>
        </div>

        <div className="flex items-end">
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-text-muted">
              <span className="font-semibold text-text">{matchCount}</span>{" "}
              {matchCount === 1 ? "university" : "universities"} shown
            </p>

            <div
              className="inline-flex rounded-xl border border-border bg-surface-muted p-1"
              role="group"
              aria-label="View mode"
            >
              <button
                type="button"
                onClick={() => onViewModeChange("grid")}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  viewMode === "grid"
                    ? "bg-white text-primary shadow-sm"
                    : "text-text-muted hover:text-text"
                }`}
              >
                Grid
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange("table")}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  viewMode === "table"
                    ? "bg-white text-primary shadow-sm"
                    : "text-text-muted hover:text-text"
                }`}
              >
                Table
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
