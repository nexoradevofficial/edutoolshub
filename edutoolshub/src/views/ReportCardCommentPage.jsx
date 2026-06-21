"use client";

import ToolPageLayout from "../layouts/ToolPageLayout";
import ReportCardCommentGenerator from "../components/tools/ReportCardCommentGenerator";
import { toolSeoById } from "../data/toolSeo";

export default function ReportCardCommentPage() {
  return (
    <ToolPageLayout
      title="Report Card Comment Generator"
      description="Generate professional report card comments for academics, behavior, participation, and work habits — edit and copy in seconds."
      maxWidth="2xl"
      seo={toolSeoById["report-card-comments"]}
    >
      <ReportCardCommentGenerator />
    </ToolPageLayout>
  );
}
