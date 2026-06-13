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

/** Precompute carousel image fields so client components don't rebuild URLs. */
export function enrichPostsForInsightSlide(posts) {
  if (!Array.isArray(posts)) return [];

  const builder = getBuilder();
  if (!builder) return posts;

  return posts.map((post) => {
    if (!post?.mainImage?.asset) return post;

    const src = buildImageUrl(post.mainImage, { width: 800, height: 1000 });
    const srcSet = [
      `${buildImageUrl(post.mainImage, { width: 500, height: 625 })} 500w`,
      `${buildImageUrl(post.mainImage, { width: 800, height: 1000 })} 800w`,
      `${buildImageUrl(post.mainImage, { width: 1100, height: 1375 })} 1100w`,
    ].join(", ");

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
