const inputClass =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

const selectClass =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

export default function FilterBar({
  search,
  onSearchChange,
  country,
  onCountryChange,
  countries,
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <label htmlFor="uni-search" className="mb-1 block text-sm font-medium text-text">
            Search
          </label>
          <input
            id="uni-search"
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="University name or city…"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="uni-country" className="mb-1 block text-sm font-medium text-text">
            Country
          </label>
          <select
            id="uni-country"
            value={country}
            onChange={(e) => onCountryChange(e.target.value)}
            className={selectClass}
          >
            <option value="all">All Countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

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

        <div className="flex items-end sm:col-span-2 lg:col-span-3">
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-text-muted">
              <span className="font-semibold text-text">{matchCount}</span>{" "}
              {matchCount === 1 ? "university" : "universities"} match your filters
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
