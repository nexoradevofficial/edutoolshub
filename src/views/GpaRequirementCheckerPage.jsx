"use client";

import ToolPageLayout from "../layouts/ToolPageLayout";
import GpaRequirementChecker from "../components/tools/GpaRequirementChecker";
import { toolSeoById } from "../data/toolSeo";

export default function GpaRequirementCheckerPage() {
  return (
    <ToolPageLayout
      title="College / University GPA Requirement Checker"
      description="Search universities worldwide by GPA requirements. Enter your GPA to instantly see which schools are a Strong Match, Possible Match, or Reach — verified 2026 data from official Common Data Sets."
      maxWidth="3xl"
      seo={toolSeoById["gpa-requirement-checker"]}
    >
      <GpaRequirementChecker />
    </ToolPageLayout>
  );
}
