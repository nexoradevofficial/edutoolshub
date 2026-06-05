import ToolPageLayout from "../layouts/ToolPageLayout";
import LessonPlanner from "../components/tools/lesson-planner/LessonPlanner";

export default function LessonPlannerPage() {
  return (
    <ToolPageLayout
      title="Lesson Planner"
      description="Plan lessons, map units on a calendar, track curriculum coverage, and create substitute teacher plans — all saved locally in your browser."
      maxWidth="3xl"
    >
      <LessonPlanner />
    </ToolPageLayout>
  );
}
