import { useMemo, useState, useCallback } from "react";
import { useTrackGenerateResult } from "../../utils/analytics";
import { generateCitation } from "../../utils/citationGenerator";
import Button from "../ui/Button";
import { inputClass, labelClass, sectionClass, selectClass } from "./shared/toolFormStyles";

const SOURCE_FIELDS = {
  website: ["authors", "title", "container", "year", "url", "accessDate"],
  book: ["authors", "title", "publisher", "year"],
  journal: ["authors", "title", "container", "year", "volume", "issue", "pages", "doi"],
};

const FIELD_LABELS = {
  authors: "Author(s) — Last, First",
  title: "Title",
  container: "Website / Journal name",
  publisher: "Publisher",
  year: "Year",
  url: "URL",
  accessDate: "Access date (e.g. 15 March 2026)",
  volume: "Volume",
  issue: "Issue",
  pages: "Page range",
  doi: "DOI (optional)",
};

const EMPTY = {
  authors: "",
  title: "",
  container: "",
  publisher: "",
  year: "",
  url: "",
  accessDate: "",
  volume: "",
  issue: "",
  pages: "",
  doi: "",
};

export default function CitationGenerator() {
  const [style, setStyle] = useState("apa");
  const [sourceType, setSourceType] = useState("website");
  const [fields, setFields] = useState(EMPTY);
  const [copyLabel, setCopyLabel] = useState("Copy citation");

  const output = useMemo(
    () => generateCitation({ style, sourceType, fields }),
    [style, sourceType, fields]
  );

  useTrackGenerateResult("Citation Generator", output.ok);

  const updateField = (key, value) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleCopy = useCallback(async () => {
    if (!output.ok) return;
    try {
      await navigator.clipboard.writeText(`${output.citation}\n\nIn-text: ${output.inText}`);
      setCopyLabel("Copied!");
      setTimeout(() => setCopyLabel("Copy citation"), 2000);
    } catch {
      setCopyLabel("Copy failed");
      setTimeout(() => setCopyLabel("Copy citation"), 2000);
    }
  }, [output]);

  const activeFields = SOURCE_FIELDS[sourceType] ?? SOURCE_FIELDS.website;

  return (
    <div className="space-y-6">
      <section className={sectionClass}>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label htmlFor="citation-style" className={labelClass}>
                Citation style
              </label>
              <select
                id="citation-style"
                className={selectClass}
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              >
                <option value="apa">APA 7th edition</option>
                <option value="mla">MLA 9th edition</option>
              </select>
            </div>
            <div>
              <label htmlFor="source-type" className={labelClass}>
                Source type
              </label>
              <select
                id="source-type"
                className={selectClass}
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value)}
              >
                <option value="website">Website</option>
                <option value="book">Book</option>
                <option value="journal">Journal article</option>
              </select>
            </div>
            {activeFields.map((key) => (
              <div key={key}>
                <label htmlFor={`field-${key}`} className={labelClass}>
                  {FIELD_LABELS[key]}
                </label>
                <input
                  id={`field-${key}`}
                  type="text"
                  className={inputClass}
                  value={fields[key]}
                  onChange={(e) => updateField(key, e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-surface-muted/40 p-6">
            <h2 className="text-lg font-semibold text-text">Generated citation</h2>
            {output.ok ? (
              <>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-text">
                  {output.citation}
                </p>
                <p className="mt-4 text-sm text-text-muted">
                  <span className="font-semibold text-text">In-text citation:</span> {output.inText}
                </p>
                <Button variant="primary" size="sm" className="mt-4" onClick={handleCopy}>
                  {copyLabel}
                </Button>
              </>
            ) : (
              <p className="mt-4 text-sm text-text-muted">
                {output.error || "Fill in the required fields to generate your bibliography entry."}
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
