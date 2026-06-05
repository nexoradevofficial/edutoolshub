export default function LessonPlanPrintView({ plan }) {
  const sorted = [...plan.sections].sort((a, b) => a.order - b.order);

  return (
    <div className="lesson-plan-print hidden print:block">
      <div className="mb-6 border-b-2 border-text pb-4">
        <h1 className="text-2xl font-bold text-text">{plan.title}</h1>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-muted">
          {plan.subject && <span>Subject: {plan.subject}</span>}
          {plan.grade && <span>Grade: {plan.grade}</span>}
          {plan.duration && <span>Duration: {plan.duration} min</span>}
          {plan.className && <span>Class: {plan.className}</span>}
          {plan.date && <span>Date: {plan.date}</span>}
        </div>
      </div>
      {sorted.map((section) => (
        <div key={section.id} className="mb-5 break-inside-avoid">
          <h2 className="mb-2 border-b border-border pb-1 text-base font-bold text-text">
            {section.title}
          </h2>
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-text">
            {section.content || "—"}
          </div>
        </div>
      ))}
    </div>
  );
}
