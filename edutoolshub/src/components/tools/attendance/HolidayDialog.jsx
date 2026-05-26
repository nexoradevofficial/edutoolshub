import { useEffect, useMemo, useRef, useState } from "react";
import Button from "../../ui/Button";
import { IconClose, IconTrash } from "../../icons/ToolIcons";
import {
  DEFAULT_HOLIDAY_REASON,
  HOLIDAY_REASON_PRESETS,
  WEEKDAY_LONG,
} from "../../../utils/attendance";

const inputClass =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

const REASON_MAX_LENGTH = 32;

function formatDateLabel(day) {
  return `${WEEKDAY_LONG[day.weekday]} ${day.day}`;
}

function formatDateSummary(days) {
  if (days.length === 0) return "No dates selected";
  if (days.length === 1) return formatDateLabel(days[0]);
  if (days.length <= 4) {
    return days.map((d) => d.day).join(", ");
  }
  return `${days.length} dates`;
}

/**
 * Modal used to add, edit, or remove holiday(s).
 *
 * Props:
 *   - open                  - controls visibility
 *   - mode                  - "add" | "edit"
 *   - days                  - full month days array (used to show extra-date selector)
 *   - selectedDateISOs      - dates the dialog is currently acting on
 *   - holidayMap            - Map<dateISO, reason> (used to seed the reason in edit mode)
 *   - initialReason         - pre-filled reason text (e.g. "Weekend" from "Mark all Saturdays")
 *   - onClose               - close without saving
 *   - onSave({dateISOs, reason})
 *   - onRemove(dateISOs)    - only relevant in edit mode
 */
export default function HolidayDialog({
  open,
  mode,
  days,
  selectedDateISOs,
  holidayMap,
  initialReason,
  onClose,
  onSave,
  onRemove,
}) {
  const [reason, setReason] = useState("");
  const [dateISOs, setDateISOs] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const reasonInputRef = useRef(null);

  const isEdit = mode === "edit";

  // Reset internal state whenever the dialog (re)opens with new context.
  useEffect(() => {
    if (!open) return;
    setDateISOs(selectedDateISOs ?? []);
    setShowMore((selectedDateISOs ?? []).length > 1);

    if (initialReason !== undefined && initialReason !== null) {
      setReason(initialReason);
      return;
    }
    if (isEdit && selectedDateISOs?.length) {
      // Seed with whichever reason was first stored — when bulk-editing
      // mismatched holidays we still let the user overwrite all of them
      // with a single new reason on save.
      const seed = selectedDateISOs
        .map((iso) => holidayMap?.get?.(iso))
        .find((r) => r);
      setReason(seed ?? "");
    } else {
      setReason("");
    }
  }, [open, mode, initialReason, selectedDateISOs, holidayMap, isEdit]);

  // Autofocus on open.
  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => reasonInputRef.current?.focus(), 30);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  // ESC closes.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const dateISOSet = useMemo(() => new Set(dateISOs), [dateISOs]);

  const selectedDays = useMemo(
    () => days.filter((d) => dateISOSet.has(d.dateISO)),
    [days, dateISOSet]
  );

  const summary = formatDateSummary(selectedDays);

  const toggleExtraDate = (iso) => {
    setDateISOs((prev) =>
      prev.includes(iso) ? prev.filter((x) => x !== iso) : [...prev, iso]
    );
  };

  const handleSave = () => {
    if (dateISOs.length === 0) return;
    const trimmed = reason.trim();
    onSave?.({
      dateISOs,
      reason: trimmed || DEFAULT_HOLIDAY_REASON,
    });
  };

  const handleRemove = () => {
    if (dateISOs.length === 0) return;
    onRemove?.(dateISOs);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="holiday-dialog-title"
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
    >
      <div
        className="absolute inset-0 bg-text/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-border bg-white shadow-xl sm:max-h-[88vh] sm:rounded-2xl">
        <header className="flex items-start justify-between gap-3 border-b border-border px-4 py-3 sm:px-6 sm:py-4">
          <div className="min-w-0">
            <h3
              id="holiday-dialog-title"
              className="text-base font-semibold text-text"
            >
              {isEdit ? "Edit holiday" : "Mark holiday"}
            </h3>
            <p className="mt-0.5 truncate text-xs text-text-muted">{summary}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-lg p-1.5 text-text-muted transition-colors hover:bg-surface-muted hover:text-text"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-5 px-4 py-4 sm:px-6 sm:py-5">
          <div>
            <label
              htmlFor="att-holiday-reason"
              className="mb-1 block text-sm font-medium text-text"
            >
              Reason for holiday
            </label>
            <input
              id="att-holiday-reason"
              ref={reasonInputRef}
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder='e.g. "Christmas", "Snow Day", "Mid-Term Break"'
              className={inputClass}
              maxLength={REASON_MAX_LENGTH}
              onKeyDown={(e) => {
                if (e.key === "Enter" && dateISOs.length > 0) {
                  e.preventDefault();
                  handleSave();
                }
              }}
            />
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                Quick reasons:
              </span>
              {HOLIDAY_REASON_PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setReason(p)}
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${
                    reason === p
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-white text-text-muted hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-text-muted">
              This text will be printed vertically (upside-down) inside the
              holiday column. Keep it short — up to {REASON_MAX_LENGTH} characters.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-text">
                Applies to {dateISOs.length} date{dateISOs.length === 1 ? "" : "s"}
              </p>
              <button
                type="button"
                onClick={() => setShowMore((v) => !v)}
                className="text-xs font-medium text-primary transition-colors hover:text-primary-dark"
              >
                {showMore ? "Hide date picker" : "Add more dates"}
              </button>
            </div>
            {showMore && (
              <div className="mt-3 grid grid-cols-7 gap-1.5 sm:grid-cols-10">
                {days.map((d) => {
                  const checked = dateISOSet.has(d.dateISO);
                  const isExistingOther =
                    holidayMap?.has?.(d.dateISO) && !checked;
                  let palette;
                  if (checked) {
                    palette =
                      "border-amber-300 bg-amber-100 text-amber-900";
                  } else if (isExistingOther) {
                    palette =
                      "border-amber-200 bg-amber-50 text-amber-800";
                  } else if (d.isSunday) {
                    palette =
                      "border-red-200 bg-red-50 text-red-700";
                  } else {
                    palette =
                      "border-border bg-white text-text hover:border-primary/40 hover:text-primary";
                  }
                  return (
                    <button
                      key={d.dateISO}
                      type="button"
                      onClick={() => toggleExtraDate(d.dateISO)}
                      aria-pressed={checked}
                      className={`flex flex-col items-center justify-center rounded-md border px-1 py-1.5 text-xs font-medium transition-colors ${palette}`}
                      title={`${formatDateLabel(d)}${
                        isExistingOther
                          ? " · already a holiday (will be overwritten)"
                          : ""
                      }`}
                    >
                      <span className="text-sm font-bold leading-none">{d.day}</span>
                      <span className="mt-0.5 text-[9px] uppercase tracking-wider opacity-75">
                        {d.weekdayShort}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <footer className="sticky bottom-0 flex flex-wrap items-center justify-between gap-2 border-t border-border bg-white px-4 py-3 sm:px-6">
          {isEdit ? (
            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <IconTrash className="h-4 w-4" />
              Remove
            </button>
          ) : (
            <span />
          )}

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-text-muted transition-colors hover:bg-surface-muted hover:text-text"
            >
              Cancel
            </button>
            <Button size="sm" onClick={handleSave} disabled={dateISOs.length === 0}>
              {isEdit ? "Save" : "Mark holiday"}
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}
