import { notFound, redirect } from "next/navigation";
import BlogPostView from "@/components/blog/BlogPostView";
import { SITE_NAME, SITE_URL } from "@/constants/site";
import { POSTS_TAG, postTag, sanityServerFetch } from "@/lib/sanity-server";
import { buildPostOgImageUrl, enrichPostForBlogView } from "@/lib/sanity-image";
import { normalizePost, normalizePostSlug } from "@/sanity/normalizeSlug";
import { allPostSlugsQuery, postBySlugQuery } from "@/sanity/queries";

export const revalidate = 300;

export async function generateStaticParams() {
  try {
    const slugs = await sanityServerFetch(allPostSlugsQuery, {}, { tags: [POSTS_TAG] });
    return (Array.isArray(slugs) ? slugs : [])
      .map((slug) => normalizePostSlug(slug))
      .filter(Boolean)
      .map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug: rawSlug } = await params;
  const slug = normalizePostSlug(rawSlug);
  if (!slug || slug === "null") return { title: `Blog | ${SITE_NAME}` };

  try {
    const rawPost = await sanityServerFetch(
      postBySlugQuery,
      { slug },
      { tags: [POSTS_TAG, postTag(slug)] }
    );
    const post = normalizePost(rawPost);
    if (!post) return { title: `Article not found | ${SITE_NAME}` };

    const seoTitle = post.seoTitle || post.title;
    const seoDescription = post.metaDescription || post.excerpt || "";
    const canonicalUrl = `${SITE_URL}/blog/${post.slug || slug}`;
    const ogImage = post.mainImage ? buildPostOgImageUrl(post.mainImage) : undefined;

    return {
      title: `${seoTitle} | ${SITE_NAME}`,
      description: seoDescription,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        type: "article",
        title: seoTitle,
        description: seoDescription,
        url: canonicalUrl,
        siteName: SITE_NAME,
        publishedTime: post.publishedAt,
        images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: seoTitle,
        description: seoDescription,
        images: ogImage ? [ogImage] : undefined,
      },
    };
  } catch {
    return { title: `Blog | ${SITE_NAME}` };
  }
}

export default async function BlogPostPage({ params }) {
  const { slug: rawSlug } = await params;
  const slug = normalizePostSlug(rawSlug);

  if (!slug || slug === "null") {
    redirect("/blog");
  }

  const rawPost = await sanityServerFetch(
    postBySlugQuery,
    { slug },
    { tags: [POSTS_TAG, postTag(slug)] }
  );
  const post = enrichPostForBlogView(normalizePost(rawPost));

  if (!post) {
    notFound();
  }

  if (rawSlug !== post.slug) {
    redirect(`/blog/${post.slug}`);
  }

  const seoDescription = post.metaDescription || post.excerpt || "";
  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;
  const ogImage = post.mainImage ? buildPostOgImageUrl(post.mainImage) : null;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: seoDescription,
    image: ogImage ? [ogImage] : undefined,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <BlogPostView post={post} />
    </>
  );
}
