import { useCallback, useMemo, useState } from "react";
import { useTrackGenerateResult } from "../../utils/analytics";
import {
  REPORT_CARD_OPTIONS,
  generateReportCardComment,
} from "../../utils/reportCardComments";
import Button from "../ui/Button";
import { inputClass, labelClass, sectionClass, selectClass } from "./shared/toolFormStyles";

export default function ReportCardCommentGenerator() {
  const [studentName, setStudentName] = useState("");
  const [pronounKey, setPronounKey] = useState("they");
  const [subject, setSubject] = useState("Mathematics");
  const [academicLevel, setAcademicLevel] = useState("good");
  const [behaviorLevel, setBehaviorLevel] = useState("good");
  const [participationLevel, setParticipationLevel] = useState("good");
  const [workHabitsLevel, setWorkHabitsLevel] = useState("good");
  const [includeBehavior, setIncludeBehavior] = useState(true);
  const [includeParticipation, setIncludeParticipation] = useState(true);
  const [includeWorkHabits, setIncludeWorkHabits] = useState(true);
  const [copyLabel, setCopyLabel] = useState("Copy comment");

  const output = useMemo(
    () =>
      generateReportCardComment({
        studentName,
        pronounKey,
        subject,
        academicLevel,
        behaviorLevel,
        participationLevel,
        workHabitsLevel,
        includeBehavior,
        includeParticipation,
        includeWorkHabits,
      }),
    [
      studentName,
      pronounKey,
      subject,
      academicLevel,
      behaviorLevel,
      participationLevel,
      workHabitsLevel,
      includeBehavior,
      includeParticipation,
      includeWorkHabits,
    ]
  );

  useTrackGenerateResult("Report Card Comment Generator", output.ok);

  const handleCopy = useCallback(async () => {
    if (!output.ok) return;
    try {
      await navigator.clipboard.writeText(output.comment);
      setCopyLabel("Copied!");
      setTimeout(() => setCopyLabel("Copy comment"), 2000);
    } catch {
      setCopyLabel("Copy failed");
      setTimeout(() => setCopyLabel("Copy comment"), 2000);
    }
  }, [output]);

  const LevelSelect = ({ id, label, value, onChange, options }) => (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <select id={id} className={selectClass} value={value} onChange={onChange}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="space-y-6">
      <section className={sectionClass}>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label htmlFor="student-name" className={labelClass}>
                Student name
              </label>
              <input
                id="student-name"
                type="text"
                className={inputClass}
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Jordan Smith"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="pronoun" className={labelClass}>
                  Pronouns
                </label>
                <select
                  id="pronoun"
                  className={selectClass}
                  value={pronounKey}
                  onChange={(e) => setPronounKey(e.target.value)}
                >
                  <option value="they">They / them</option>
                  <option value="she">She / her</option>
                  <option value="he">He / him</option>
                </select>
              </div>
              <div>
                <label htmlFor="subject" className={labelClass}>
                  Subject or area
                </label>
                <input
                  id="subject"
                  type="text"
                  className={inputClass}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
            </div>

            <LevelSelect
              id="academic"
              label="Academic performance"
              value={academicLevel}
              onChange={(e) => setAcademicLevel(e.target.value)}
              options={REPORT_CARD_OPTIONS.academicLevels}
            />
            <LevelSelect
              id="behavior"
              label="Behavior"
              value={behaviorLevel}
              onChange={(e) => setBehaviorLevel(e.target.value)}
              options={REPORT_CARD_OPTIONS.behaviorLevels}
            />
            <LevelSelect
              id="participation"
              label="Participation"
              value={participationLevel}
              onChange={(e) => setParticipationLevel(e.target.value)}
              options={REPORT_CARD_OPTIONS.behaviorLevels}
            />
            <LevelSelect
              id="work-habits"
              label="Work habits"
              value={workHabitsLevel}
              onChange={(e) => setWorkHabitsLevel(e.target.value)}
              options={REPORT_CARD_OPTIONS.behaviorLevels}
            />

            <div className="space-y-2 text-sm text-text">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeBehavior}
                  onChange={(e) => setIncludeBehavior(e.target.checked)}
                  className="accent-primary"
                />
                Include behavior sentence
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeParticipation}
                  onChange={(e) => setIncludeParticipation(e.target.checked)}
                  className="accent-primary"
                />
                Include participation sentence
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeWorkHabits}
                  onChange={(e) => setIncludeWorkHabits(e.target.checked)}
                  className="accent-primary"
                />
                Include work habits sentence
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface-muted/40 p-6">
            <h2 className="text-lg font-semibold text-text">Report card comment</h2>
            <p className="mt-1 text-xs text-text-muted">
              Edit the generated text before pasting into your report card system.
            </p>
            {output.ok ? (
              <>
                <textarea
                  className={`${inputClass} mt-4 min-h-[220px] resize-y leading-relaxed`}
                  value={output.comment}
                  readOnly
                />
                <Button variant="primary" size="sm" className="mt-4" onClick={handleCopy}>
                  {copyLabel}
                </Button>
              </>
            ) : (
              <p className="mt-4 text-sm text-text-muted">{output.error}</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
