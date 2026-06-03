import ToolPageLayout from "../layouts/ToolPageLayout";
import ExamMarksNeededCalculator from "../components/tools/ExamMarksNeededCalculator";

export default function ExamMarksNeededPage() {
  return (
    <ToolPageLayout
      title="Final Grade Calculator"
      description="Enter your coursework marks, final exam weight, and target percentage — see instantly how many marks you need on the final to pass or reach your goal."
      maxWidth="lg"
    >
      <ExamMarksNeededCalculator />
    </ToolPageLayout>
  );
}
