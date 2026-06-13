import { DEFAULT_SECTIONS } from "./constants";

function makeSections(overrides) {
  return DEFAULT_SECTIONS.map((s, i) => ({
    id: crypto.randomUUID(),
    type: s.type,
    title: s.title,
    content: overrides[s.type] ?? "",
    order: i,
  }));
}

export const LESSON_TEMPLATES = [
  {
    id: "math-intro",
    name: "Math — Introduction Lesson",
    subject: "Mathematics",
    grade: "6",
    duration: 45,
    sections: {
      objectives:
        "• Students will understand the concept being introduced\n• Students will connect prior knowledge to new material\n• Students will articulate learning goals in their own words",
      activities:
        "1. Warm-up problem (5 min)\n2. Direct instruction with visual aids (15 min)\n3. Guided practice in pairs (15 min)\n4. Exit ticket assessment (10 min)",
      resources:
        "• Whiteboard / projector\n• Student worksheets\n• Manipulatives or digital tools\n• Reference textbook pages",
      assessment:
        "• Formative: observation during guided practice\n• Summative: exit ticket with 3 questions\n• Differentiation: extension problems for early finishers",
    },
  },
  {
    id: "english-reading",
    name: "English — Reading Comprehension",
    subject: "English",
    grade: "8",
    duration: 50,
    sections: {
      objectives:
        "• Analyze key themes in the text\n• Identify literary devices used by the author\n• Support answers with textual evidence",
      activities:
        "1. Silent reading (10 min)\n2. Think-pair-share discussion (10 min)\n3. Guided annotation (15 min)\n4. Written response (15 min)",
      resources:
        "• Class novel or passage copies\n• Highlighters and sticky notes\n• Vocabulary handout\n• Discussion question cards",
      assessment:
        "• Rubric-based written response\n• Participation in discussion\n• Annotation quality check",
    },
  },
  {
    id: "science-lab",
    name: "Science — Lab Investigation",
    subject: "Science",
    grade: "9",
    duration: 90,
    sections: {
      objectives:
        "• Formulate a testable hypothesis\n• Follow lab safety procedures\n• Collect and analyze experimental data\n• Draw evidence-based conclusions",
      activities:
        "1. Safety briefing (5 min)\n2. Hypothesis writing (10 min)\n3. Lab experiment (50 min)\n4. Data analysis and conclusion (25 min)",
      resources:
        "• Lab equipment and materials\n• Safety goggles and aprons\n• Lab report template\n• Reference data tables",
      assessment:
        "• Lab report (method, results, conclusion)\n• Safety compliance observation\n• Peer review of data accuracy",
    },
  },
  {
    id: "ib-inquiry",
    name: "IB — Inquiry-Based Lesson",
    subject: "Science",
    grade: "IB MYP",
    duration: 60,
    sections: {
      objectives:
        "• Develop conceptual understanding through inquiry\n• Apply ATL skills: critical thinking, communication\n• Connect learning to global contexts",
      activities:
        "1. Provocation / entry event (10 min)\n2. Student-led inquiry stations (30 min)\n3. Reflection circle (10 min)\n4. Action planning (10 min)",
      resources:
        "• Inquiry station materials\n• MYP criterion rubric\n• Global context poster\n• Research devices",
      assessment:
        "• Criterion-based formative assessment\n• Self-assessment using ATL reflection\n• Teacher observation notes",
    },
  },
  {
    id: "cambridge-review",
    name: "Cambridge — Exam Review",
    subject: "Mathematics",
    grade: "IGCSE",
    duration: 60,
    sections: {
      objectives:
        "• Review key syllabus topics\n• Practice past-paper style questions\n• Identify areas needing further revision",
      activities:
        "1. Topic recap (15 min)\n2. Past paper practice (30 min)\n3. Mark scheme review (10 min)\n4. Individual study plan (5 min)",
      resources:
        "• Past examination papers\n• Formula sheet\n• Mark scheme\n• Revision checklist",
      assessment:
        "• Mock question marks against mark scheme\n• Self-assessment traffic lights\n• Teacher feedback on weak areas",
    },
  },
  {
    id: "cbse-lecture",
    name: "CBSE — Concept Lecture",
    subject: "Mathematics",
    grade: "10",
    duration: 45,
    sections: {
      objectives:
        "• Understand the NCERT concept for the chapter\n• Solve NCERT exemplar problems\n• Prepare for board-style questions",
      activities:
        "1. Previous knowledge check (5 min)\n2. Concept explanation with examples (20 min)\n3. NCERT exercise problems (15 min)\n4. Doubt clearing (5 min)",
      resources:
        "• NCERT textbook\n• Board exam question bank\n• Chalkboard / digital board\n• Formula reference card",
      assessment:
        "• Oral questioning during class\n• Written exercise submission\n• Weekly test preparation notes",
    },
  },
];

export function createPlanFromTemplate(template) {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title: template.name,
    subject: template.subject,
    grade: template.grade,
    duration: template.duration,
    className: "",
    date: "",
    unitId: null,
    sections: makeSections(template.sections),
    createdAt: now,
    updatedAt: now,
  };
}

export function createBlankPlan() {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title: "Untitled Lesson Plan",
    subject: "Mathematics",
    grade: "6",
    duration: 45,
    className: "",
    date: "",
    unitId: null,
    sections: makeSections({}),
    createdAt: now,
    updatedAt: now,
  };
}
