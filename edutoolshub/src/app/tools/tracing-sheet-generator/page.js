import TracingSheetPage from "@/views/TracingSheetPage";
import { buildToolPageMetadata } from "@/lib/tool-page";

export const metadata = buildToolPageMetadata("tracing-sheet");

export default function Page() {
  return <TracingSheetPage />;
}
