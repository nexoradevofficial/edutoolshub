"use client";

import ToolPageLayout from "../layouts/ToolPageLayout";
import TracingSheetGenerator from "../components/tools/TracingSheetGenerator";
import { toolSeoById } from "../data/toolSeo";

export default function TracingSheetPage() {
  return (
    <ToolPageLayout
      title="Worksheet & Tracing Sheet Generator"
      description="Browse phonics, CVC, sight word, and alphabet worksheets — filter by grade and subject, customize, and print tracing sheets for Pre-K through 2nd grade."
      maxWidth="2xl"
      seo={toolSeoById["tracing-sheet"]}
    >
      <TracingSheetGenerator />
    </ToolPageLayout>
  );
}
