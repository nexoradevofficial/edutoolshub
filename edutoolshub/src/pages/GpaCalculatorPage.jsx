import ToolPageLayout from "../layouts/ToolPageLayout";
import GpaCalculator from "../components/tools/GpaCalculator";
import { toolSeoById } from "../data/toolSeo";

export default function GpaCalculatorPage() {
  return (
    <ToolPageLayout
      title="GPA / CGPA Calculator"
      description="Add semester after semester, drop in your courses, and watch a live meter reveal your per-semester GPA, cumulative GPA, and CGPA on your college or university scale."
      maxWidth="xl"
      seo={toolSeoById["gpa-calculator"]}
    >
      <GpaCalculator />
    </ToolPageLayout>
  );
}
