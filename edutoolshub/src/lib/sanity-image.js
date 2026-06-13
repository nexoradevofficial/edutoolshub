import { createImageUrlBuilder } from "@sanity/image-url";
import { sanityDataset, sanityProjectId } from "./env";

function getBuilder() {
  const projectId = sanityProjectId();
  if (!projectId) return null;
  return createImageUrlBuilder({ projectId, dataset: sanityDataset() });
}

/** Build a Sanity CDN image URL (server-safe — reads all env fallbacks). */
export function buildImageUrl(source, { width, height, fit = "crop" } = {}) {
  const builder = getBuilder();
  if (!builder || !source?.asset) return "";
  let img = builder.image(source).auto("format");
  if (width) img = img.width(width);
  if (height) img = img.height(height);
  if (fit) img = img.fit(fit);
  return img.url();
}

function buildSrcSet(source, sizes, { height, fit = "crop" } = {}) {
  return sizes
    .map(({ width, height: h, descriptor }) => {
      const url = buildImageUrl(source, { width, height: h ?? height, fit });
      return url ? `${url} ${descriptor}` : null;
    })
    .filter(Boolean)
    .join(", ");
}

/** Precompute carousel image fields so client components don't rebuild URLs. */
export function enrichPostsForInsightSlide(posts) {
  if (!Array.isArray(posts)) return [];

  const builder = getBuilder();
  if (!builder) return posts;

  return posts.map((post) => {
    if (!post?.mainImage?.asset) return post;

    const src = buildImageUrl(post.mainImage, { width: 800, height: 1000 });
    const srcSet = buildSrcSet(post.mainImage, [
      { width: 500, height: 625, descriptor: "500w" },
      { width: 800, height: 1000, descriptor: "800w" },
      { width: 1100, height: 1375, descriptor: "1100w" },
    ]);

    return {
      ...post,
      _insightImage: {
        src,
        srcSet,
        lqip: post.mainImage?.asset?.metadata?.lqip ?? null,
        alt: post.mainImage?.alt || post.title || "Article cover image",
      },
    };
  });
}

/** Precompute blog card image fields for the listing page. */
export function enrichPostsForBlogCard(posts) {
  if (!Array.isArray(posts)) return [];

  const builder = getBuilder();
  if (!builder) return posts;

  return posts.map((post) => {
    if (!post?.mainImage?.asset) return post;

    const src = buildImageUrl(post.mainImage, { width: 800, height: 500 });
    const srcSet = buildSrcSet(post.mainImage, [
      { width: 400, height: 250, descriptor: "400w" },
      { width: 800, height: 500, descriptor: "800w" },
      { width: 1200, height: 750, descriptor: "1200w" },
    ]);

    return {
      ...post,
      _blogImage: {
        src,
        srcSet,
        lqip: post.mainImage?.asset?.metadata?.lqip ?? null,
        alt: post.mainImage?.alt || post.title || "Blog post cover image",
      },
    };
  });
}

function enrichBodyImages(body) {
  if (!Array.isArray(body)) return body;

  return body.map((block) => {
    if (block._type !== "image" || !block.asset) return block;

    const src = buildImageUrl(block, { width: 1200, fit: "max" });
    const srcSet = buildSrcSet(block, [
      { width: 600, fit: "max", descriptor: "600w" },
      { width: 900, fit: "max", descriptor: "900w" },
      { width: 1200, fit: "max", descriptor: "1200w" },
      { width: 1600, fit: "max", descriptor: "1600w" },
    ], { fit: "max" });

    return {
      ...block,
      _computedImage: {
        src,
        srcSet,
        lqip: block.asset?.metadata?.lqip ?? null,
      },
    };
  });
}

/** Precompute hero and inline body images for blog post pages. */
export function enrichPostForBlogView(post) {
  if (!post) return post;

  const enriched = { ...post };

  if (post.mainImage?.asset) {
    const src = buildImageUrl(post.mainImage, { width: 1600, height: 900 });
    const srcSet = buildSrcSet(post.mainImage, [
      { width: 800, height: 450, descriptor: "800w" },
      { width: 1200, height: 675, descriptor: "1200w" },
      { width: 1600, height: 900, descriptor: "1600w" },
      { width: 2000, height: 1125, descriptor: "2000w" },
    ]);

    enriched._heroImage = {
      src,
      srcSet,
      lqip: post.mainImage?.asset?.metadata?.lqip ?? null,
      alt: post.mainImage?.alt || post.title,
      caption: post.mainImage?.caption ?? null,
    };
  }

  if (post.body) {
    enriched.body = enrichBodyImages(post.body);
  }

  return enriched;
}

/** OG / schema image for a blog post mainImage. */
export function buildPostOgImageUrl(mainImage) {
  return buildImageUrl(mainImage, { width: 1200, height: 630 });
}
