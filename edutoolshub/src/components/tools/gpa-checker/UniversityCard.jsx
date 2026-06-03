import { Link } from "react-router-dom";
import { getCardMatch, matchBadgeClasses } from "../../../services/universities/matchLogic";

function GpaBar({ avgGpa, scale }) {
  const pct = Math.min(100, (Number(avgGpa) / Number(scale)) * 100);
  return (
    <div className="mt-3">
      <div className="mb-1 flex justify-between text-xs text-text-muted">
        <span>Avg admitted GPA</span>
        <span>
          {Number(avgGpa).toFixed(2)} / {Number(scale).toFixed(1)}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function UniversityCard({ university, studentGpa }) {
  const match = getCardMatch(
    studentGpa != null && studentGpa !== "" ? Number(studentGpa) : null,
    Number(university.min_gpa),
    Number(university.avg_gpa)
  );

  const location = [university.city, university.country].filter(Boolean).join(", ");

  return (
    <article className="flex flex-col rounded-2xl border border-border bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link
            to={`/tools/college-university-gpa-requirement-checker/${university.slug}`}
            className="text-base font-semibold text-text transition-colors hover:text-primary"
          >
            {university.name}
          </Link>
          <p className="mt-1 text-sm text-text-muted">{location}</p>
        </div>
        {match && (
          <span
            className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${matchBadgeClasses(match)}`}
          >
            {match}
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-surface-muted px-2.5 py-1 font-medium text-text-muted">
          {university.type}
        </span>
        {university.qs_ranking && (
          <span className="rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary">
            QS #{university.qs_ranking}
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-primary/15 bg-primary/5 p-3">
          <p className="text-xs font-medium text-text-muted">Min GPA</p>
          <p className="mt-0.5 text-xl font-bold text-primary">
            {Number(university.min_gpa).toFixed(2)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface-muted/50 p-3">
          <p className="text-xs font-medium text-text-muted">Avg GPA</p>
          <p className="mt-0.5 text-xl font-bold text-text">
            {Number(university.avg_gpa).toFixed(2)}
          </p>
        </div>
      </div>

      {university.acceptance_rate != null && (
        <p className="mt-3 text-sm text-text-muted">
          Acceptance rate:{" "}
          <span className="font-semibold text-text">
            {Number(university.acceptance_rate).toFixed(1)}%
          </span>
        </p>
      )}

      <GpaBar avgGpa={university.avg_gpa} scale={university.gpa_scale} />
    </article>
  );
}
