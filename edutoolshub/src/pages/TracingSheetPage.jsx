import ToolPageLayout from "../layouts/ToolPageLayout";
import TracingSheetGenerator from "../components/tools/TracingSheetGenerator";
import { toolSeoById } from "../data/toolSeo";

export default function TracingSheetPage() {
  return (
    <ToolPageLayout
      title="Alphabet & Number Tracing Sheet Generator"
      description="Create free, printable tracing sheets for kindergarten and playgroup — choose letters A–Z, numbers 0–9, or custom names with dotted guide lines and multiple practice rows."
      maxWidth="2xl"
      seo={toolSeoById["tracing-sheet"]}
    >
      <TracingSheetGenerator />
    </ToolPageLayout>
  );
}
