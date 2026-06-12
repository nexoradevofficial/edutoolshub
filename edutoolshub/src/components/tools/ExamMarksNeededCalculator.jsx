import { useMemo, useState } from "react";
import { useTrackGenerateResult } from "../../utils/analytics";
import {
  EXAM_RESULT_STATUS,
  calculateExamMarksNeeded,
} from "../../utils/examMarksNeeded";

const inputClass =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

const inputErrorClass =
  "w-full rounded-lg border border-red-300 bg-white px-3 py-2 text-sm text-text outline-none transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-500/20";

const labelClass = "mb-1 block text-sm font-medium text-text";

const RESULT_STYLES = {
  [EXAM_RESULT_STATUS.INCOMPLETE]: {
    border: "border-border",
    bg: "bg-white",
    accent: "bg-slate-300",
    text: "text-text-muted",
  },
  [EXAM_RESULT_STATUS.INVALID]: {
    border: "border-border",
    bg: "bg-white",
    accent: "bg-slate-300",
    text: "text-text-muted",
  },
  [EXAM_RESULT_STATUS.ALREADY_PASSED]: {
    border: "border-blue-200",
    bg: "bg-gradient-to-br from-blue-50 via-white to-primary/5",
    accent: "bg-blue-500",
    text: "text-blue-800",
  },
  [EXAM_RESULT_STATUS.ACHIEVABLE]: {
    border: "border-emerald-200",
    bg: "bg-gradient-to-br from-emerald-50 via-white to-accent/5",
    accent: "bg-emerald-500",
    text: "text-emerald-800",
  },
  [EXAM_RESULT_STATUS.NOT_ACHIEVABLE]: {
    border: "border-red-200",
    bg: "bg-gradient-to-br from-red-50 via-white to-red-50/30",
    accent: "bg-red-500",
    text: "text-red-800",
  },
};

const FIELDS = [
  {
    id: "marksObtained",
    key: "marksObtained",
    label: "Marks obtained so far",
    hint: "Sum of marks you have already scored on tests, assignments, midterms, and other graded work before the final exam.",
    placeholder: "e.g. 320",
    min: 0,
    step: "any",
  },
  {
    id: "totalCompleted",
    key: "totalCompleted",
    label: "Total marks of completed assessments",
    hint: "Maximum marks possible for all assessments you have already completed (not including the final exam).",
    placeholder: "e.g. 400",
    min: 0,
    step: "any",
  },
  {
    id: "finalExamTotal",
    key: "finalExamTotal",
    label: "Final exam total marks",
    hint: "Full marks the final exam is worth in your course grading scheme.",
    placeholder: "e.g. 100",
    min: 0,
    step: "any",
  },
  {
    id: "targetPercent",
    key: "targetPercent",
    label: "Target / passing percentage",
    hint: "Overall percentage you need to pass or reach your goal (often 40% or 50% — check your syllabus).",
    placeholder: "e.g. 50",
    min: 0,
    max: 100,
    step: "any",
  },
];

function formatMarks(value) {
  if (value == null || Number.isNaN(value)) return "—";
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function formatPercent(value) {
  if (value == null || Number.isNaN(value)) return "—";
  return `${value.toFixed(2)}%`;
}

export default function ExamMarksNeededCalculator() {
  const [marksObtained, setMarksObtained] = useState("");
  const [totalCompleted, setTotalCompleted] = useState("");
  const [finalExamTotal, setFinalExamTotal] = useState("");
  const [targetPercent, setTargetPercent] = useState("50");

  const values = { marksObtained, totalCompleted, finalExamTotal, targetPercent };

  const setters = {
    marksObtained: setMarksObtained,
    totalCompleted: setTotalCompleted,
    finalExamTotal: setFinalExamTotal,
    targetPercent: setTargetPercent,
  };

  const result = useMemo(
    () =>
      calculateExamMarksNeeded({
        marksObtained,
        totalCompleted,
        finalExamTotal,
        targetPercent,
      }),
    [marksObtained, totalCompleted, finalExamTotal, targetPercent]
  );

  const styles = RESULT_STYLES[result.status] ?? RESULT_STYLES[EXAM_RESULT_STATUS.INCOMPLETE];
  const showResults =
    result.status !== EXAM_RESULT_STATUS.INCOMPLETE &&
    result.status !== EXAM_RESULT_STATUS.INVALID;

  useTrackGenerateResult("Final Grade Calculator", showResults);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-white to-accent/5 p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          How this tool works
        </p>
        <h2 className="mt-1 text-xl font-bold text-text sm:text-2xl">
          Find the minimum final exam score you need
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-text-muted">
          Your overall course percentage is calculated from everything you have already
          earned plus whatever you score on the final exam. Enter your marks so far, how
          much the completed work was worth, how many marks the final is worth, and your
          target percentage. The calculator updates instantly and tells you whether your
          goal is still reachable.
        </p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-text-muted">
          <li>
            <strong className="font-medium text-text">Marks obtained so far</strong> — add
            up the points you earned on all graded work before the final.
          </li>
          <li>
            <strong className="font-medium text-text">Total marks of completed assessments</strong>{" "}
            — add the maximum marks for that same work (the denominator for your current
            internal score).
          </li>
          <li>
            <strong className="font-medium text-text">Final exam total marks</strong> — the
            weight of the final in your total course marks.
          </li>
          <li>
            <strong className="font-medium text-text">Target percentage</strong> — the
            passing mark or grade you are aiming for (defaults to 50%).
          </li>
        </ol>
        <p className="mt-4 rounded-lg border border-border/80 bg-white/80 px-4 py-3 text-sm text-text-muted">
          <span className="font-medium text-text">Example:</span> You scored 320 out of 400
          on coursework and the final is out of 100. To reach 50% overall you need{" "}
          <span className="font-medium text-text">30 marks</span> on the final — because
          (320 + 30) ÷ 500 = 50%.
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-lg font-semibold text-text">Your marks</h2>
        <p className="mt-1 text-sm text-text-muted">
          Fill in all fields below. Results update as you type — no button needed.
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {FIELDS.map((field) => {
            const error = result.errors?.[field.key];
            return (
              <div key={field.id}>
                <label htmlFor={field.id} className={labelClass}>
                  {field.label}
                </label>
                <input
                  id={field.id}
                  type="number"
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  value={values[field.key]}
                  onChange={(e) => setters[field.key](e.target.value)}
                  placeholder={field.placeholder}
                  className={error ? inputErrorClass : inputClass}
                  aria-invalid={error ? "true" : undefined}
                  aria-describedby={`${field.id}-hint${error ? ` ${field.id}-error` : ""}`}
                />
                <p id={`${field.id}-hint`} className="mt-1.5 text-xs leading-relaxed text-text-muted">
                  {field.hint}
                </p>
                {error && (
                  <p id={`${field.id}-error`} className="mt-1 text-xs font-medium text-red-600" role="alert">
                    {error}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section
        className={`rounded-2xl border p-6 shadow-sm sm:p-8 ${styles.border} ${styles.bg}`}
        aria-live="polite"
      >
        <div className="flex items-start gap-4">
          <div
            className={`mt-1 h-3 w-3 shrink-0 rounded-full ${styles.accent}`}
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold uppercase tracking-wide text-text-muted">
              Result
            </p>

            {result.status === EXAM_RESULT_STATUS.INCOMPLETE && (
              <p className={`mt-2 text-base ${styles.text}`}>
                Enter your marks above to see how many points you need on the final exam.
              </p>
            )}

            {result.status === EXAM_RESULT_STATUS.INVALID && (
              <p className={`mt-2 text-base ${styles.text}`}>
                Fix the highlighted fields to calculate your required final exam score.
              </p>
            )}

            {showResults && (
              <>
                <p className={`mt-2 text-2xl font-bold sm:text-3xl ${styles.text}`}>
                  {result.message}
                </p>

                <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                  {result.status !== EXAM_RESULT_STATUS.ALREADY_PASSED && (
                    <div className="rounded-xl border border-border/60 bg-white/70 px-4 py-3">
                      <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                        Marks needed in final exam
                      </dt>
                      <dd className="mt-1 text-2xl font-bold text-text">
                        {formatMarks(result.marksNeeded)}
                      </dd>
                    </div>
                  )}

                  <div className="rounded-xl border border-border/60 bg-white/70 px-4 py-3">
                    <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                      {result.status === EXAM_RESULT_STATUS.ALREADY_PASSED
                        ? "Current overall percentage"
                        : "Percentage if you score the needed marks"}
                    </dt>
                    <dd className="mt-1 text-2xl font-bold text-text">
                      {formatPercent(result.projectedPercent)}
                    </dd>
                  </div>

                  {result.status === EXAM_RESULT_STATUS.NOT_ACHIEVABLE && (
                    <div className="rounded-xl border border-border/60 bg-white/70 px-4 py-3 sm:col-span-2">
                      <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                        Best possible overall (full marks on final)
                      </dt>
                      <dd className="mt-1 text-2xl font-bold text-text">
                        {formatPercent(result.maxPossiblePercent)}
                      </dd>
                      <p className="mt-2 text-xs text-text-muted">
                        You would need {formatMarks(result.marksNeeded)} marks, but the
                        final is only worth {formatMarks(Number(finalExamTotal))} marks.
                      </p>
                    </div>
                  )}

                  {result.status === EXAM_RESULT_STATUS.ALREADY_PASSED && (
                    <div className="rounded-xl border border-border/60 bg-white/70 px-4 py-3">
                      <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                        Score on completed work alone
                      </dt>
                      <dd className="mt-1 text-2xl font-bold text-text">
                        {formatPercent(result.currentPercent)}
                      </dd>
                    </div>
                  )}
                </dl>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
