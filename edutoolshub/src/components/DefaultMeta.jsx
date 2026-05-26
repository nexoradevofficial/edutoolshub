import { Helmet } from "react-helmet-async";

/**
 * Site-wide default <head> tags rendered into every page via MainLayout.
 *
 * Per-page <Helmet> blocks (e.g. inside <BlogPost />) override these via
 * react-helmet-async's "deepest wins" rule. Tags set here that are NOT
 * overridden by a page still apply, so this acts as a safety net for any
 * page that doesn't define its own SEO.
 */

const SITE_URL = "https://edutoolshub.com";
const SITE_NAME = "EduToolsHub";
const DEFAULT_TITLE = "EduToolsHub — Smart Tools for Students & Teachers";
const DEFAULT_DESCRIPTION =
  "Free smart tools for students and teachers — GPA calculator, attendance sheets, timetables, seating plans, and more.";
const DEFAULT_KEYWORDS =
  "education tools, GPA calculator, attendance sheet, timetable builder, seating plan, report card generator, students, teachers";
const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.png`;

export default function DefaultMeta() {
  return (
    <Helmet defaultTitle={DEFAULT_TITLE} titleTemplate="%s">
      <html lang="en" />
      <meta name="description" content={DEFAULT_DESCRIPTION} />
      <meta name="keywords" content={DEFAULT_KEYWORDS} />
      <link rel="canonical" href={SITE_URL} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={DEFAULT_TITLE} />
      <meta property="og:description" content={DEFAULT_DESCRIPTION} />
      <meta property="og:url" content={SITE_URL} />
      <meta property="og:image" content={DEFAULT_OG_IMAGE} />
      <meta property="og:image:width" content="1024" />
      <meta property="og:image:height" content="1024" />
      <meta property="og:image:alt" content={`${SITE_NAME} logo`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={DEFAULT_TITLE} />
      <meta name="twitter:description" content={DEFAULT_DESCRIPTION} />
      <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
      <meta name="twitter:image:alt" content={`${SITE_NAME} logo`} />

      <meta name="theme-color" content="#2563eb" />
    </Helmet>
  );
}
