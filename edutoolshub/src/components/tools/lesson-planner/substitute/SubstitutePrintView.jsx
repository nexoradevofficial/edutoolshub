export default function SubstitutePrintView({ plan, attachedLessons }) {
  return (
    <div className="substitute-print hidden print:block">
      <div className="mb-6 border-b-2 border-text pb-4 text-center">
        <h1 className="text-2xl font-bold">Substitute Teacher Plan</h1>
        <p className="mt-1 text-sm text-text-muted">{plan.date}</p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p><strong>Class:</strong> {plan.className || "—"}</p>
          <p><strong>Subject:</strong> {plan.subject || "—"}</p>
          <p><strong>Grade:</strong> {plan.grade || "—"}</p>
        </div>
        <div>
          <p><strong>Teacher:</strong> {plan.teacherName || "—"}</p>
          <p><strong>Room:</strong> {plan.room || "—"}</p>
          <p><strong>Period:</strong> {plan.period || "—"}</p>
        </div>
      </div>

      {plan.schedule?.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-2 border-b border-border pb-1 text-base font-bold">Schedule</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-1 text-left">Time</th>
                <th className="py-1 text-left">Activity</th>
              </tr>
            </thead>
            <tbody>
              {plan.schedule.map((row, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="py-2 pr-4">{row.time}</td>
                  <td className="py-2">{row.activity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {attachedLessons.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-2 border-b border-border pb-1 text-base font-bold">
            Attached Lesson Plans
          </h2>
          {attachedLessons.map((lesson) => (
            <div key={lesson.id} className="mb-4 break-inside-avoid">
              <h3 className="font-semibold">{lesson.title}</h3>
              <p className="text-xs text-text-muted">
                {lesson.subject} · Grade {lesson.grade} · {lesson.duration} min
              </p>
              {[...lesson.sections]
                .sort((a, b) => a.order - b.order)
                .map((sec) => (
                  <div key={sec.id} className="mt-2">
                    <p className="text-sm font-medium">{sec.title}</p>
                    <p className="whitespace-pre-wrap text-sm">{sec.content || "—"}</p>
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}

      {plan.emergencyFallback && (
        <div className="mb-6 rounded border-2 border-amber-400 bg-amber-50 p-4">
          <h2 className="mb-2 text-base font-bold text-amber-800">Emergency Fallback</h2>
          <p className="whitespace-pre-wrap text-sm">{plan.emergencyFallback}</p>
        </div>
      )}

      {plan.behaviorNotes && (
        <div className="mb-6">
          <h2 className="mb-2 border-b border-border pb-1 text-base font-bold">
            Student Behavior Notes
          </h2>
          <p className="whitespace-pre-wrap text-sm">{plan.behaviorNotes}</p>
        </div>
      )}

      {plan.generalNotes && (
        <div className="mb-6">
          <h2 className="mb-2 border-b border-border pb-1 text-base font-bold">
            Additional Notes
          </h2>
          <p className="whitespace-pre-wrap text-sm">{plan.generalNotes}</p>
        </div>
      )}
    </div>
  );
}
