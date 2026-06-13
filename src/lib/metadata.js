import { SITE_NAME, SITE_URL } from "@/constants/site";

const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.png`;

export function buildPageMetadata({
  title,
  description,
  path = "",
  keywords,
  noIndex = false,
}) {
  const url = path ? `${SITE_URL}${path}` : SITE_URL;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      url,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1024,
          height: 1024,
          alt: `${SITE_NAME} logo`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}
