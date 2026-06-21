import StudyTimeCalculatorPage from "@/views/StudyTimeCalculatorPage";
import { buildToolPageMetadata } from "@/lib/tool-page";

export const metadata = buildToolPageMetadata("study-time-calculator");

export default function Page() {
  return <StudyTimeCalculatorPage />;
}
