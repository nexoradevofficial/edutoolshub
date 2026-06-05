import { useState } from "react";
import { LessonPlannerProvider } from "./LessonPlannerContext";
import LessonPlannerGuide from "./LessonPlannerGuide";
import LessonPlannerTopBar from "./LessonPlannerTopBar";
import LessonPlanBuilder from "./builder/LessonPlanBuilder";
import UnitPlanner from "./units/UnitPlanner";
import CurriculumMapper from "./curriculum/CurriculumMapper";
import SubstitutePlanCreator from "./substitute/SubstitutePlanCreator";

function LessonPlannerContent() {
  const [activeModule, setActiveModule] = useState("builder");

  return (
    <div>
      <LessonPlannerGuide />
      <LessonPlannerTopBar activeModule={activeModule} onModuleChange={setActiveModule} />
      {activeModule === "builder" && <LessonPlanBuilder />}
      {activeModule === "units" && <UnitPlanner />}
      {activeModule === "curriculum" && <CurriculumMapper />}
      {activeModule === "substitute" && <SubstitutePlanCreator />}
    </div>
  );
}

export default function LessonPlanner() {
  return (
    <LessonPlannerProvider>
      <LessonPlannerContent />
    </LessonPlannerProvider>
  );
}
