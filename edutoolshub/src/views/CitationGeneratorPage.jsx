"use client";

import ToolPageLayout from "../layouts/ToolPageLayout";
import CitationGenerator from "../components/tools/CitationGenerator";
import { toolSeoById } from "../data/toolSeo";

export default function CitationGeneratorPage() {
  return (
    <ToolPageLayout
      title="Citation & Bibliography Generator"
      description="Create APA 7 and MLA 9 citations for websites, books, and journal articles — copy bibliography entries and in-text citations instantly."
      maxWidth="xl"
      seo={toolSeoById["citation-generator"]}
    >
      <CitationGenerator />
    </ToolPageLayout>
  );
}
