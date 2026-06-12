import imageUrlBuilder from "@sanity/image-url";
import { getSanityServerClient } from "./sanity-server.js";

function getBuilder() {
  return imageUrlBuilder(getSanityServerClient());
}

/** Build a Sanity CDN image URL on the server (no browser client needed). */
export function buildImageUrl(source, { width, height, fit = "crop" } = {}) {
  if (!source?.asset) return "";
  let img = getBuilder().image(source).auto("format");
  if (width) img = img.width(width);
  if (height) img = img.height(height);
  if (fit) img = img.fit(fit);
  return img.url();
}
