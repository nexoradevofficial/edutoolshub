import { useCallback, useState } from "react";
import Button from "../ui/Button";
import { IconPrint } from "../icons/ToolIcons";
import { useTrackGenerateResult } from "../../utils/analytics";
import { inputClass, labelClass, sectionClass } from "./shared/toolFormStyles";
import { CERTIFICATE_THEMES, CertificatePreview } from "./certificate/CertificatePreview";

function printCertificate() {
  const id = "certificate-print-page-rule";
  document.getElementById(id)?.remove();
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `@page { size: A4 landscape; margin: 8mm; }`;
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
                {CERTIFICATE_THEMES.map((s) => (
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

        <CertificatePreview
          studentName={studentName}
          achievement={achievement}
          presentedBy={presentedBy}
          schoolName={schoolName}
          date={date}
          themeKey={style}
        />
      </section>
    </div>
  );
}
