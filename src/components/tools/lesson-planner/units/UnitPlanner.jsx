import { useState } from "react";
import { format } from "date-fns";
import Button from "../../../ui/Button";
import { generateId } from "../../../../utils/lessonPlanner/storage";
import { useLessonPlanner } from "../LessonPlannerContext";
import PlannerCard from "../shared/PlannerCard";
import UnitForm from "./UnitForm";
import UnitCalendar, { CalendarDatePicker } from "./UnitCalendar";

export default function UnitPlanner() {
  const { lessonPlans, units, calendar, settings } = useLessonPlanner();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingUnit, setEditingUnit] = useState(null);
  const [showUnitForm, setShowUnitForm] = useState(false);
  const [activeUnitId, setActiveUnitId] = useState(null);

  const activeUnit = activeUnitId ? units.getById(activeUnitId) : null;
  const view = settings.calendarView ?? "weekly";

  function handleDragEnd(draggableId, newDate) {
    const isPool = draggableId.startsWith("pool-");
    const planId = isPool ? draggableId.replace("pool-", "") : null;
    const placementId = isPool ? null : draggableId;

    if (newDate === null && placementId) {
      calendar.removePlacement(placementId);
      return;
    }

    if (isPool && newDate) {
      const plan = lessonPlans.getById(planId);
      calendar.addPlacement({
        id: generateId(),
        lessonPlanId: planId,
        date: newDate,
        unitId: plan?.unitId ?? activeUnitId,
        status: "planned",
      });
      return;
    }

    if (placementId && newDate) {
      calendar.movePlacement(placementId, newDate);
    }
  }

  function toggleStatus(placementId) {
    const placement = calendar.placements.find((p) => p.id === placementId);
    if (!placement) return;
    calendar.updatePlacement(placementId, {
      status: placement.status === "taught" ? "planned" : "taught",
    });
  }

  const filteredPlacements = activeUnit
    ? calendar.placements.filter((p) => p.unitId === activeUnit.id)
    : calendar.placements;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="space-y-4">
          <PlannerCard title="Calendar">
            <CalendarDatePicker
              selectedDate={selectedDate}
              onChange={(d) => setSelectedDate(d)}
            />
          </PlannerCard>

          <PlannerCard
            title="View"
            actions={
              <div className="flex rounded-lg border border-border p-0.5">
                {["weekly", "monthly", "term"].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => settings.update({ calendarView: v })}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize ${
                      view === v ? "bg-primary text-white" : "text-text-muted"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            }
          >
            <label className="flex items-center justify-between text-sm">
              <span className="text-text-muted">Color by</span>
              <select
                value={settings.colorMode}
                onChange={(e) => settings.update({ colorMode: e.target.value })}
                className="rounded-lg border border-border px-2 py-1 text-sm"
              >
                <option value="subject">Subject</option>
                <option value="class">Class</option>
              </select>
            </label>
          </PlannerCard>
        </div>

        <PlannerCard
          title="Schedule"
          description={
            activeUnit
              ? `Viewing unit: ${activeUnit.name}`
              : `Week of ${format(selectedDate, "MMM d, yyyy")}`
          }
        >
          <UnitCalendar
            view={view}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            placements={filteredPlacements}
            lessonPlans={lessonPlans.list}
            units={units.list}
            colorMode={settings.colorMode}
            onDragEnd={handleDragEnd}
            onToggleStatus={toggleStatus}
            activeUnit={activeUnit}
          />
        </PlannerCard>
      </div>

      <PlannerCard
        title="Units"
        description="Create units and link lessons to track progress"
        actions={
          <Button
            size="sm"
            onClick={() => {
              setEditingUnit(null);
              setShowUnitForm(true);
            }}
          >
            New Unit
          </Button>
        }
      >
        {showUnitForm && (
          <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <UnitForm
              unit={editingUnit}
              onChange={setEditingUnit}
              onSubmit={(unit) => {
                units.save(unit);
                setShowUnitForm(false);
                setEditingUnit(null);
              }}
              onCancel={() => {
                setShowUnitForm(false);
                setEditingUnit(null);
              }}
            />
          </div>
        )}

        {units.list.length === 0 ? (
          <p className="py-4 text-center text-sm text-text-muted">
            No units yet. Create a unit to organize your lessons.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {units.list.map((unit) => {
              const unitPlacements = calendar.placements.filter((p) => p.unitId === unit.id);
              const taught = unitPlacements.filter((p) => p.status === "taught").length;
              const progress =
                unitPlacements.length > 0
                  ? Math.round((taught / unitPlacements.length) * 100)
                  : 0;
              const linkedLessons = lessonPlans.list.filter((p) => p.unitId === unit.id);

              return (
                <div
                  key={unit.id}
                  className={`rounded-xl border p-4 transition-all ${
                    activeUnitId === unit.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span
                      className="mt-1 h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: unit.color }}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-text">{unit.name}</p>
                      <p className="mt-0.5 text-xs text-text-muted">
                        {unit.subject} · Grade {unit.grade}
                        {unit.className && ` · ${unit.className}`}
                      </p>
                      <p className="mt-0.5 text-xs text-text-muted">
                        {unit.startDate} — {unit.endDate}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-muted">
                          <div
                            className="h-full rounded-full bg-accent"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-text-muted">{progress}%</span>
                      </div>
                      <p className="mt-1 text-[10px] text-text-muted">
                        {linkedLessons.length} lessons · {taught}/{unitPlacements.length} taught
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveUnitId(activeUnitId === unit.id ? null : unit.id)}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      {activeUnitId === unit.id ? "Show all" : "Focus"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingUnit(unit);
                        setShowUnitForm(true);
                      }}
                      className="text-xs font-medium text-text-muted hover:text-text"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Delete this unit?")) units.remove(unit.id);
                      }}
                      className="text-xs font-medium text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </PlannerCard>
    </div>
  );
}
