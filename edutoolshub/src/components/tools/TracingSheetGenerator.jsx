import { useCallback, useMemo, useState } from "react";
import Button from "../ui/Button";
import { IconPrint } from "../icons/ToolIcons";
import { useTrackGenerateResult } from "../../utils/analytics";
import {
  GRADE_LEVELS,
  WORKSHEET_SUBJECTS,
  WORKSHEET_TYPES,
  applyPreset,
  filterPresets,
} from "../../data/worksheetPresets";

const inputClass =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

const labelClass = "mb-1 block text-sm font-medium text-text";

const sectionClass =
  "rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const NUMBERS = "0123456789".split("");

function printTracingSheet() {
  const id = "tracing-sheet-print-page-rule";
  document.getElementById(id)?.remove();

  const style = document.createElement("style");
  style.id = id;
  style.textContent = `@page { size: A4 portrait; margin: 12mm; }`;
  document.head.appendChild(style);

  const cleanup = () => {
    document.getElementById(id)?.remove();
    window.removeEventListener("afterprint", cleanup);
  };
  window.addEventListener("afterprint", cleanup);
  setTimeout(cleanup, 60_000);

  window.print();
}

function ToggleGroup({ options, value, onChange, name }) {
  return (
    <div
      className="inline-flex flex-wrap gap-1 rounded-xl border border-border bg-surface-muted p-1"
      role="group"
      aria-label={name}
    >
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              active
                ? "bg-white text-primary shadow-sm"
                : "text-text-muted hover:text-text"
            }`}
            aria-pressed={active}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function Field({ label, htmlFor, children, className = "" }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
      </label>
      {children}
    </div>
  );
}

function TracingChar({ char, dashed = true, size = 64 }) {
  const height = size;
  const width = char === " " ? size * 0.6 : size * 0.75;

  if (char === " ") {
    return <span style={{ display: "inline-block", width, height }} aria-hidden />;
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 72 72"
      className="inline-block shrink-0"
      aria-hidden
    >
      <text
        x="36"
        y="54"
        textAnchor="middle"
        fontSize="52"
        fontFamily="'Comic Neue', 'Segoe Print', 'Bradley Hand', cursive"
        fontWeight="700"
        fill={dashed ? "none" : "#334155"}
        stroke={dashed ? "#94a3b8" : "none"}
        strokeWidth={dashed ? 2.5 : 0}
        strokeDasharray={dashed ? "6 5" : undefined}
        strokeLinecap="round"
      >
        {char}
      </text>
    </svg>
  );
}

function CharacterBlock({ char, rowsPerChar, showGuide = true }) {
  return (
    <div className="tracing-sheet__char-block mb-6 break-inside-avoid">
      <div className="tracing-sheet__char-label mb-1 text-center text-xs font-semibold uppercase tracking-wide text-slate-400 print:text-slate-500">
        {char === " " ? "Space" : char}
      </div>
      <div className="flex flex-col items-center gap-1">
        {showGuide && (
          <div className="tracing-sheet__guide-row flex justify-center rounded-lg bg-amber-50/80 px-2 py-1 print:bg-transparent">
            <TracingChar char={char} dashed={false} size={56} />
          </div>
        )}
        {Array.from({ length: rowsPerChar }, (_, i) => (
          <div
            key={i}
            className="tracing-sheet__trace-row flex justify-center border-b border-dashed border-slate-200 py-0.5 print:border-slate-300"
          >
            <TracingChar char={char} dashed size={56} />
          </div>
        ))}
      </div>
    </div>
  );
}

function TracingSheetPreview({ title, studentName, characters, rowsPerChar }) {
  if (characters.length === 0) {
    return (
      <div className="flex min-h-[280px] items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface-muted/50 p-8 text-center text-sm text-text-muted">
        Select letters, numbers, or enter a custom word to preview your tracing sheet.
      </div>
    );
  }

  return (
    <div
      id="tracing-sheet-print"
      className="tracing-sheet mx-auto w-full max-w-[210mm] rounded-xl border border-border bg-white p-6 shadow-sm sm:p-8 print:rounded-none print:border-0 print:p-0 print:shadow-none"
    >
      <header className="tracing-sheet__header mb-6 border-b-2 border-amber-200 pb-4 text-center print:border-slate-300">
        {title ? (
          <h2 className="text-xl font-bold text-slate-800 sm:text-2xl print:text-black">
            {title}
          </h2>
        ) : (
          <h2 className="text-xl font-bold text-slate-800 sm:text-2xl print:text-black">
            Tracing Practice
          </h2>
        )}
        {studentName ? (
          <p className="mt-2 text-base text-slate-600 print:text-black">
            Name: <span className="font-semibold">{studentName}</span>
          </p>
        ) : null}
      </header>

      <div className="tracing-sheet__grid grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3 md:grid-cols-4 print:grid-cols-4">
        {characters.map((char, index) => (
          <CharacterBlock
            key={`${char}-${index}`}
            char={char}
            rowsPerChar={rowsPerChar}
          />
        ))}
      </div>

      <footer className="tracing-sheet__footer mt-6 border-t border-slate-200 pt-3 text-center text-xs text-slate-400 print:text-slate-500">
        Trace along the dotted lines · EduToolsHub
      </footer>
    </div>
  );
}

function expandCase(char, mode) {
  if (mode === "upper") return char.toUpperCase();
  if (mode === "lower") return char.toLowerCase();
  if (/[a-zA-Z]/.test(char)) {
    return [char.toUpperCase(), char.toLowerCase()];
  }
  return char;
}

function buildCharacterList({ contentType, selectedLetters, selectedNumbers, customText, caseMode }) {
  let raw = [];

  if (contentType === "letters") {
    raw = [...selectedLetters].sort();
  } else if (contentType === "numbers") {
    raw = [...selectedNumbers].sort((a, b) => Number(a) - Number(b));
  } else {
    raw = customText.split("");
  }

  const expanded = [];
  for (const char of raw) {
    const result = expandCase(char, caseMode);
    if (Array.isArray(result)) {
      expanded.push(...result);
    } else {
      expanded.push(result);
    }
  }
  return expanded;
}

export default function TracingSheetGenerator() {
  const [filterSubject, setFilterSubject] = useState("");
  const [filterGrade, setFilterGrade] = useState("");
  const [filterType, setFilterType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [contentType, setContentType] = useState("letters");
  const [selectedLetters, setSelectedLetters] = useState(["A", "B", "C"]);
  const [selectedNumbers, setSelectedNumbers] = useState(["0", "1", "2"]);
  const [customText, setCustomText] = useState("");
  const [caseMode, setCaseMode] = useState("upper");
  const [rowsPerChar, setRowsPerChar] = useState(3);
  const [studentName, setStudentName] = useState("");
  const [title, setTitle] = useState("Tracing Practice");

  const filteredPresets = useMemo(
    () =>
      filterPresets({
        subject: filterSubject || undefined,
        grade: filterGrade || undefined,
        type: filterType || undefined,
        query: searchQuery,
      }),
    [filterSubject, filterGrade, filterType, searchQuery]
  );

  const applyWorksheetPreset = useCallback((preset) => {
    const next = applyPreset(preset);
    setContentType(next.contentType);
    setSelectedLetters(next.selectedLetters);
    setSelectedNumbers(next.selectedNumbers);
    setCustomText(next.customText);
    setCaseMode(next.caseMode);
    setTitle(next.title);
  }, []);

  const characters = useMemo(
    () =>
      buildCharacterList({
        contentType,
        selectedLetters,
        selectedNumbers,
        customText,
        caseMode,
      }),
    [contentType, selectedLetters, selectedNumbers, customText, caseMode]
  );

  const hasOutput = characters.length > 0;

  useTrackGenerateResult("tracing-sheet", hasOutput);

  const toggleLetter = useCallback((letter) => {
    setSelectedLetters((prev) =>
      prev.includes(letter) ? prev.filter((l) => l !== letter) : [...prev, letter]
    );
  }, []);

  const toggleNumber = useCallback((num) => {
    setSelectedNumbers((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num]
    );
  }, []);

  const selectAllLetters = useCallback(() => setSelectedLetters([...LETTERS]), []);
  const clearLetters = useCallback(() => setSelectedLetters([]), []);
  const selectAllNumbers = useCallback(() => setSelectedNumbers([...NUMBERS]), []);
  const clearNumbers = useCallback(() => setSelectedNumbers([]), []);

  const handlePrint = useCallback(() => {
    if (!hasOutput) return;
    printTracingSheet();
  }, [hasOutput]);

  return (
    <div className="space-y-8">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@700&display=swap"
      />

      <div className="print:hidden space-y-8">
        <section className={sectionClass}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-text">Worksheet library</h2>
              <p className="mt-1 text-sm text-text-muted">
                Browse printable tracing worksheets by subject, grade, and type — inspired by
                early-literacy resource libraries.
              </p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {filteredPresets.length} worksheet{filteredPresets.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-4">
            <div className="space-y-3 rounded-xl border border-border bg-surface-muted/50 p-4 lg:col-span-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Filters</p>
              <div>
                <label htmlFor="ws-search" className="mb-1 block text-xs font-medium text-text">
                  Search
                </label>
                <input
                  id="ws-search"
                  className={inputClass}
                  placeholder="e.g. CVC, sight words"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="ws-subject" className="mb-1 block text-xs font-medium text-text">
                  Subject
                </label>
                <select
                  id="ws-subject"
                  className={inputClass}
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                >
                  <option value="">All subjects</option>
                  {WORKSHEET_SUBJECTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="ws-grade" className="mb-1 block text-xs font-medium text-text">
                  Grade level
                </label>
                <select
                  id="ws-grade"
                  className={inputClass}
                  value={filterGrade}
                  onChange={(e) => setFilterGrade(e.target.value)}
                >
                  <option value="">All grades</option>
                  {GRADE_LEVELS.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="ws-type" className="mb-1 block text-xs font-medium text-text">
                  Resource type
                </label>
                <select
                  id="ws-type"
                  className={inputClass}
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="">All types</option>
                  {WORKSHEET_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              {(filterSubject || filterGrade || filterType || searchQuery) && (
                <button
                  type="button"
                  className="text-xs font-medium text-primary hover:underline"
                  onClick={() => {
                    setFilterSubject("");
                    setFilterGrade("");
                    setFilterType("");
                    setSearchQuery("");
                  }}
                >
                  Clear all filters
                </button>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:col-span-3">
              {filteredPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyWorksheetPreset(preset)}
                  className="rounded-xl border border-border bg-white p-4 text-left transition-all hover:border-primary hover:shadow-md hover:shadow-primary/10"
                >
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-primary">
                      {WORKSHEET_SUBJECTS.find((s) => s.id === preset.subject)?.label}
                    </span>
                    {preset.grades.map((g) => (
                      <span
                        key={g}
                        className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-accent-dark"
                      >
                        {GRADE_LEVELS.find((gl) => gl.id === g)?.label ?? g}
                      </span>
                    ))}
                  </div>
                  <h3 className="mt-2 font-semibold text-text">{preset.title}</h3>
                  <p className="mt-1 text-sm text-text-muted">{preset.description}</p>
                  <span className="mt-3 inline-block text-xs font-semibold text-primary">
                    Use this worksheet →
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className="mb-1 text-lg font-semibold text-text">Customize worksheet</h2>
          <p className="mb-5 text-sm text-text-muted">
            Pick letters, numbers, or type a custom name or word for your class.
          </p>

          <ToggleGroup
            name="Content type"
            value={contentType}
            onChange={setContentType}
            options={[
              { value: "letters", label: "Letters A–Z" },
              { value: "numbers", label: "Numbers 0–9" },
              { value: "custom", label: "Custom word" },
            ]}
          />

          {contentType === "letters" && (
            <div className="mt-5">
              <div className="mb-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={selectAllLetters}
                  className="rounded-lg border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-text-muted hover:text-text"
                >
                  Select all
                </button>
                <button
                  type="button"
                  onClick={clearLetters}
                  className="rounded-lg border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-text-muted hover:text-text"
                >
                  Clear
                </button>
              </div>
              <div className="grid grid-cols-6 gap-2 sm:grid-cols-9 lg:grid-cols-[repeat(13,minmax(0,1fr))]">
                {LETTERS.map((letter) => {
                  const active = selectedLetters.includes(letter);
                  return (
                    <button
                      key={letter}
                      type="button"
                      onClick={() => toggleLetter(letter)}
                      className={`rounded-xl border px-2 py-2 text-sm font-bold transition-colors ${
                        active
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-white text-text-muted hover:border-primary/40"
                      }`}
                      aria-pressed={active}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {contentType === "numbers" && (
            <div className="mt-5">
              <div className="mb-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={selectAllNumbers}
                  className="rounded-lg border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-text-muted hover:text-text"
                >
                  Select all
                </button>
                <button
                  type="button"
                  onClick={clearNumbers}
                  className="rounded-lg border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-text-muted hover:text-text"
                >
                  Clear
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
                {NUMBERS.map((num) => {
                  const active = selectedNumbers.includes(num);
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => toggleNumber(num)}
                      className={`rounded-xl border px-2 py-2 text-sm font-bold transition-colors ${
                        active
                          ? "border-accent bg-accent/10 text-accent-dark"
                          : "border-border bg-white text-text-muted hover:border-accent/40"
                      }`}
                      aria-pressed={active}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {contentType === "custom" && (
            <div className="mt-5">
              <Field label="Custom word or name" htmlFor="custom-text">
                <input
                  id="custom-text"
                  type="text"
                  className={inputClass}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="e.g. Emma, SUN, rainbow"
                />
              </Field>
            </div>
          )}
        </section>

        <section className={sectionClass}>
          <h2 className="mb-5 text-lg font-semibold text-text">Sheet options</h2>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className={labelClass}>Letter case</p>
              <ToggleGroup
                name="Case mode"
                value={caseMode}
                onChange={setCaseMode}
                options={[
                  { value: "upper", label: "Uppercase" },
                  { value: "lower", label: "Lowercase" },
                  { value: "both", label: "Both" },
                ]}
              />
            </div>

            <Field label={`Tracing rows per character (${rowsPerChar})`} htmlFor="rows-slider">
              <input
                id="rows-slider"
                type="range"
                min={2}
                max={5}
                value={rowsPerChar}
                onChange={(e) => setRowsPerChar(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="mt-1 flex justify-between text-xs text-text-muted">
                <span>2 rows</span>
                <span>5 rows</span>
              </div>
            </Field>

            <Field label="Sheet title" htmlFor="sheet-title">
              <input
                id="sheet-title"
                type="text"
                className={inputClass}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Tracing Practice – Monday"
              />
            </Field>

            <Field label="Student name (optional)" htmlFor="student-name">
              <input
                id="student-name"
                type="text"
                className={inputClass}
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Aisha"
              />
            </Field>
          </div>
        </section>
      </div>

      <section>
        <div className="print:hidden mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-text">Preview</h2>
            <p className="text-sm text-text-muted">
              {hasOutput
                ? `${characters.length} character${characters.length === 1 ? "" : "s"} · ${rowsPerChar} tracing rows each`
                : "Your sheet will appear here"}
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={handlePrint}
            disabled={!hasOutput}
            className="print:hidden"
          >
            <IconPrint className="mr-2 h-4 w-4" />
            Print sheet
          </Button>
        </div>

        <TracingSheetPreview
          title={title}
          studentName={studentName}
          characters={characters}
          rowsPerChar={rowsPerChar}
        />
      </section>
    </div>
  );
}
