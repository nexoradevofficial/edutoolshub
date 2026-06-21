import CitationGeneratorPage from "@/views/CitationGeneratorPage";
import { buildToolPageMetadata } from "@/lib/tool-page";

export const metadata = buildToolPageMetadata("citation-generator");

export default function Page() {
  return <CitationGeneratorPage />;
}
