import { useMemo } from "react";
import Button from "../../ui/Button";
import { IconPrint } from "../../icons/ToolIcons";
import {
  GPA_TYPES,
  GRADE_INPUT_MODES,
  getCountryByCode,
  resolveCourseGradePoints,
} from "../../../services/gpa";

function formatToday() {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatPoints(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return Number(value).toFixed(2);
}

function describeGrade(course, scaleLabel) {
  if (course.gradeInputMode === GRADE_INPUT_MODES.NUMERIC) {
    if (course.courseGpa === "" || course.courseGpa === null) return "—";
    return `${course.courseGpa} / ${scaleLabel}`;
  }
  return course.grade || "—";
}

/**
 * Multi-semester unofficial transcript-style report.
 *
 * Each semester is rendered as its own table with subtotals and an
 * inline semester GPA. The footer summarises cumulative totals and the
 * cumulative GPA across all semesters — the number students most often
 * need for applications.
 */
export default function GPAReportPreview({
  student,
  institution,
  countryCode,
  gpaType,
  semesters,
  semesterResults,
  cumulativeResult,
  scaleLabel,
}) {
  const today = useMemo(() => formatToday(), []);

  const country = useMemo(
    () => getCountryByCode(countryCode),
    [countryCode]
  );

  const renderableSemesters = useMemo(() => {
    return semesters
      .map((sem) => {
        const res = semesterResults[sem.id];
        if (!res?.scaleMax) {
          return { ...sem, result: res, rows: [] };
        }
        const rows = sem.courses
          .map((course, idx) => {
            const points = resolveCourseGradePoints(
              course,
              country,
              gpaType,
              res.scaleMax
            );
            return {
              id: course.id,
              index: idx + 1,
              name: course.name?.trim() || `Course ${idx + 1}`,
              credits: Number(course.credits) || 0,
              gradeLabel: describeGrade(course, scaleLabel),
              isAdvanced: course.isAdvanced,
              points,
            };
          })
          .filter((row) => row.points !== null && row.credits > 0);
        return { ...sem, result: res, rows };
      })
      .filter((sem) => sem.rows.length > 0);
  }, [semesters, semesterResults, country, gpaType, scaleLabel]);

  const fullName =
    [student.firstName?.trim(), student.lastName?.trim()]
      .filter(Boolean)
      .join(" ") || "—";

  const institutionName = institution.name?.trim() || "—";
  const institutionAddress = institution.address?.trim();

  const gpaTypeLabel =
    cumulativeResult?.gpaTypeLabel ??
    (gpaType === GPA_TYPES.WEIGHTED ? "Weighted" : "Unweighted");

  return (
    <article
      id="gpa-report-print"
      className="gpa-report mt-6 rounded-2xl border border-border bg-white p-8 shadow-sm sm:p-12"
    >
      <div className="gpa-report__actions mb-6 flex justify-end print:hidden">
        <Button onClick={() => window.print()}>
          <IconPrint />
          Print Report
        </Button>
      </div>

      <header className="gpa-report__header border-b-2 border-text pb-4 text-center">
        <h2 className="text-2xl font-bold uppercase tracking-[0.18em] text-text sm:text-3xl">
          {institutionName}
        </h2>
        {institutionAddress && (
          <p className="mt-2 whitespace-pre-line text-sm text-text-muted">
            {institutionAddress}
          </p>
        )}
      </header>

      <section className="gpa-report__title mt-6 text-center">
        <h3 className="text-lg font-semibold uppercase tracking-[0.32em] text-text-muted">
          Grade Point Average — Summary Report
        </h3>
      </section>

      <section className="gpa-report__meta mt-6 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Student
          </dt>
          <dd className="mt-1 text-xl font-semibold text-text">{fullName}</dd>
        </div>
        <div className="sm:text-right">
          <dt className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Date Issued
          </dt>
          <dd className="mt-1 text-base font-medium text-text">{today}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Grading System
          </dt>
          <dd className="mt-1 text-sm text-text">
            {country?.name ?? "—"} · {gpaTypeLabel} · {scaleLabel} scale
          </dd>
        </div>
        <div className="sm:text-right">
          <dt className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Semesters · Courses · Credits
          </dt>
          <dd className="mt-1 text-sm text-text">
            {renderableSemesters.length} semester
            {renderableSemesters.length === 1 ? "" : "s"} ·{" "}
            {cumulativeResult?.courseCount ?? 0} courses ·{" "}
            {cumulativeResult?.totalCredits ?? 0} credits
          </dd>
        </div>
      </section>

      <section className="gpa-report__gpa mt-8 border-y-2 border-text py-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-text-muted">
          Cumulative {gpaTypeLabel} GPA
        </p>
        <p className="mt-3 text-6xl font-bold tracking-tight text-text sm:text-7xl">
          {cumulativeResult?.gpa ?? "—"}
        </p>
        <p className="mt-2 text-sm text-text-muted">on a {scaleLabel} scale</p>
      </section>

      <section className="gpa-report__semesters mt-8 space-y-8">
        {renderableSemesters.length === 0 ? (
          <p className="text-center text-sm text-text-muted">
            No completed courses to display in any semester.
          </p>
        ) : (
          renderableSemesters.map((sem, semIdx) => (
            <div
              key={sem.id}
              className="gpa-report__semester"
              style={{ pageBreakInside: "avoid" }}
            >
              <div className="gpa-report__semester-head flex flex-wrap items-baseline justify-between gap-3 border-b border-text pb-2">
                <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-text">
                  Semester {semIdx + 1} — {sem.name}
                </h4>
                <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-text-muted">
                  <span>
                    {sem.result?.courseCount ?? 0} courses ·{" "}
                    {sem.result?.totalCredits ?? 0} credits
                  </span>
                  <span className="rounded border border-text px-2 py-0.5 text-sm font-bold tabular-nums tracking-normal text-text">
                    GPA {sem.result?.gpa ?? "—"}
                  </span>
                </div>
              </div>

              <table className="gpa-report__table mt-3 w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="py-2 pr-2 text-xs font-semibold uppercase tracking-wider text-text-muted w-10">
                      #
                    </th>
                    <th className="py-2 pr-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
                      Course
                    </th>
                    <th className="py-2 pr-2 text-xs font-semibold uppercase tracking-wider text-text-muted text-center w-20">
                      Credits
                    </th>
                    <th className="py-2 pr-2 text-xs font-semibold uppercase tracking-wider text-text-muted text-center w-28">
                      Grade
                    </th>
                    <th className="py-2 text-xs font-semibold uppercase tracking-wider text-text-muted text-right w-24">
                      Points
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sem.rows.map((row) => (
                    <tr
                      key={row.id}
                      className="gpa-report__row border-b border-border align-top"
                    >
                      <td className="py-2 pr-2 text-text-muted">{row.index}</td>
                      <td className="py-2 pr-2 font-medium text-text">
                        {row.name}
                        {row.isAdvanced && (
                          <span className="ml-2 inline-block rounded border border-text px-1.5 text-[10px] font-semibold uppercase tracking-wider text-text">
                            Honors
                          </span>
                        )}
                      </td>
                      <td className="py-2 pr-2 text-center text-text">
                        {row.credits}
                      </td>
                      <td className="py-2 pr-2 text-center font-semibold text-text">
                        {row.gradeLabel}
                      </td>
                      <td className="py-2 text-right tabular-nums text-text">
                        {formatPoints(row.points)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-text">
                    <td className="py-2 pr-2" />
                    <td className="py-2 pr-2 text-sm font-semibold uppercase tracking-wider text-text">
                      Semester Totals
                    </td>
                    <td className="py-2 pr-2 text-center font-semibold text-text">
                      {sem.result?.totalCredits ?? 0}
                    </td>
                    <td className="py-2 pr-2 text-right text-xs uppercase tracking-wider text-text-muted">
                      Sem. GPA
                    </td>
                    <td className="py-2 text-right text-base font-bold tabular-nums text-text">
                      {sem.result?.gpa ?? "—"}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ))
        )}
      </section>

      {renderableSemesters.length > 0 && (
        <section className="gpa-report__cumulative mt-8 border-t-2 border-text pt-4">
          <table className="gpa-report__table w-full border-collapse text-sm">
            <tbody>
              <tr>
                <td className="py-2 pr-2 text-sm font-bold uppercase tracking-[0.18em] text-text">
                  Cumulative Totals
                </td>
                <td className="py-2 pr-2 text-right text-sm text-text">
                  {cumulativeResult?.courseCount ?? 0} courses
                </td>
                <td className="py-2 pr-2 text-center font-bold text-text">
                  {cumulativeResult?.totalCredits ?? 0} credits
                </td>
                <td className="py-2 pr-2 text-right text-xs uppercase tracking-wider text-text-muted">
                  Cumulative GPA
                </td>
                <td className="py-2 text-right text-lg font-bold tabular-nums text-text">
                  {cumulativeResult?.gpa ?? "—"}
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      )}

      <footer className="gpa-report__disclaimer mt-10 border-t border-border pt-4 text-xs leading-relaxed text-text-muted">
        <p>
          This is an unofficial GPA calculation report generated on {today}.
          This document is for informational purposes only and does not serve
          as an official transcript. The calculation reflects the student
          information and course data entered by the user and uses the{" "}
          {country?.name ?? ""} {gpaTypeLabel.toLowerCase()} GPA convention on
          a {scaleLabel} scale across {renderableSemesters.length} semester
          {renderableSemesters.length === 1 ? "" : "s"}. For official records,
          please contact the registrar at {institutionName}.
        </p>
        <p className="mt-2">
          Generated with EduToolsHub · edutoolshub.com
        </p>
      </footer>
    </article>
  );
}
