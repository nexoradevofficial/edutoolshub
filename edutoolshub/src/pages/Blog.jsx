import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import BlogCard from "../components/blog/BlogCard";
import BlogCardSkeleton from "../components/blog/BlogCardSkeleton";
import { IconArrowRight } from "../components/icons/ToolIcons";
import { useSanityQuery } from "../sanity/useSanityQuery";
import { normalizePosts } from "../sanity/normalizeSlug";
import { allPostsQuery } from "../sanity/queries";

const SITE_URL = "https://edutoolshub.com";
const PAGE_TITLE = "Blog — Guides for Students & Teachers | EduToolsHub";
const PAGE_DESCRIPTION =
  "Free expert guides on GPA calculations, attendance tracking, exam prep, and university admissions for students and teachers worldwide.";

export default function Blog() {
  const { data: rawPosts, error, isLoading } = useSanityQuery(allPostsQuery);
  const posts = useMemo(() => {
    const normalized = normalizePosts(rawPosts);
    return Array.isArray(normalized) ? normalized : [];
  }, [rawPosts]);

  return (
    <>
      <Helmet>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <link rel="canonical" href={`${SITE_URL}/blog`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:url" content={`${SITE_URL}/blog`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />
      </Helmet>

      <section
        className="py-16 sm:py-20"
        data-blog-list-status={!isLoading && !error && posts.length > 0 ? "ready" : undefined}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <header className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Blog
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-text sm:text-4xl">
              Practical guides for students & teachers
            </h1>
            <p className="mt-4 text-lg text-text-muted">
              Honest, actionable articles on GPA, grades, attendance, exam prep, and college
              admissions.
            </p>
          </header>

          <div className="mt-12">
            {isLoading && <PostsGrid>{renderSkeletons(6)}</PostsGrid>}

            {!isLoading && error && <ErrorState error={error} />}

            {!isLoading && !error && posts && posts.length === 0 && <EmptyState />}

            {!isLoading && !error && posts && posts.length > 0 && (
              <PostsGrid>
                {posts.map((post, i) => (
                  <BlogCard key={post._id} post={post} priority={i < 3} />
                ))}
              </PostsGrid>
            )}
          </div>

          <div className="mt-16 rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/5 to-white p-8 text-center sm:p-10">
            <h2 className="text-xl font-bold text-text sm:text-2xl">
              While you read, try our tools
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-text-muted">
              Calculate your GPA, check university requirements, or generate an
              attendance sheet — instantly, free, no signup.
            </p>
            <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button to="/tools" size="md">
                Browse all tools
                <IconArrowRight />
              </Button>
              <Link
                to="/tools/college-university-gpa-requirement-checker"
                className="text-sm font-semibold text-primary hover:underline"
              >
                Or try College / University GPA Requirement Checker →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function PostsGrid({ children }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
  );
}

function renderSkeletons(count) {
  return Array.from({ length: count }).map((_, i) => <BlogCardSkeleton key={i} />);
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border bg-surface-muted/50 p-10 text-center">
      <h2 className="text-lg font-semibold text-text">No articles yet</h2>
      <p className="mt-2 text-sm text-text-muted">
        We're working on the first batch of guides. Check back soon, or browse our tools in the meantime.
      </p>
      <div className="mt-5">
        <Button to="/tools" variant="secondary" size="sm">
          Browse tools
        </Button>
      </div>
    </div>
  );
}

function ErrorState({ error }) {
  const message = error?.message || "Something went wrong while loading articles.";
  return (
    <div
      role="alert"
      className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-red-50/60 p-6 text-center"
    >
      <h2 className="text-base font-semibold text-red-900">Couldn't load articles</h2>
      <p className="mt-2 text-sm text-red-800/80">{message}</p>
    </div>
  );
}
