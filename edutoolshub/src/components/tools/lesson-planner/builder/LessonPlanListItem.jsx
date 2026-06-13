import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Button from "../../../ui/Button";
import { IconPrint, IconTrash } from "../../../icons/ToolIcons";
import LessonPlanPrintView from "./LessonPlanPrintView";

export default function LessonPlanListItem({ plan, onEdit, onDuplicate, onDelete }) {
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: plan.title,
  });

  function handleDelete() {
    if (confirm(`Delete "${plan.title}"?`)) {
      onDelete(plan.id);
    }
  }

  return (
    <>
      <div
        ref={printRef}
        className="pointer-events-none fixed -left-[9999px] top-0 w-[800px] print:static print:left-auto print:w-auto"
        aria-hidden
      >
        <LessonPlanPrintView plan={plan} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-text">{plan.title}</p>
          <p className="mt-0.5 text-xs text-text-muted">
            {plan.subject} · Grade {plan.grade} · {plan.duration} min
            {plan.className && ` · ${plan.className}`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={() => onEdit(plan.id)}>
            Edit
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onDuplicate(plan.id)}>
            Duplicate
          </Button>
          <Button size="sm" variant="ghost" onClick={handlePrint} title="Print this plan">
            <IconPrint className="h-4 w-4" />
            Print
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700"
            title="Delete this plan"
          >
            <IconTrash className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
    </>
  );
}
