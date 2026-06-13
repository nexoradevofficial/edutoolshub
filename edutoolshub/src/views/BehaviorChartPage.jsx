"use client";

import ToolPageLayout from "../layouts/ToolPageLayout";
import BehaviorChartGenerator from "../components/tools/BehaviorChartGenerator";
import { toolSeoById } from "../data/toolSeo";

export default function BehaviorChartPage() {
  return (
    <ToolPageLayout
      title="Behavior & Reward Star Chart Generator"
      description="Build printable weekly or monthly star charts for kindergarten — add up to 30 student names, pick reward icons, and print clean A4 sheets for stickers and stamps."
      maxWidth="2xl"
      seo={toolSeoById["behavior-chart"]}
    >
      <BehaviorChartGenerator />
    </ToolPageLayout>
  );
}
