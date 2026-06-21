import { useCallback, useState } from "react";
import Button from "../ui/Button";
import { IconPrint } from "../icons/ToolIcons";
import { useTrackGenerateResult } from "../../utils/analytics";
import { inputClass, labelClass, sectionClass } from "./shared/toolFormStyles";

const STYLES = [
  { value: "classic", label: "Classic blue" },
  { value: "gold", label: "Gold achievement" },
  { value: "green", label: "Academic green" },
];

const STYLE_CLASSES = {
  classic: "border-primary bg-gradient-to-br from-primary/10 via-white to-primary/5",
  gold: "border-amber-400 bg-gradient-to-br from-amber-50 via-white to-amber-100/50",
  green: "border-accent bg-gradient-to-br from-accent/10 via-white to-accent/5",
};

function printCertificate() {
  const id = "certificate-print-page-rule";
  document.getElementById(id)?.remove();
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `@page { size: A4 landscape; margin: 10mm; }`;
  document.head.appendChild(style);
  const cleanup = () => {
    document.getElementById(id)?.remove();
    window.removeEventListener("afterprint", cleanup);
  };
  window.addEventListener("afterprint", cleanup);
  setTimeout(cleanup, 60_000);
  window.print();
}

export default function CertificateMaker() {
  const [studentName, setStudentName] = useState("");
  const [achievement, setAchievement] = useState("Outstanding Academic Achievement");
  const [presentedBy, setPresentedBy] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [style, setStyle] = useState("classic");

  const hasOutput = studentName.trim().length > 0 && achievement.trim().length > 0;
  useTrackGenerateResult("Certificate Maker", hasOutput);

  const handlePrint = useCallback(() => {
    if (!hasOutput) return;
    printCertificate();
  }, [hasOutput]);

  return (
    <div className="space-y-6">
      <div className="print:hidden">
        <section className={sectionClass}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="cert-student" className={labelClass}>
                Student / recipient name
              </label>
              <input
                id="cert-student"
                className={inputClass}
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Aisha Khan"
              />
            </div>
            <div>
              <label htmlFor="cert-achievement" className={labelClass}>
                Achievement title
              </label>
              <input
                id="cert-achievement"
                className={inputClass}
                value={achievement}
                onChange={(e) => setAchievement(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="cert-school" className={labelClass}>
                School / organization (optional)
              </label>
              <input
                id="cert-school"
                className={inputClass}
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="cert-teacher" className={labelClass}>
                Presented by (optional)
              </label>
              <input
                id="cert-teacher"
                className={inputClass}
                value={presentedBy}
                onChange={(e) => setPresentedBy(e.target.value)}
                placeholder="e.g. Ms. Rivera, Grade 4 Teacher"
              />
            </div>
            <div>
              <label htmlFor="cert-date" className={labelClass}>
                Date
              </label>
              <input
                id="cert-date"
                type="date"
                className={inputClass}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="cert-style" className={labelClass}>
                Certificate style
              </label>
              <select
                id="cert-style"
                className={inputClass}
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              >
                {STYLES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>
      </div>

      <section>
        <div className="print:hidden mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-text">Certificate preview</h2>
          <Button variant="primary" onClick={handlePrint} disabled={!hasOutput}>
            <IconPrint className="mr-2 h-4 w-4" />
            Print certificate
          </Button>
        </div>

        <div
          id="certificate-print"
          className={`certificate mx-auto flex min-h-[420px] max-w-4xl flex-col items-center justify-center rounded-2xl border-4 p-8 text-center shadow-sm sm:p-12 print:min-h-0 print:rounded-none print:border-4 print:shadow-none ${STYLE_CLASSES[style] ?? STYLE_CLASSES.classic}`}
        >
          {schoolName ? (
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text-muted">
              {schoolName}
            </p>
          ) : null}
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.35em] text-primary">
            Certificate of Achievement
          </p>
          <p className="mt-6 text-base text-text-muted">This certificate is proudly presented to</p>
          <h2 className="mt-3 font-serif text-4xl font-bold text-text sm:text-5xl print:text-black">
            {studentName || "Student Name"}
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-text-muted sm:text-lg">
            For {achievement || "outstanding effort and achievement"}
          </p>
          <div className="mt-10 flex w-full max-w-xl items-end justify-between gap-8 text-sm text-text-muted">
            <div className="flex-1 border-t border-border pt-2">
              {presentedBy || "Teacher / Principal"}
            </div>
            <div className="flex-1 border-t border-border pt-2">
              {date
                ? new Date(date + "T12:00:00").toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Date"}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
