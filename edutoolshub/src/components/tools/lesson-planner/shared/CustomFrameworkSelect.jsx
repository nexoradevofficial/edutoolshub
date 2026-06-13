import { useMemo, useState } from "react";
import { selectClass, inputClass } from "./FormField";

export default function CustomFrameworkSelect({
  value,
  onChange,
  frameworks,
  onAddCustom,
  className = selectClass,
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [customInput, setCustomInput] = useState("");

  const displayFrameworks = useMemo(() => {
    const list = [...frameworks];
    if (value && !list.some((f) => f.id === value)) {
      list.push({ id: value, label: value });
    }
    return list;
  }, [frameworks, value]);

  function handleAdd() {
    const label = customInput.trim();
    if (!label) return;
    const created = onAddCustom(label);
    if (created) onChange(created.id);
    setCustomInput("");
    setShowAdd(false);
  }

  return (
    <div className="space-y-2">
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className={className}
      >
        {displayFrameworks.map((framework) => (
          <option key={framework.id} value={framework.id}>
            {framework.label}
          </option>
        ))}
      </select>

      {!showAdd ? (
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="text-xs font-medium text-primary hover:underline"
        >
          + Add custom framework
        </button>
      ) : (
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="e.g. Common Core (US) or Australian Curriculum"
            className={`${inputClass} min-w-0 flex-1`}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
          />
          <button
            type="button"
            onClick={handleAdd}
            className="rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-dark"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => {
              setShowAdd(false);
              setCustomInput("");
            }}
            className="rounded-xl border border-border px-3 py-2 text-xs font-medium text-text-muted hover:text-text"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
