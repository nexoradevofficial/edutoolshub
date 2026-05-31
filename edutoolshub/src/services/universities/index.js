import { supabase } from "../../supabase/client";

/** Countries shown in the filter dropdown (order matches primary traffic). */
export const SUPPORTED_COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
];

const UNIVERSITY_COLUMNS =
  "id,name,slug,country,state_province,city,type,qs_ranking,min_gpa,avg_gpa,gpa_scale,acceptance_rate,sat_range,act_range,popular_programs,admission_policy,admission_notes,website_url,source_url,last_fetched_at,data_year,created_at,updated_at";

export async function fetchAllUniversities() {
  if (!supabase) return { data: [], error: new Error("Supabase is not configured") };

  const { data, error } = await supabase
    .from("universities")
    .select(UNIVERSITY_COLUMNS)
    .order("qs_ranking", { ascending: true, nullsFirst: false });

  return { data: data ?? [], error };
}

/** Load universities — Supabase direct (works in Vite dev and production). */
export async function loadUniversitiesForClient() {
  const { data, error } = await fetchAllUniversities();
  if (error) return { data: [], error };

  if ((data ?? []).length === 0) {
    return {
      data: [],
      error: new Error(
        "No universities in the database yet. Run `npm run seed:universities` after applying the Supabase migration."
      ),
    };
  }

  return { data, error: null };
}

export async function fetchUniversityBySlug(slug) {
  if (!supabase) return { data: null, error: new Error("Supabase is not configured") };

  const { data, error } = await supabase
    .from("universities")
    .select(UNIVERSITY_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();

  return { data, error };
}

export async function fetchAllUniversitySlugs() {
  if (!supabase) return { data: [], error: new Error("Supabase is not configured") };

  const { data, error } = await supabase
    .from("universities")
    .select("slug")
    .order("qs_ranking", { ascending: true, nullsFirst: false });

  return { data: (data ?? []).map((row) => row.slug), error };
}

/** Similar universities: same country, comparable min GPA, excluding current. */
export async function fetchSimilarUniversities(university, limit = 4) {
  if (!supabase || !university) {
    return { data: [], error: new Error("Supabase is not configured") };
  }

  const gpaLow = Number(university.min_gpa) - 0.2;
  const gpaHigh = Number(university.min_gpa) + 0.2;

  const { data, error } = await supabase
    .from("universities")
    .select(UNIVERSITY_COLUMNS)
    .eq("country", university.country)
    .neq("slug", university.slug)
    .gte("min_gpa", gpaLow)
    .lte("min_gpa", gpaHigh)
    .order("qs_ranking", { ascending: true, nullsFirst: false })
    .limit(limit);

  if (error) return { data: [], error };

  if ((data ?? []).length >= limit) {
    return { data: data ?? [], error: null };
  }

  const { data: fallback, error: fallbackError } = await supabase
    .from("universities")
    .select(UNIVERSITY_COLUMNS)
    .eq("country", university.country)
    .neq("slug", university.slug)
    .order("qs_ranking", { ascending: true, nullsFirst: false })
    .limit(limit);

  const seen = new Set([university.slug]);
  const merged = [];
  for (const row of [...(data ?? []), ...(fallback ?? [])]) {
    if (seen.has(row.slug)) continue;
    seen.add(row.slug);
    merged.push(row);
    if (merged.length >= limit) break;
  }

  return { data: merged, error: fallbackError };
}

export function filterUniversities(
  universities,
  { search, country, type, sortBy, universitySlug }
) {
  let result = [...universities];

  if (universitySlug) {
    result = result.filter((u) => u.slug === universitySlug);
  }

  if (search?.trim()) {
    const q = search.trim().toLowerCase();
    result = result.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.city?.toLowerCase().includes(q) ||
        u.state_province?.toLowerCase().includes(q)
    );
  }

  if (country) {
    result = result.filter((u) => u.country === country);
  }

  if (type && type !== "all") {
    result = result.filter((u) => u.type === type);
  }

  switch (sortBy) {
    case "min_gpa_desc":
      result.sort((a, b) => Number(b.min_gpa) - Number(a.min_gpa));
      break;
    case "min_gpa_asc":
      result.sort((a, b) => Number(a.min_gpa) - Number(b.min_gpa));
      break;
    case "acceptance_rate":
      result.sort(
        (a, b) => Number(a.acceptance_rate ?? 999) - Number(b.acceptance_rate ?? 999)
      );
      break;
    case "qs_ranking":
    default:
      result.sort((a, b) => {
        const rankA = a.qs_ranking ?? 9999;
        const rankB = b.qs_ranking ?? 9999;
        return rankA - rankB;
      });
      break;
  }

  return result;
}

export function getUniqueCountries(universities) {
  const fromData = [...new Set(universities.map((u) => u.country).filter(Boolean))];
  if (fromData.length === 0) return SUPPORTED_COUNTRIES;
  return SUPPORTED_COUNTRIES.filter(
    (country) => fromData.includes(country)
  ).concat(fromData.filter((c) => !SUPPORTED_COUNTRIES.includes(c)).sort());
}

export function countByCountry(universities) {
  return universities.reduce((acc, u) => {
    if (u.country) acc[u.country] = (acc[u.country] ?? 0) + 1;
    return acc;
  }, {});
}

/** Universities in a country, sorted alphabetically for dropdowns. */
export function getUniversitiesByCountry(universities, country) {
  return universities
    .filter((u) => u.country === country)
    .sort((a, b) => a.name.localeCompare(b.name));
}
