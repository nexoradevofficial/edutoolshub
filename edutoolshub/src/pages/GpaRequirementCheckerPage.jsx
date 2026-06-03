import { Helmet } from "react-helmet-async";
import ToolPageLayout from "../layouts/ToolPageLayout";
import GpaRequirementChecker from "../components/tools/GpaRequirementChecker";

const SITE_URL = "https://edutoolshub.com";
const TITLE = "College GPA Requirements 2026 — Compare University Admission GPAs";
const DESCRIPTION =
  "Search and filter universities by GPA requirements. Enter your GPA to see Strong Match, Possible Match, and Reach schools across the US, Canada, UK, Australia, and Germany. Updated 2026 data from official Common Data Sets.";

export default function GpaRequirementCheckerPage() {
  return (
    <>
      <Helmet>
        <title>{TITLE} | EduToolsHub</title>
        <meta name="description" content={DESCRIPTION} />
        <link
          rel="canonical"
          href={`${SITE_URL}/tools/college-university-gpa-requirement-checker`}
        />
        <meta property="og:title" content={`${TITLE} | EduToolsHub`} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta
          property="og:url"
          content={`${SITE_URL}/tools/college-university-gpa-requirement-checker`}
        />
      </Helmet>

      <ToolPageLayout
        title="College / University GPA Requirement Checker"
        description="Search universities worldwide by GPA requirements. Enter your GPA to instantly see which schools are a Strong Match, Possible Match, or Reach — verified 2026 data from official Common Data Sets."
        maxWidth="3xl"
      >
        <GpaRequirementChecker />
      </ToolPageLayout>
    </>
  );
}
