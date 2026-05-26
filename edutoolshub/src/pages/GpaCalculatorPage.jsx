import ToolPageLayout from "../layouts/ToolPageLayout";
import GpaCalculator from "../components/tools/GpaCalculator";

export default function GpaCalculatorPage() {
  return (
    <ToolPageLayout
      title="GPA Calculator"
      description="Add semester after semester, drop in your courses, and watch a live meter reveal your per-semester GPA and cumulative GPA on your school’s scale."
      maxWidth="xl"
    >
      <GpaCalculator />
    </ToolPageLayout>
  );
}
