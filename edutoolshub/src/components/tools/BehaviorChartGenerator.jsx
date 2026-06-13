import { useCallback, useEffect, useMemo, useState } from "react";
import Button from "../ui/Button";
import { IconPlus, IconPrint, IconTrash } from "../icons/ToolIcons";
import { useTrackGenerateResult } from "../../utils/analytics";

const STORAGE_KEY = "edutoolshub-behavior-chart";

const inputClass =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

const labelClass = "mb-1 block text-sm font-medium text-text";

const sectionClass =
  "rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const REWARD_ICONS = [
  { value: "star", label: "⭐ Star", symbol: "⭐" },
  { value: "smiley", label: "😊 Smiley", symbol: "😊" },
  { value: "gold", label: "🌟 Gold Star", symbol: "🌟" },
  { value: "heart", label: "❤️ Heart", symbol: "❤️" },
];

const ROW_COLORS = [
  "bg-rose-50/80",
  "bg-sky-50/80",
  "bg-amber-50/80",
  "bg-emerald-50/80",
  "bg-violet-50/80",
  "bg-orange-50/80",
];

const DEFAULT_STATE = {
  chartType: "weekly",
  className: "",
  periodLabel: "",
  rewardIcon: "star",
  studentNames: ["", "", "", "", ""],
  useCategories: false,
  categories: ["Listening", "Sharing", ""],
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return DEFAULT_STATE;
  }
}

function printBehaviorChart(chartType) {
  const id = "behavior-chart-print-page-rule";
  document.getElementById(id)?.remove();

  const style = document.createElement("style");
  style.id = id;
  style.textContent =
    chartType === "weekly"
      ? `@page { size: A4 landscape; margin: 10mm; }`
      : `@page { size: A4 portrait; margin: 10mm; }`;
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

function parseStudentNames(names) {
  return names.map((n) => n.trim()).filter(Boolean);
}

function buildRows(students, categories, useCategories) {
  if (!useCategories) {
    return students.map((name) => ({ studentName: name, category: null }));
  }

  const activeCategories = categories.map((c) => c.trim()).filter(Boolean);
  if (activeCategories.length === 0) {
    return students.map((name) => ({ studentName: name, category: null }));
  }

  const rows = [];
  for (const name of students) {
    for (const category of activeCategories) {
      rows.push({ studentName: name, category });
    }
  }
  return rows;
}

function BehaviorChartPreview({
  chartType,
  className,
  periodLabel,
  rewardIcon,
  rows,
  useCategories,
}) {
  const icon = REWARD_ICONS.find((i) => i.value === rewardIcon)?.symbol ?? "⭐";
  const dayColumns =
    chartType === "weekly"
      ? WEEKDAYS
      : Array.from({ length: 31 }, (_, i) => String(i + 1));

  const isWeekly = chartType === "weekly";

  if (rows.length === 0) {
    return (
      <div className="flex min-h-[280px] items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface-muted/50 p-8 text-center text-sm text-text-muted">
        Add at least one student name to preview your reward chart.
      </div>
    );
  }

  const studentRowSpans = useMemo(() => {
    if (!useCategories) return rows.map(() => 1);
    const counts = {};
    rows.forEach((r) => {
      counts[r.studentName] = (counts[r.studentName] || 0) + 1;
    });
    const seen = new Set();
    return rows.map((r) => {
      if (seen.has(r.studentName)) return 0;
      seen.add(r.studentName);
      return counts[r.studentName];
    });
  }, [rows, useCategories]);

  return (
    <div
      id="behavior-chart-print"
      className={`behavior-chart mx-auto w-full rounded-xl border border-border bg-white shadow-sm print:rounded-none print:border-0 print:shadow-none ${
        isWeekly ? "max-w-[297mm]" : "max-w-[210mm]"
      }`}
    >
      <header className="behavior-chart__header border-b-2 border-violet-200 px-4 py-4 text-center sm:px-6 print:border-slate-400 print:py-3">
        <h2 className="text-lg font-bold text-slate-800 sm:text-xl print:text-black">
          {className || "Class Reward Chart"}
        </h2>
        {periodLabel ? (
          <p className="mt-1 text-sm text-slate-600 print:text-black">{periodLabel}</p>
        ) : null}
        <p className="mt-1 text-xs text-slate-400 print:text-slate-600">
          Place a {icon} sticker for great behavior each day
        </p>
      </header>

      <div className="behavior-chart__table-wrap overflow-x-auto px-2 py-3 sm:px-4 print:overflow-visible print:px-0">
        <table
          className={`behavior-chart__table w-full border-collapse ${
            isWeekly ? "behavior-chart__table--weekly" : "behavior-chart__table--monthly"
          }`}
        >
          <thead>
            <tr>
              <th className="behavior-chart__th behavior-chart__th--name border border-slate-300 bg-violet-100 px-2 py-2 text-left text-xs font-bold uppercase tracking-wide text-slate-700 print:bg-slate-100 print:text-black">
                Student
              </th>
              {useCategories && rows.some((r) => r.category) ? (
                <th className="behavior-chart__th behavior-chart__th--category border border-slate-300 bg-violet-100 px-2 py-2 text-left text-xs font-bold uppercase tracking-wide text-slate-700 print:bg-slate-100 print:text-black">
                  Behavior
                </th>
              ) : null}
              {dayColumns.map((day) => (
                <th
                  key={day}
                  className="behavior-chart__th behavior-chart__th--day border border-slate-300 bg-violet-100 px-1 py-2 text-center text-xs font-bold text-slate-700 print:bg-slate-100 print:text-black"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => {
              const rowSpan = studentRowSpans[rowIndex];
              const showStudent = rowSpan > 0;
              const bgClass = ROW_COLORS[rowIndex % ROW_COLORS.length];

              return (
                <tr
                  key={`${row.studentName}-${row.category ?? ""}-${rowIndex}`}
                  className={`behavior-chart__row ${bgClass} print:bg-white`}
                >
                  {showStudent ? (
                    <td
                      rowSpan={rowSpan > 1 ? rowSpan : undefined}
                      className="behavior-chart__td behavior-chart__td--name border border-slate-300 px-2 py-2 text-sm font-semibold text-slate-800 print:text-black"
                    >
                      {row.studentName}
                    </td>
                  ) : null}
                  {useCategories && row.category ? (
                    <td className="behavior-chart__td behavior-chart__td--category border border-slate-300 px-2 py-1.5 text-xs font-medium text-slate-600 print:text-black">
                      {row.category}
                    </td>
                  ) : null}
                  {dayColumns.map((day) => (
                    <td
                      key={day}
                      className="behavior-chart__td behavior-chart__td--cell border border-slate-300 p-0.5 text-center align-middle"
                    >
                      <div
                        className={`behavior-chart__cell mx-auto flex items-center justify-center border border-dashed border-slate-200 bg-white print:border-slate-400 ${
                          isWeekly
                            ? "h-11 w-11 min-h-[12mm] min-w-[12mm] sm:h-12 sm:w-12"
                            : "h-6 w-6 min-h-[5mm] min-w-[5mm] sm:h-7 sm:w-7"
                        }`}
                        aria-label={`${row.studentName} ${day}`}
                      />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <footer className="behavior-chart__footer border-t border-slate-200 px-4 py-2 text-center text-xs text-slate-400 print:text-slate-500">
        Reward chart · EduToolsHub
      </footer>
    </div>
  );
}

export default function BehaviorChartGenerator() {
  const [chartType, setChartType] = useState(() => loadState().chartType);
  const [className, setClassName] = useState(() => loadState().className);
  const [periodLabel, setPeriodLabel] = useState(() => loadState().periodLabel);
  const [rewardIcon, setRewardIcon] = useState(() => loadState().rewardIcon);
  const [studentNames, setStudentNames] = useState(() => loadState().studentNames);
  const [useCategories, setUseCategories] = useState(() => loadState().useCategories);
  const [categories, setCategories] = useState(() => loadState().categories);

  useEffect(() => {
    const data = {
      chartType,
      className,
      periodLabel,
      rewardIcon,
      studentNames,
      useCategories,
      categories,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [chartType, className, periodLabel, rewardIcon, studentNames, useCategories, categories]);

  const students = useMemo(() => parseStudentNames(studentNames), [studentNames]);
  const rows = useMemo(
    () => buildRows(students, categories, useCategories),
    [students, categories, useCategories]
  );

  const hasOutput = students.length > 0;

  useTrackGenerateResult("behavior-chart", hasOutput);

  const updateStudent = useCallback((index, value) => {
    setStudentNames((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  const addStudent = useCallback(() => {
    setStudentNames((prev) => (prev.length >= 30 ? prev : [...prev, ""]));
  }, []);

  const removeStudent = useCallback((index) => {
    setStudentNames((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateCategory = useCallback((index, value) => {
    setCategories((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  const addCategory = useCallback(() => {
    setCategories((prev) => (prev.length >= 4 ? prev : [...prev, ""]));
  }, []);

  const removeCategory = useCallback((index) => {
    setCategories((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearSaved = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setChartType(DEFAULT_STATE.chartType);
    setClassName(DEFAULT_STATE.className);
    setPeriodLabel(DEFAULT_STATE.periodLabel);
    setRewardIcon(DEFAULT_STATE.rewardIcon);
    setStudentNames(DEFAULT_STATE.studentNames);
    setUseCategories(DEFAULT_STATE.useCategories);
    setCategories(DEFAULT_STATE.categories);
  }, []);

  const handlePrint = useCallback(() => {
    if (!hasOutput) return;
    printBehaviorChart(chartType);
  }, [hasOutput, chartType]);

  const periodPlaceholder =
    chartType === "weekly" ? "Week of 9 June 2026" : "June 2026";

  return (
    <div className="space-y-8">
      <div className="print:hidden space-y-8">
        <section className={sectionClass}>
          <h2 className="mb-1 text-lg font-semibold text-text">Chart setup</h2>
          <p className="mb-5 text-sm text-text-muted">
            Choose a weekly or monthly chart and customize the reward icon.
          </p>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className={labelClass}>Chart type</p>
              <ToggleGroup
                name="Chart type"
                value={chartType}
                onChange={setChartType}
                options={[
                  { value: "weekly", label: "Weekly (Mon–Fri)" },
                  { value: "monthly", label: "Monthly (1–31)" },
                ]}
              />
            </div>

            <div>
              <p className={labelClass}>Reward icon</p>
              <ToggleGroup
                name="Reward icon"
                value={rewardIcon}
                onChange={setRewardIcon}
                options={REWARD_ICONS.map((i) => ({
                  value: i.value,
                  label: i.label,
                }))}
              />
            </div>

            <Field label="Class / school name" htmlFor="class-name">
              <input
                id="class-name"
                type="text"
                className={inputClass}
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="e.g. Sunshine Kindergarten – Butterflies"
              />
            </Field>

            <Field
              label={chartType === "weekly" ? "Week label" : "Month label"}
              htmlFor="period-label"
            >
              <input
                id="period-label"
                type="text"
                className={inputClass}
                value={periodLabel}
                onChange={(e) => setPeriodLabel(e.target.value)}
                placeholder={periodPlaceholder}
              />
            </Field>
          </div>
        </section>

        <section className={sectionClass}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-text">Students</h2>
              <p className="text-sm text-text-muted">
                Up to 30 students · {students.length} added
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={addStudent}
              disabled={studentNames.length >= 30}
            >
              <IconPlus className="mr-1.5 h-4 w-4" />
              Add student
            </Button>
          </div>

          <div className="space-y-2">
            {studentNames.map((name, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  className={inputClass}
                  value={name}
                  onChange={(e) => updateStudent(index, e.target.value)}
                  placeholder={`Student ${index + 1}`}
                  aria-label={`Student ${index + 1} name`}
                />
                <button
                  type="button"
                  onClick={() => removeStudent(index)}
                  disabled={studentNames.length <= 1}
                  className="shrink-0 rounded-lg border border-border p-2 text-text-muted transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                  aria-label={`Remove student ${index + 1}`}
                >
                  <IconTrash className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className={sectionClass}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-text">Behavior categories</h2>
              <p className="text-sm text-text-muted">
                Optional row labels like Listening or Sharing (max 4)
              </p>
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-text">
              <input
                type="checkbox"
                checked={useCategories}
                onChange={(e) => setUseCategories(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-primary"
              />
              Use categories
            </label>
          </div>

          {useCategories && (
            <div className="space-y-2">
              {categories.map((cat, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    className={inputClass}
                    value={cat}
                    onChange={(e) => updateCategory(index, e.target.value)}
                    placeholder={`Category ${index + 1} (e.g. Tidying Up)`}
                    aria-label={`Behavior category ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeCategory(index)}
                    disabled={categories.length <= 1}
                    className="shrink-0 rounded-lg border border-border p-2 text-text-muted transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                    aria-label={`Remove category ${index + 1}`}
                  >
                    <IconTrash className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {categories.length < 4 && (
                <Button variant="ghost" size="sm" onClick={addCategory}>
                  <IconPlus className="mr-1.5 h-4 w-4" />
                  Add category
                </Button>
              )}
            </div>
          )}
        </section>

        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={clearSaved}>
            Clear saved data
          </Button>
        </div>
      </div>

      <section>
        <div className="print:hidden mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-text">Preview</h2>
            <p className="text-sm text-text-muted">
              {hasOutput
                ? `${students.length} student${students.length === 1 ? "" : "s"} · ${chartType === "weekly" ? "A4 landscape" : "A4 portrait"} print`
                : "Your chart will appear here"}
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
            Print chart
          </Button>
        </div>

        <BehaviorChartPreview
          chartType={chartType}
          className={className}
          periodLabel={periodLabel}
          rewardIcon={rewardIcon}
          rows={rows}
          useCategories={useCategories}
        />
      </section>
    </div>
  );
}
