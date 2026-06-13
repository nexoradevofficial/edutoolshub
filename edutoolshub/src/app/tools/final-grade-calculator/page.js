import ExamMarksNeededPage from "@/views/ExamMarksNeededPage";
import { buildToolPageMetadata } from "@/lib/tool-page";

export const metadata = buildToolPageMetadata("exam-marks-needed");

export default function Page() {
  return <ExamMarksNeededPage />;
}
