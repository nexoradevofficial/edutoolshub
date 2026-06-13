import LessonPlannerPage from "@/views/LessonPlannerPage";
import { buildToolPageMetadata } from "@/lib/tool-page";

export const metadata = buildToolPageMetadata("lesson-planner");

export default function Page() {
  return <LessonPlannerPage />;
}
