import Link from "next/link";
import Button from "@/components/ui/Button";
import BlogCard from "@/components/blog/BlogCard";
import { IconArrowRight } from "@/components/icons/ToolIcons";
import { blogPostHref, normalizePosts } from "@/sanity/normalizeSlug";

export default function BlogListing({ posts: rawPosts }) {
  const posts = normalizePosts(rawPosts).filter((post) => blogPostHref(post?.slug));

  return (
    <section
      className="py-16 sm:py-20"
      data-blog-list-status={posts.length > 0 ? "ready" : undefined}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Blog</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-text sm:text-4xl">
            Practical guides for students & teachers
          </h1>
          <p className="mt-4 text-lg text-text-muted">
            Honest, actionable articles on GPA, grades, attendance, exam prep, and college
            admissions.
          </p>
        </header>

        <div className="mt-12">
          {posts.length === 0 ? (
            <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border bg-surface-muted/50 p-10 text-center">
              <h2 className="text-lg font-semibold text-text">No articles yet</h2>
              <p className="mt-2 text-sm text-text-muted">
                We&apos;re working on the first batch of guides. Check back soon, or browse our
                tools in the meantime.
              </p>
              <div className="mt-5">
                <Button href="/tools" variant="secondary" size="sm">
                  Browse tools
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <BlogCard key={post._id} post={post} priority={i < 3} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-16 rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/5 to-white p-8 text-center sm:p-10">
          <h2 className="text-xl font-bold text-text sm:text-2xl">While you read, try our tools</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-text-muted">
            Calculate your GPA, check university requirements, or generate an attendance sheet —
            instantly, free, no signup.
          </p>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/tools" size="md">
              Browse all tools
              <IconArrowRight />
            </Button>
            <Link
              href="/tools/college-university-gpa-requirement-checker"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Or try College / University GPA Requirement Checker →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
