import { SITE_NAME, SITE_URL, DEFAULT_LOGO_PATH } from "@/constants/site";

const DEFAULT_OG_IMAGE = `${SITE_URL}${DEFAULT_LOGO_PATH}`;

export function buildPageMetadata({
  title,
  description,
  path = "",
  keywords,
  noIndex = false,
  ogImage,
  ogType = "website",
}) {
  const url = path ? `${SITE_URL}${path}` : SITE_URL;
  const imageUrl = ogImage
    ? ogImage.startsWith("http")
      ? ogImage
      : `${SITE_URL}${ogImage}`
    : DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: ogType,
      siteName: SITE_NAME,
      title,
      description,
      url,
      locale: "en_US",
      images: [
        {
          url: imageUrl,
          width: ogImage ? 1200 : 72,
          height: ogImage ? 630 : 72,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}
