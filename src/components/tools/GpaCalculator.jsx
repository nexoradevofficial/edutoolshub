import { useEffect, useMemo, useRef, useState } from "react";
import { useTrackGenerateResult } from "../../utils/analytics";
import Button from "../ui/Button";
import { IconReport } from "../icons/ToolIcons";
import CountrySelector from "./gpa/CountrySelector";
import ScaleSelector from "./gpa/ScaleSelector";
import SemesterTabs from "./gpa/SemesterTabs";
import SemesterCourses from "./gpa/SemesterCourses";
import GpaSummary from "./gpa/GpaSummary";
import GPAReportPreview from "./gpa/GPAReportPreview";
import {
  GPA_TYPES,
  calculateGpa,
  getDefaultCountryCode,
  getGpaSettingsForCountry,
  getGradeOptions,
} from "../../services/gpa";
import {
  GPA_VIEW_MODES,
  createEmptyCourse,
  createEmptySemester,
} from "../../utils/gpa";

const inputClass =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

const REPORT_PLACEHOLDERS_BY_COUNTRY = {
  US: {
    institutionName: "e.g. Stanford University",
    institutionAddress: "e.g. 450 Serra Mall, Stanford, CA 94305, USA",
  },
  UK: {
    institutionName: "e.g. University of Oxford",
    institutionAddress: "e.g. Wellington Square, Oxford OX1 2JD, United Kingdom",
  },
  CA: {
    institutionName: "e.g. University of Toronto",
    institutionAddress:
      "e.g. 27 King's College Circle, Toronto, ON M5S 1A1, Canada",
  },
  AU: {
    institutionName: "e.g. The University of Melbourne",
    institutionAddress: "e.g. Grattan Street, Parkville VIC 3010, Australia",
  },
};

const FALLBACK_REPORT_PLACEHOLDERS = {
  institutionName: "e.g. Your University",
  institutionAddress: "e.g. Street, City, Country",
};

function getReportPlaceholders(countryCode) {
  return (
    REPORT_PLACEHOLDERS_BY_COUNTRY[countryCode] ?? FALLBACK_REPORT_PLACEHOLDERS
  );
}

/**
 * Build the initial set of semesters. We start with a single semester
 * named "Semester 1" containing 4 empty course rows — this matches the
 * minimum-of-4 starting state requested by the user while leaving the
 * door open to add more.
 */
function createInitialSemesters() {
  return [createEmptySemester("Semester 1")];
}

export default function GpaCalculator() {
  const [countryCode, setCountryCode] = useState(getDefaultCountryCode());
  const [gpaType, setGpaType] = useState(GPA_TYPES.WEIGHTED);
  const [customScaleMax, setCustomScaleMax] = useState(5);

  // Active semester is tracked as a "preferred" id; if that id no longer
  // matches any semester (because we just deleted it, or because Strict
  // Mode generated a new initial set), we fall back to the first
  // semester at render time. This avoids needing a sync useEffect.
  const [semesters, setSemesters] = useState(createInitialSemesters);
  const [activeSemesterId, setActiveSemesterId] = useState(null);

  const [gpaViewMode, setGpaViewMode] = useState(GPA_VIEW_MODES.SEMESTER);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [institutionAddress, setInstitutionAddress] = useState("");
  const [showReport, setShowReport] = useState(false);

  const reportRef = useRef(null);

  const settings = useMemo(
    () => getGpaSettingsForCountry(countryCode, gpaType),
    [countryCode, gpaType]
  );

  const gradeOptions = useMemo(() => getGradeOptions(), []);

  const semesterResults = useMemo(() => {
    const map = {};
    for (const sem of semesters) {
      map[sem.id] = calculateGpa({
        countryCode,
        gpaType,
        customScaleMax,
        courses: sem.courses,
      });
    }
    return map;
    // We intentionally depend on semesters here so toggling a single
    // course's grade re-derives every semester's GPA.
  }, [semesters, countryCode, gpaType, customScaleMax]);

  const cumulativeResult = useMemo(() => {
    const allCourses = semesters.flatMap((s) => s.courses);
    return calculateGpa({
      countryCode,
      gpaType,
      customScaleMax,
      courses: allCourses,
    });
  }, [semesters, countryCode, gpaType, customScaleMax]);

  const hasGpaResult = useMemo(
    () =>
      semesters.some((sem) => sem.courses.some((course) => course.grade)) &&
      cumulativeResult?.gpa != null &&
      !Number.isNaN(cumulativeResult.gpa),
    [semesters, cumulativeResult]
  );

  useTrackGenerateResult("GPA / CGPA Calculator", hasGpaResult);

  const activeSemester = useMemo(
    () =>
      (activeSemesterId &&
        semesters.find((s) => s.id === activeSemesterId)) ||
      semesters[0],
    [semesters, activeSemesterId]
  );

  const activeSemesterIndex = semesters.findIndex(
    (s) => s.id === activeSemester?.id
  );

  const activeResult = activeSemester
    ? semesterResults[activeSemester.id]
    : null;

  const applyRecommendedScale = (code, type) => {
    const s = getGpaSettingsForCountry(code, type);
    setCustomScaleMax(s.recommendedScale);
  };

  const handleCountryChange = (code) => {
    const next = getGpaSettingsForCountry(code, gpaType);
    setCountryCode(code);
    setGpaType(next.defaultGpaType);
    applyRecommendedScale(code, next.defaultGpaType);
    if (!next.supportsAdvancedCourses) {
      setSemesters((prev) =>
        prev.map((sem) => ({
          ...sem,
          courses: sem.courses.map((c) => ({ ...c, isAdvanced: false })),
        }))
      );
    }
  };

  const handleGpaTypeChange = (type) => {
    setGpaType(type);
    applyRecommendedScale(countryCode, type);
    if (type === GPA_TYPES.UNWEIGHTED) {
      setSemesters((prev) =>
        prev.map((sem) => ({
          ...sem,
          courses: sem.courses.map((c) => ({ ...c, isAdvanced: false })),
        }))
      );
    }
  };

  /* ------------------------------ Semester ops ----------------------------- */

  const addSemester = () => {
    const label = `Semester ${semesters.length + 1}`;
    const fresh = createEmptySemester(label);
    setSemesters((prev) => [...prev, fresh]);
    setActiveSemesterId(fresh.id);
  };

  const removeSemester = (id) => {
    setSemesters((prev) => {
      if (prev.length <= 1) return prev;
      const next = prev.filter((s) => s.id !== id);
      if (id === activeSemesterId) {
        setActiveSemesterId(next[0].id);
      }
      return next;
    });
  };

  const renameSemester = (id, name) => {
    setSemesters((prev) =>
      prev.map((s) => (s.id === id ? { ...s, name } : s))
    );
  };

  /* ------------------------------ Course ops ------------------------------- */

  const addCourseToActive = () => {
    setSemesters((prev) =>
      prev.map((s) =>
        s.id === activeSemester?.id
          ? { ...s, courses: [...s.courses, createEmptyCourse()] }
          : s
      )
    );
  };

  const patchCourseInActive = (courseId, patch) => {
    setSemesters((prev) =>
      prev.map((s) =>
        s.id === activeSemester?.id
          ? {
              ...s,
              courses: s.courses.map((c) =>
                c.id === courseId ? { ...c, ...patch } : c
              ),
            }
          : s
      )
    );
  };

  const removeCourseFromActive = (courseId) => {
    setSemesters((prev) =>
      prev.map((s) =>
        s.id === activeSemester?.id
          ? { ...s, courses: s.courses.filter((c) => c.id !== courseId) }
          : s
      )
    );
  };

  /* --------------------------------- Report -------------------------------- */

  const reportReady =
    Boolean(cumulativeResult.gpa) &&
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    institutionName.trim().length > 0;

  const handleGenerateReport = () => {
    if (!reportReady) return;
    setShowReport(true);
  };

  useEffect(() => {
    if (showReport && reportRef.current) {
      reportRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showReport]);

  const showAdvancedColumn =
    settings.supportsAdvancedCourses && gpaType === GPA_TYPES.WEIGHTED;

  const scaleLabel =
    cumulativeResult.scaleMaxFormatted ?? cumulativeResult.scaleMax;

  const reportPlaceholders = getReportPlaceholders(countryCode);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8 print:hidden">
        <CountrySelector value={countryCode} onChange={handleCountryChange} />

        <div className="mt-6 rounded-xl border border-primary/15 bg-primary/5 p-4">
          <p className="text-sm font-medium text-text">{settings.summary}</p>
          {settings.gpaTypeHints[gpaType] && (
            <p className="mt-2 text-sm text-text-muted">{settings.gpaTypeHints[gpaType]}</p>
          )}
          <p className="mt-2 text-xs text-text-muted">
            Not in this list? Use the custom scale below — it works with any
            school grading system worldwide.
          </p>
        </div>

        {settings.canToggleGpaType ? (
          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold text-text">GPA type</label>
            <div className="inline-flex rounded-xl border border-border bg-surface-muted p-1">
              {settings.allowedGpaTypes.map((type) => {
                const label =
                  type === GPA_TYPES.WEIGHTED ? "Weighted" : "Unweighted";
                const active = gpaType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleGpaTypeChange(type)}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                      active
                        ? "bg-white text-primary shadow-sm"
                        : "text-text-muted hover:text-text"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-text-muted">
              Auto-selected for {settings.countryName}. Pick scale below to match your school.
            </p>
          </div>
        ) : (
          <div className="mt-6 flex flex-wrap items-center gap-2 rounded-lg bg-surface-muted px-4 py-3">
            <span className="rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-primary shadow-sm">
              Unweighted (typical)
            </span>
            <span className="text-sm text-text-muted">
              Standard for {settings.countryName} — set your scale below
            </span>
          </div>
        )}

        <ScaleSelector
          value={customScaleMax}
          onChange={setCustomScaleMax}
          recommendedScale={settings.recommendedScale}
          countryName={settings.countryName}
        />

        {cumulativeResult.usingCustomScale && (
          <p className="mt-3 text-xs text-accent font-medium">
            Using custom {scaleLabel} scale (country default was{" "}
            {cumulativeResult.countryDefaultScale})
          </p>
        )}
      </div>

      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8 print:hidden">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text">Your semesters</h2>
            <p className="mt-1 text-sm text-text-muted">
              Add as many semesters as you need — each has its own GPA, and
              they all roll up into your cumulative GPA below.
            </p>
          </div>
        </div>
        <div className="mt-4">
          <SemesterTabs
            semesters={semesters}
            activeId={activeSemester?.id}
            semesterResults={semesterResults}
            onSelect={setActiveSemesterId}
            onAddSemester={addSemester}
          />
        </div>
      </section>

      {activeSemester && (
        <SemesterCourses
          semester={activeSemester}
          semesterResult={activeResult}
          semesterIndex={activeSemesterIndex}
          semesterCount={semesters.length}
          showAdvancedColumn={showAdvancedColumn}
          advancedLabel={settings.advancedLabel}
          scaleMax={cumulativeResult.scaleMax ?? settings.recommendedScale}
          scaleLabel={scaleLabel}
          gradeOptions={gradeOptions}
          onRenameSemester={(name) => renameSemester(activeSemester.id, name)}
          onRemoveSemester={() => removeSemester(activeSemester.id)}
          onAddCourse={addCourseToActive}
          onPatchCourse={patchCourseInActive}
          onRemoveCourse={removeCourseFromActive}
        />
      )}

      <GpaSummary
        viewMode={gpaViewMode}
        onViewModeChange={setGpaViewMode}
        semesters={semesters}
        semesterResults={semesterResults}
        cumulativeResult={cumulativeResult}
        activeSemesterId={activeSemester?.id}
        onSelectSemester={setActiveSemesterId}
        scaleLabel={scaleLabel}
        gpaTypeLabel={
          cumulativeResult.gpaTypeLabel ??
          (gpaType === GPA_TYPES.WEIGHTED ? "Weighted" : "Unweighted")
        }
      />

      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8 print:hidden">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <IconReport className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-text">
              Generate a formal report
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              Add your name and institution to produce a print-ready, unofficial
              transcript-style report covering every semester and your
              cumulative GPA.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="gpa-first-name"
              className="mb-1 block text-sm font-medium text-text"
            >
              First name
            </label>
            <input
              id="gpa-first-name"
              type="text"
              autoComplete="given-name"
              placeholder="e.g. John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="gpa-last-name"
              className="mb-1 block text-sm font-medium text-text"
            >
              Last name
            </label>
            <input
              id="gpa-last-name"
              type="text"
              autoComplete="family-name"
              placeholder="e.g. Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="gpa-institution-name"
              className="mb-1 block text-sm font-medium text-text"
            >
              University / College name
            </label>
            <input
              id="gpa-institution-name"
              type="text"
              autoComplete="organization"
              placeholder={reportPlaceholders.institutionName}
              value={institutionName}
              onChange={(e) => setInstitutionName(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="gpa-institution-address"
              className="mb-1 block text-sm font-medium text-text"
            >
              University / College address
            </label>
            <textarea
              id="gpa-institution-address"
              rows={2}
              autoComplete="street-address"
              placeholder={reportPlaceholders.institutionAddress}
              value={institutionAddress}
              onChange={(e) => setInstitutionAddress(e.target.value)}
              className={`${inputClass} resize-y`}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button onClick={handleGenerateReport} disabled={!reportReady}>
            <IconReport className="h-5 w-5" />
            {showReport ? "Refresh report" : "Generate report"}
          </Button>
          {showReport && (
            <Button variant="secondary" onClick={() => setShowReport(false)}>
              Hide preview
            </Button>
          )}
          {!reportReady && (
            <p className="text-xs text-text-muted">
              {cumulativeResult.gpa
                ? "Add your first name, last name, and institution to enable the report."
                : "Complete at least one course in any semester to enable the report."}
            </p>
          )}
        </div>
      </div>

      {showReport && (
        <div ref={reportRef}>
          <GPAReportPreview
            student={{ firstName, lastName }}
            institution={{ name: institutionName, address: institutionAddress }}
            countryCode={countryCode}
            gpaType={gpaType}
            semesters={semesters}
            semesterResults={semesterResults}
            cumulativeResult={cumulativeResult}
            scaleLabel={scaleLabel}
          />
        </div>
      )}
    </div>
  );
}
