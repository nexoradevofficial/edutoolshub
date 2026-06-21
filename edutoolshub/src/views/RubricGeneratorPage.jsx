"use client";

import ToolPageLayout from "../layouts/ToolPageLayout";
import RubricGenerator from "../components/tools/RubricGenerator";
import { toolSeoById } from "../data/toolSeo";

export default function RubricGeneratorPage() {
  return (
    <ToolPageLayout
      title="Rubric Generator"
      description="Build customizable assessment rubrics with criteria and performance levels — print landscape rubrics for any classroom assignment."
      maxWidth="2xl"
      seo={toolSeoById["rubric-generator"]}
    >
      <RubricGenerator />
    </ToolPageLayout>
  );
}
