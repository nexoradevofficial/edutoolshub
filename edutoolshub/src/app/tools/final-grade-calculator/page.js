import ExamMarksNeededPage from "@/views/ExamMarksNeededPage";
import { buildToolPageMetadata } from "@/lib/tool-page";

export const metadata = buildToolPageMetadata("final-grade-calculator");

export default function Page() {
  return <ExamMarksNeededPage />;
}
