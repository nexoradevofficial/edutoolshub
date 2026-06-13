import { createImageUrlBuilder } from "@sanity/image-url";
import { sanityDataset, sanityProjectId } from "@/lib/env";

function getBuilder() {
  const projectId = sanityProjectId();
  if (!projectId) return null;
  return createImageUrlBuilder({ projectId, dataset: sanityDataset() });
}

/** @deprecated Prefer buildImageUrl from @/lib/sanity-image on the server. */
export function urlFor(source) {
  const builder = getBuilder();
  if (!builder) {
    throw new Error(
      "Sanity project ID is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID in your environment."
    );
  }
  return builder.image(source);
}
