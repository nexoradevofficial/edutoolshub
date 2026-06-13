import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import UniversityDetailContent from "../components/tools/gpa-checker/UniversityDetailContent";
import {
  fetchSimilarUniversities,
  fetchUniversityBySlug,
} from "../services/universities";

const SITE_URL = "https://edutoolshub.com";

export default function UniversityDetailPage() {
  const { slug } = useParams();
  const [university, setUniversity] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await fetchUniversityBySlug(slug);
      if (cancelled) return;

      if (fetchError || !data) {
        setError(fetchError?.message || "University not found");
        setLoading(false);
        return;
      }

      setUniversity(data);

      const { data: similarData } = await fetchSimilarUniversities(data, 4);
      if (!cancelled) setSimilar(similarData ?? []);
      if (!cancelled) setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-surface-muted py-12">
        <div className="mx-auto max-w-4xl px-4">
          <div className="space-y-6">
            <div className="h-8 w-2/3 animate-pulse rounded bg-white/80" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/80" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !university) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-surface-muted py-12">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-2xl font-bold text-text">University not found</h1>
          <p className="mt-2 text-sm text-text-muted">
            We could not find GPA data for &ldquo;{slug}&rdquo;.
          </p>
          <Link
            to="/tools/college-university-gpa-requirement-checker"
            className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
          >
            ← Back to GPA Checker
          </Link>
        </div>
      </div>
    );
  }

  const seoTitle = `${university.name} GPA Requirements 2026 — EduToolsHub`;
  const seoDescription = `${university.name} requires a minimum GPA of ${Number(university.min_gpa).toFixed(2)} with an average admitted GPA of ${Number(university.avg_gpa).toFixed(2)} and an acceptance rate of ${university.acceptance_rate != null ? `${Number(university.acceptance_rate).toFixed(1)}%` : "N/A"}. Compare your GPA and explore admission requirements.`;

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link
          rel="canonical"
          href={`${SITE_URL}/tools/college-university-gpa-requirement-checker/${university.slug}`}
        />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta
          property="og:url"
          content={`${SITE_URL}/tools/college-university-gpa-requirement-checker/${university.slug}`}
        />
      </Helmet>

      <div className="min-h-[calc(100vh-4rem)] bg-surface-muted py-6 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <UniversityDetailContent university={university} similar={similar} />
        </div>
      </div>
    </>
  );
}
