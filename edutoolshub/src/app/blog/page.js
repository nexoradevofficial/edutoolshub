import { buildPageMetadata } from "@/lib/metadata";
import { getSanityServerClient } from "@/lib/sanity-server";
import { allPostsQuery } from "@/sanity/queries";
import BlogListing from "@/components/blog/BlogListing";

export const revalidate = 120;

const PAGE_TITLE = "Blog — Guides for Students & Teachers | EduToolsHub";
const PAGE_DESCRIPTION =
  "Free expert guides on GPA calculations, attendance tracking, exam prep, and university admissions for students and teachers worldwide.";

export const metadata = buildPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: "/blog",
});

export default async function BlogPage() {
  let posts = [];
  try {
    const client = getSanityServerClient();
    posts = await client.fetch(allPostsQuery);
  } catch {
    posts = [];
  }

  return <BlogListing posts={posts} />;
}
