import { useMemo, useState } from "react";
import { selectClass, inputClass } from "./FormField";

export default function CustomOptionSelect({
  value,
  onChange,
  options,
  onAddCustom,
  formatOption = (option) => String(option),
  parseInput = (input) => input.trim(),
  inputType = "text",
  inputPlaceholder = "Type a custom value…",
  className = selectClass,
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [customInput, setCustomInput] = useState("");

  const displayOptions = useMemo(() => {
    const list = [...options];
    const valueKey = value != null && value !== "" ? formatOption(value) : null;
    if (valueKey && !list.some((option) => formatOption(option) === valueKey)) {
      list.push(value);
    }
    return list;
  }, [options, value, formatOption]);

  function handleAdd() {
    const parsed = parseInput(customInput);
    if (parsed === "" || parsed == null || Number.isNaN(parsed)) return;
    onAddCustom(parsed);
    onChange(parsed);
    setCustomInput("");
    setShowAdd(false);
  }

  return (
    <div className="space-y-2">
      <select
        value={value ?? ""}
        onChange={(e) => {
          const raw = e.target.value;
          onChange(inputType === "number" ? Number(raw) : raw);
        }}
        className={className}
      >
        {displayOptions.map((option) => (
          <option key={formatOption(option)} value={option}>
            {formatOption(option)}
          </option>
        ))}
      </select>

      {!showAdd ? (
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="text-xs font-medium text-primary hover:underline"
        >
          + Add custom
        </button>
      ) : (
        <div className="flex flex-wrap gap-2">
          <input
            type={inputType}
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder={inputPlaceholder}
            className={`${inputClass} min-w-0 flex-1`}
            min={inputType === "number" ? 1 : undefined}
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
