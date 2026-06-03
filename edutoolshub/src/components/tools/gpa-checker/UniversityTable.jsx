import { Link } from "react-router-dom";
import { getCardMatch, matchBadgeClasses } from "../../../services/universities/matchLogic";

export default function UniversityTable({ universities, studentGpa }) {
  const parsedGpa =
    studentGpa != null && studentGpa !== "" ? Number(studentGpa) : null;

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-white shadow-sm">
      <table className="min-w-full divide-y divide-border text-sm">
        <thead className="bg-surface-muted">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-text">University</th>
            <th className="px-4 py-3 text-left font-semibold text-text">Min GPA</th>
            <th className="px-4 py-3 text-left font-semibold text-text">Avg GPA</th>
            <th className="px-4 py-3 text-left font-semibold text-text">Acceptance</th>
            <th className="px-4 py-3 text-left font-semibold text-text">Type</th>
            <th className="px-4 py-3 text-left font-semibold text-text">QS Rank</th>
            {parsedGpa != null && !Number.isNaN(parsedGpa) && (
              <th className="px-4 py-3 text-left font-semibold text-text">Match</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {universities.map((u) => {
            const match = getCardMatch(
              parsedGpa,
              Number(u.min_gpa),
              Number(u.avg_gpa)
            );
            return (
              <tr key={u.slug} className="hover:bg-surface-muted/50">
                <td className="px-4 py-3">
                  <Link
                    to={`/tools/college-university-gpa-requirement-checker/${u.slug}`}
                    className="font-medium text-text hover:text-primary"
                  >
                    {u.name}
                  </Link>
                  <p className="text-xs text-text-muted">
                    {u.city}, {u.country}
                  </p>
                </td>
                <td className="px-4 py-3 font-semibold text-primary">
                  {Number(u.min_gpa).toFixed(2)}
                </td>
                <td className="px-4 py-3">{Number(u.avg_gpa).toFixed(2)}</td>
                <td className="px-4 py-3">
                  {u.acceptance_rate != null
                    ? `${Number(u.acceptance_rate).toFixed(1)}%`
                    : "—"}
                </td>
                <td className="px-4 py-3">{u.type}</td>
                <td className="px-4 py-3">{u.qs_ranking ? `#${u.qs_ranking}` : "—"}</td>
                {parsedGpa != null && !Number.isNaN(parsedGpa) && (
                  <td className="px-4 py-3">
                    {match ? (
                      <span
                        className={`inline-block rounded-full border px-2 py-0.5 text-xs font-semibold ${matchBadgeClasses(match)}`}
                      >
                        {match}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
