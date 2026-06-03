import ToolPageLayout from "../layouts/ToolPageLayout";
import GpaToPercentageConverter from "../components/tools/GpaToPercentageConverter";

export default function GpaToPercentagePage() {
  return (
    <ToolPageLayout
      title="GPA to Percentage Converter"
      description="Convert your GPA to an equivalent percentage on the 4.0, 5.0, or 10.0 scale — with letter grade, performance descriptor, and a visual percentage indicator."
      maxWidth="lg"
    >
      <GpaToPercentageConverter />
    </ToolPageLayout>
  );
}
