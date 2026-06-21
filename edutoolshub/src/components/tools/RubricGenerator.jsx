import { useCallback, useState } from "react";
import Button from "../ui/Button";
import { IconPlus, IconPrint, IconTrash } from "../icons/ToolIcons";
import { useTrackGenerateResult } from "../../utils/analytics";
import { inputClass, labelClass, sectionClass } from "./shared/toolFormStyles";

const DEFAULT_LEVELS = ["Excellent", "Good", "Satisfactory", "Needs Improvement"];

function printRubric() {
  const id = "rubric-print-page-rule";
  document.getElementById(id)?.remove();
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `@page { size: A4 landscape; margin: 12mm; }`;
  document.head.appendChild(style);
  const cleanup = () => {
    document.getElementById(id)?.remove();
    window.removeEventListener("afterprint", cleanup);
  };
  window.addEventListener("afterprint", cleanup);
  setTimeout(cleanup, 60_000);
  window.print();
}

function emptyCriterion() {
  return {
    id: `crit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: "",
    descriptions: ["", "", "", ""],
  };
}

export default function RubricGenerator() {
  const [title, setTitle] = useState("Assignment Rubric");
  const [levels, setLevels] = useState(DEFAULT_LEVELS);
  const [criteria, setCriteria] = useState([
    { id: "1", name: "Content knowledge", descriptions: ["", "", "", ""] },
    { id: "2", name: "Organization", descriptions: ["", "", "", ""] },
  ]);

  const hasOutput = criteria.some((c) => c.name.trim());

  useTrackGenerateResult("Rubric Generator", hasOutput);

  const updateLevel = (index, value) => {
    setLevels((prev) => prev.map((l, i) => (i === index ? value : l)));
  };

  const updateCriterionName = (id, value) => {
    setCriteria((prev) => prev.map((c) => (c.id === id ? { ...c, name: value } : c)));
  };

  const updateDescription = (id, levelIndex, value) => {
    setCriteria((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              descriptions: c.descriptions.map((d, i) => (i === levelIndex ? value : d)),
            }
          : c
      )
    );
  };

  const addCriterion = () => setCriteria((prev) => [...prev, emptyCriterion()]);
  const removeCriterion = (id) =>
    setCriteria((prev) => (prev.length > 1 ? prev.filter((c) => c.id !== id) : prev));

  const handlePrint = useCallback(() => {
    if (!hasOutput) return;
    printRubric();
  }, [hasOutput]);

  return (
    <div className="space-y-6">
      <div className="print:hidden space-y-6">
        <section className={sectionClass}>
          <h2 className="text-lg font-semibold text-text">Rubric settings</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="rubric-title" className={labelClass}>
                Rubric title
              </label>
              <input
                id="rubric-title"
                className={inputClass}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4">
            <p className={labelClass}>Performance levels</p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {levels.map((level, index) => (
                <input
                  key={index}
                  className={inputClass}
                  value={level}
                  onChange={(e) => updateLevel(index, e.target.value)}
                />
              ))}
            </div>
          </div>
        </section>

        <section className={sectionClass}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-text">Criteria</h2>
            <Button variant="secondary" size="sm" onClick={addCriterion}>
              <IconPlus className="mr-1 h-4 w-4" />
              Add criterion
            </Button>
          </div>
          <div className="space-y-6">
            {criteria.map((criterion) => (
              <div key={criterion.id} className="rounded-xl border border-border bg-surface-muted/30 p-4">
                <div className="flex gap-2">
                  <input
                    className={inputClass}
                    placeholder="Criterion name"
                    value={criterion.name}
                    onChange={(e) => updateCriterionName(criterion.id, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeCriterion(criterion.id)}
                    className="rounded-lg border border-border px-3 text-text-muted hover:text-red-600"
                    aria-label="Remove criterion"
                  >
                    <IconTrash className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 grid gap-2 lg:grid-cols-2">
                  {levels.map((level, index) => (
                    <div key={`${criterion.id}-${index}`}>
                      <label className="mb-1 block text-xs font-medium text-text-muted">
                        {level}
                      </label>
                      <textarea
                        className={`${inputClass} min-h-[72px] resize-y`}
                        placeholder={`Describe ${level.toLowerCase()} performance`}
                        value={criterion.descriptions[index] ?? ""}
                        onChange={(e) => updateDescription(criterion.id, index, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section>
        <div className="print:hidden mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-text">Preview</h2>
          <Button variant="primary" onClick={handlePrint} disabled={!hasOutput}>
            <IconPrint className="mr-2 h-4 w-4" />
            Print rubric
          </Button>
        </div>
        <div
          id="rubric-print"
          className="overflow-x-auto rounded-xl border border-border bg-white p-4 shadow-sm print:border-0 print:p-0 print:shadow-none"
        >
          <h2 className="mb-4 text-center text-xl font-bold text-text print:text-black">{title}</h2>
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-border bg-primary/10 px-3 py-2 text-left font-semibold text-text">
                  Criteria
                </th>
                {levels.map((level) => (
                  <th
                    key={level}
                    className="border border-border bg-primary/10 px-3 py-2 text-left font-semibold text-text"
                  >
                    {level}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {criteria
                .filter((c) => c.name.trim())
                .map((criterion) => (
                  <tr key={criterion.id}>
                    <td className="border border-border px-3 py-2 align-top font-medium text-text">
                      {criterion.name}
                    </td>
                    {levels.map((_, index) => (
                      <td
                        key={`${criterion.id}-${index}`}
                        className="border border-border px-3 py-2 align-top text-text-muted"
                      >
                        {criterion.descriptions[index] || "—"}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
          <p className="mt-4 text-center text-xs text-text-muted print:text-slate-500">
            EduToolsHub · Rubric Generator
          </p>
        </div>
      </section>
    </div>
  );
}
