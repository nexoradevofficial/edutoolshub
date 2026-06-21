"use client";

import ToolPageLayout from "../layouts/ToolPageLayout";
import PercentageToGpaConverter from "../components/tools/PercentageToGpaConverter";
import { toolSeoById } from "../data/toolSeo";

export default function PercentageToGpaPage() {
  return (
    <ToolPageLayout
      title="Percentage to GPA Converter"
      description="Convert percentage scores to GPA on 4.0, 5.0, or 10.0 scales with letter grades, descriptors, and a reference table — free and instant."
      maxWidth="lg"
      seo={toolSeoById["percentage-to-gpa"]}
    >
      <PercentageToGpaConverter />
    </ToolPageLayout>
  );
}
