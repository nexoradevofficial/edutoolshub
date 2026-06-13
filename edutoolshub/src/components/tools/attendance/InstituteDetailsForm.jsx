import { useRef, useState } from "react";
import { readFileAsDataURL, validateLogoFile } from "../../../utils/attendance";

const inputClass =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

const labelClass = "mb-1 block text-sm font-medium text-text";

export default function InstituteDetailsForm({
  institute,
  onInstituteChange,
  classInfo,
  onClassInfoChange,
}) {
  const fileInputRef = useRef(null);
  const [logoError, setLogoError] = useState("");

  const patchInstitute = (patch) => onInstituteChange({ ...institute, ...patch });
  const patchClass = (patch) => onClassInfoChange({ ...classInfo, ...patch });

  const handleLogoChange = async (event) => {
    setLogoError("");
    const file = event.target.files?.[0];
    if (!file) return;
    const check = validateLogoFile(file);
    if (!check.ok) {
      setLogoError(check.error);
      event.target.value = "";
      return;
    }
    try {
      const dataUrl = await readFileAsDataURL(file);
      patchInstitute({ logoDataUrl: dataUrl, logoFileName: file.name });
    } catch {
      setLogoError("Could not read the file. Please try a different image.");
    } finally {
      event.target.value = "";
    }
  };

  const handleClearLogo = () => {
    setLogoError("");
    patchInstitute({ logoDataUrl: "", logoFileName: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <section className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8 print:hidden">
      <h2 className="text-lg font-semibold text-text">Institute &amp; class details</h2>
      <p className="mt-1 text-sm text-text-muted">
        These appear in the header of every printed attendance sheet. Leave any
        field blank to omit it from the printout.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="att-institute-name" className={labelClass}>
            Institute / school name
          </label>
          <input
            id="att-institute-name"
            type="text"
            placeholder="e.g. Lincoln High School"
            value={institute.name}
            onChange={(e) => patchInstitute({ name: e.target.value })}
            className={inputClass}
            autoComplete="organization"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="att-institute-address" className={labelClass}>
            Institute address (optional)
          </label>
          <textarea
            id="att-institute-address"
            rows={2}
            placeholder="Street, City, State/Province, Postal Code, Country"
            value={institute.address}
            onChange={(e) => patchInstitute({ address: e.target.value })}
            className={`${inputClass} resize-y`}
            autoComplete="street-address"
          />
        </div>

        <div className="sm:col-span-2">
          <span className={labelClass}>Institute logo (optional)</span>
          <div className="flex flex-wrap items-center gap-4 rounded-xl border border-dashed border-border bg-surface-muted/60 p-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-white">
              {institute.logoDataUrl ? (
                <img
                  src={institute.logoDataUrl}
                  alt="Institute logo preview"
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
                  No logo
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
              <input
                ref={fileInputRef}
                id="att-institute-logo"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={handleLogoChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-text transition-colors hover:border-primary/40 hover:text-primary"
              >
                {institute.logoDataUrl ? "Replace logo" : "Upload logo"}
              </button>
              {institute.logoDataUrl && (
                <button
                  type="button"
                  onClick={handleClearLogo}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  Remove
                </button>
              )}
              <p className="text-xs text-text-muted sm:ml-auto">
                PNG, JPG, WEBP, or SVG · max 1.5&nbsp;MB
              </p>
            </div>
          </div>
          {logoError && (
            <p className="mt-2 text-xs font-medium text-red-600">{logoError}</p>
          )}
        </div>

        <div>
          <label htmlFor="att-class-name" className={labelClass}>
            Class / grade
          </label>
          <input
            id="att-class-name"
            type="text"
            placeholder="e.g. Grade 10 — Science"
            value={classInfo.className}
            onChange={(e) => patchClass({ className: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="att-section" className={labelClass}>
            Section / group
          </label>
          <input
            id="att-section"
            type="text"
            placeholder="e.g. Section A"
            value={classInfo.section}
            onChange={(e) => patchClass({ section: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="att-subject" className={labelClass}>
            Subject (optional)
          </label>
          <input
            id="att-subject"
            type="text"
            placeholder="e.g. Mathematics"
            value={classInfo.subject}
            onChange={(e) => patchClass({ subject: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="att-lecturer" className={labelClass}>
            Lecturer / teacher
          </label>
          <input
            id="att-lecturer"
            type="text"
            placeholder="e.g. Ms. Johnson"
            value={classInfo.lecturer}
            onChange={(e) => patchClass({ lecturer: e.target.value })}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="att-academic-year" className={labelClass}>
            Academic year / term (optional)
          </label>
          <input
            id="att-academic-year"
            type="text"
            placeholder="e.g. 2025–2026 · Term 2"
            value={classInfo.academicYear}
            onChange={(e) => patchClass({ academicYear: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>
    </section>
  );
}
