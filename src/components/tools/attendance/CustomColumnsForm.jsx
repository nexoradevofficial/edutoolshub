import Button from "../../ui/Button";
import { IconPlus, IconTrash } from "../../icons/ToolIcons";
import {
  CUSTOM_COLUMN_POSITIONS,
  createCustomColumn,
} from "../../../utils/attendance";

const inputClass =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

const selectClass = inputClass;

const COLUMN_LIMIT = 6;

const SUGGESTIONS = [
  "Total Present",
  "Total Absent",
  "Percentage",
  "Remarks",
  "Father's Name",
  "Phone",
];

export default function CustomColumnsForm({ columns, onColumnsChange }) {
  const addColumn = () => {
    if (columns.length >= COLUMN_LIMIT) return;
    onColumnsChange([...columns, createCustomColumn()]);
  };

  const addSuggested = (title) => {
    if (columns.length >= COLUMN_LIMIT) return;
    const position = ["Father's Name", "Phone", "Guardian", "Address"].some(
      (label) => title.toLowerCase().includes(label.toLowerCase())
    )
      ? CUSTOM_COLUMN_POSITIONS.BEFORE
      : CUSTOM_COLUMN_POSITIONS.AFTER;
    onColumnsChange([...columns, createCustomColumn({ title, position })]);
  };

  const updateColumn = (id, patch) => {
    onColumnsChange(
      columns.map((c) => (c.id === id ? { ...c, ...patch } : c))
    );
  };

  const removeColumn = (id) => {
    onColumnsChange(columns.filter((c) => c.id !== id));
  };

  const existingTitles = new Set(
    columns.map((c) => c.title?.trim().toLowerCase()).filter(Boolean)
  );
  const remainingSuggestions = SUGGESTIONS.filter(
    (s) => !existingTitles.has(s.toLowerCase())
  );

  const atLimit = columns.length >= COLUMN_LIMIT;

  return (
    <section className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8 print:hidden">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-text">Extra columns</h2>
          <p className="mt-1 text-sm text-text-muted">
            Add custom columns like “Total Present”, “Percentage”, “Phone”, or
            “Remarks”. Cells are left blank for handwritten entries on the
            printed sheet.
          </p>
        </div>
        <span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-medium text-text-muted">
          {columns.length} / {COLUMN_LIMIT}
        </span>
      </div>

      {columns.length > 0 && (
        <div className="mt-5 space-y-3">
          <div className="hidden gap-3 px-2 text-xs font-semibold uppercase tracking-wide text-text-muted sm:grid sm:grid-cols-[minmax(0,1fr)_minmax(140px,180px)_40px]">
            <span>Column title</span>
            <span>Position</span>
            <span className="sr-only">Remove</span>
          </div>

          {columns.map((col, index) => (
            <div
              key={col.id}
              className="grid gap-3 rounded-xl border border-border/60 bg-surface-muted/40 p-3 sm:grid-cols-[minmax(0,1fr)_minmax(140px,180px)_40px] sm:items-center sm:border-0 sm:bg-transparent sm:p-0"
            >
              <div>
                <label
                  htmlFor={`att-col-title-${col.id}`}
                  className="mb-1 block text-xs font-medium text-text-muted sm:sr-only"
                >
                  Column {index + 1} title
                </label>
                <input
                  id={`att-col-title-${col.id}`}
                  type="text"
                  placeholder="e.g. Total Present"
                  value={col.title}
                  onChange={(e) =>
                    updateColumn(col.id, { title: e.target.value })
                  }
                  className={inputClass}
                  maxLength={48}
                />
              </div>
              <div>
                <label
                  htmlFor={`att-col-pos-${col.id}`}
                  className="mb-1 block text-xs font-medium text-text-muted sm:sr-only"
                >
                  Position
                </label>
                <select
                  id={`att-col-pos-${col.id}`}
                  value={col.position}
                  onChange={(e) =>
                    updateColumn(col.id, { position: e.target.value })
                  }
                  className={selectClass}
                >
                  <option value={CUSTOM_COLUMN_POSITIONS.BEFORE}>
                    Before date columns
                  </option>
                  <option value={CUSTOM_COLUMN_POSITIONS.AFTER}>
                    After date columns
                  </option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => removeColumn(col.id)}
                className="flex h-10 w-10 items-center justify-center justify-self-end rounded-lg text-text-muted transition-colors hover:bg-red-50 hover:text-red-500"
                aria-label={`Remove column ${col.title || index + 1}`}
              >
                <IconTrash />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={addColumn}
          disabled={atLimit}
        >
          <IconPlus />
          Add column
        </Button>
        {atLimit && (
          <span className="text-xs text-text-muted">
            Maximum of {COLUMN_LIMIT} extra columns reached.
          </span>
        )}
      </div>

      {!atLimit && remainingSuggestions.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Quick add
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {remainingSuggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addSuggested(s)}
                className="rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-text transition-colors hover:border-primary/40 hover:text-primary"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
