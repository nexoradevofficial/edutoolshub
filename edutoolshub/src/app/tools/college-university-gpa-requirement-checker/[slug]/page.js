import { notFound } from "next/navigation";
import UniversityDetailContent from "@/components/tools/gpa-checker/UniversityDetailContent";
import { SITE_URL } from "@/constants/site";
import { getSupabaseServer } from "@/lib/supabase-server";
import { fetchSimilarUniversities } from "@/services/universities";

export const revalidate = 86400;

const UNIVERSITY_COLUMNS =
  "id,name,slug,country,state_province,city,type,qs_ranking,min_gpa,avg_gpa,gpa_scale,acceptance_rate,sat_range,act_range,popular_programs,admission_policy,admission_notes,website_url,source_url,last_fetched_at,data_year,created_at,updated_at";

async function loadUniversity(slug) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("universities")
    .select(UNIVERSITY_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  return data;
}

async function loadSimilar(university) {
  const supabase = getSupabaseServer();
  const { data } = await fetchSimilarUniversities(university, 4, supabase);
  return data ?? [];
}

export async function generateStaticParams() {
  try {
    const supabase = getSupabaseServer();
    const { data } = await supabase.from("universities").select("slug");
    return (data ?? []).map((row) => ({ slug: row.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const university = await loadUniversity(slug);
  if (!university) {
    return { title: "University not found — EduToolsHub" };
  }

  const seoTitle = `${university.name} GPA Requirements 2026 — EduToolsHub`;
  const seoDescription = `${university.name} requires a minimum GPA of ${Number(university.min_gpa).toFixed(2)} with an average admitted GPA of ${Number(university.avg_gpa).toFixed(2)} and an acceptance rate of ${university.acceptance_rate != null ? `${Number(university.acceptance_rate).toFixed(1)}%` : "N/A"}. Compare your GPA and explore admission requirements.`;
  const path = `/tools/college-university-gpa-requirement-checker/${university.slug}`;

  return {
    title: seoTitle,
    description: seoDescription,
    alternates: { canonical: `${SITE_URL}${path}` },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: `${SITE_URL}${path}`,
    },
  };
}

export default async function UniversityDetailPage({ params }) {
  const { slug } = await params;
  const university = await loadUniversity(slug);

  if (!university) {
    notFound();
  }

  const similar = await loadSimilar(university);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-surface-muted py-6 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <UniversityDetailContent university={university} similar={similar} />
      </div>
    </div>
  );
}
