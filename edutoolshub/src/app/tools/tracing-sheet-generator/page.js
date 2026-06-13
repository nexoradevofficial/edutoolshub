import TracingSheetPage from "@/views/TracingSheetPage";
import { buildToolPageMetadata } from "@/lib/tool-page";

export const metadata = buildToolPageMetadata("tracing-sheet-generator");

export default function Page() {
  return <TracingSheetPage />;
}
