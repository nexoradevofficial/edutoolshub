const PRONOUNS = {
  he: { subject: "He", object: "him", possessive: "his" },
  she: { subject: "She", object: "her", possessive: "her" },
  they: { subject: "They", object: "them", possessive: "their" },
};

const ACADEMIC = {
  excellent: [
    "{name} consistently demonstrates outstanding understanding of {subject} concepts and applies knowledge with confidence.",
    "{name} excels in {subject}, producing thoughtful work that reflects strong critical thinking and preparation.",
    "{name} is a top performer in {subject} and sets a positive example through diligence and academic curiosity.",
  ],
  good: [
    "{name} shows solid progress in {subject} and completes assignments with care and growing independence.",
    "{name} participates well in {subject} and meets grade-level expectations with reliable effort.",
    "{name} demonstrates good understanding of {subject} and is developing stronger study habits.",
  ],
  improving: [
    "{name} is making steady progress in {subject} and benefits from continued practice and review.",
    "{name} shows effort in {subject} and is beginning to apply feedback more consistently.",
    "With focused support, {name} can continue to strengthen skills in {subject}.",
  ],
  needs_support: [
    "{name} would benefit from additional practice in {subject}, especially with foundational skills.",
    "{name} is working to meet expectations in {subject} and needs encouragement to complete assignments on time.",
    "Targeted support in {subject} will help {name} build confidence and close learning gaps.",
  ],
};

const BEHAVIOR = {
  excellent: "{subjectPronoun} demonstrates respectful, responsible behavior and contributes positively to the classroom community.",
  good: "{subjectPronoun} follows classroom expectations and works cooperatively with peers.",
  improving: "{subjectPronoun} is learning to manage classroom routines and respond to reminders appropriately.",
  needs_support: "{subjectPronoun} is working on self-regulation and following classroom expectations more consistently.",
};

const PARTICIPATION = {
  excellent: "{subjectPronoun} actively participates in discussions and asks thoughtful questions.",
  good: "{subjectPronoun} contributes to class activities and engages when prompted.",
  improving: "{subjectPronoun} is becoming more comfortable participating in group work.",
  needs_support: "Encouraging {objectPronoun} to participate in small-group settings may build confidence.",
};

const WORK_HABITS = {
  excellent: "{subjectPronoun} completes work on time and takes pride in neat, organized submissions.",
  good: "{subjectPronoun} generally completes assignments on time with acceptable quality.",
  improving: "{subjectPronoun} is developing stronger organizational habits for homework and classwork.",
  needs_support: "{subjectPronoun} needs reminders to complete and submit work on time.",
};

function pickTemplate(pool, seed) {
  const index = Math.abs(seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % pool.length;
  return pool[index];
}

function applyTemplate(template, vars) {
  return template
    .replace(/\{name\}/g, vars.name)
    .replace(/\{subject\}/g, vars.subject)
    .replace(/\{subjectPronoun\}/g, vars.subjectPronoun)
    .replace(/\{objectPronoun\}/g, vars.objectPronoun)
    .replace(/\{possessive\}/g, vars.possessive);
}

export function generateReportCardComment({
  studentName,
  pronounKey = "they",
  subject = "this subject",
  academicLevel = "good",
  behaviorLevel = "good",
  participationLevel = "good",
  workHabitsLevel = "good",
  includeBehavior = true,
  includeParticipation = true,
  includeWorkHabits = true,
}) {
  const name = String(studentName ?? "").trim();
  if (!name) {
    return { ok: false, error: "Enter the student's name." };
  }

  const pronouns = PRONOUNS[pronounKey] ?? PRONOUNS.they;
  const vars = {
    name,
    subject: subject.trim() || "this subject",
    subjectPronoun: pronouns.subject,
    objectPronoun: pronouns.object,
    possessive: pronouns.possessive,
  };

  const parts = [
    applyTemplate(pickTemplate(ACADEMIC[academicLevel] ?? ACADEMIC.good, name), vars),
  ];

  if (includeBehavior) {
    parts.push(applyTemplate(BEHAVIOR[behaviorLevel] ?? BEHAVIOR.good, vars));
  }
  if (includeParticipation) {
    parts.push(applyTemplate(PARTICIPATION[participationLevel] ?? PARTICIPATION.good, vars));
  }
  if (includeWorkHabits) {
    parts.push(applyTemplate(WORK_HABITS[workHabitsLevel] ?? WORK_HABITS.good, vars));
  }

  return { ok: true, comment: parts.join(" ") };
}

export const REPORT_CARD_OPTIONS = {
  academicLevels: [
    { value: "excellent", label: "Excellent / Exceeds expectations" },
    { value: "good", label: "Good / Meets expectations" },
    { value: "improving", label: "Improving / Progressing" },
    { value: "needs_support", label: "Needs additional support" },
  ],
  behaviorLevels: [
    { value: "excellent", label: "Exemplary behavior" },
    { value: "good", label: "Appropriate behavior" },
    { value: "improving", label: "Developing self-control" },
    { value: "needs_support", label: "Needs behavior support" },
  ],
};
