"use client";

import ToolPageLayout from "../layouts/ToolPageLayout";
import StudyTimeCalculator from "../components/tools/StudyTimeCalculator";
import { toolSeoById } from "../data/toolSeo";

export default function StudyTimeCalculatorPage() {
  return (
    <ToolPageLayout
      title="Study Time Calculator"
      description="Plan exam revision by subject — enter days until your exam, hours needed per subject, and get a realistic daily study breakdown."
      maxWidth="xl"
      seo={toolSeoById["study-time-calculator"]}
    >
      <StudyTimeCalculator />
    </ToolPageLayout>
  );
}
