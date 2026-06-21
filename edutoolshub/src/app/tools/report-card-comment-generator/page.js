import ReportCardCommentPage from "@/views/ReportCardCommentPage";
import { buildToolPageMetadata } from "@/lib/tool-page";

export const metadata = buildToolPageMetadata("report-card-comments");

export default function Page() {
  return <ReportCardCommentPage />;
}
