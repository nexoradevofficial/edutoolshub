import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  parseISO,
  startOfMonth,
  subMonths,
} from "date-fns";
import { getSubjectColor } from "../../../../utils/lessonPlanner/customOptions";
import { CLASS_COLORS } from "../../../../utils/lessonPlanner/constants";
import { getWeekDays } from "../../../../utils/lessonPlanner/export";

function getItemColor(plan, unit, colorMode) {
  if (colorMode === "class" && unit?.color) return unit.color;
  if (colorMode === "class" && plan?.className) {
    const hash = plan.className.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    return CLASS_COLORS[hash % CLASS_COLORS.length];
  }
  return getSubjectColor(plan?.subject);
}

function CalendarDayCell({ date, placements, lessonPlans, units, colorMode, onToggleStatus }) {
  const dayPlacements = placements.filter((p) => p.date === date);

  return (
    <Droppable droppableId={`day-${date}`}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`min-h-[80px] rounded-lg border p-1.5 transition-colors sm:min-h-[100px] ${
            snapshot.isDraggingOver ? "border-primary bg-primary/5" : "border-border bg-surface"
          }`}
        >
          <p className="mb-1 text-[10px] font-medium text-text-muted sm:text-xs">
            {format(parseISO(date), "EEE d")}
          </p>
          <div className="space-y-1">
            {dayPlacements.map((placement, index) => {
              const plan = lessonPlans.find((p) => p.id === placement.lessonPlanId);
              const unit = units.find((u) => u.id === placement.unitId);
              const color = getItemColor(plan, unit, colorMode);
              const taught = placement.status === "taught";

              return (
                <Draggable key={placement.id} draggableId={placement.id} index={index}>
                  {(dragProvided) => (
                    <div
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      {...dragProvided.dragHandleProps}
                      className="cursor-grab rounded-md px-1.5 py-1 text-[10px] font-medium text-white active:cursor-grabbing sm:text-xs"
                      style={{
                        backgroundColor: color,
                        opacity: taught ? 0.65 : 1,
                        textDecoration: taught ? "line-through" : "none",
                      }}
                      onClick={() => onToggleStatus(placement.id)}
                      title="Click to toggle planned/taught"
                    >
                      {plan?.title ?? "Lesson"}
                    </div>
                  )}
                </Draggable>
              );
            })}
          </div>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

export default function UnitCalendar({
  view,
  selectedDate,
  onDateChange,
  placements,
  lessonPlans,
  units,
  colorMode,
  onDragEnd,
  onToggleStatus,
  activeUnit,
}) {
  const dateStr = format(selectedDate, "yyyy-MM-dd");

  function handleDragEnd(result) {
    if (!result.destination) return;
    const destId = result.destination.droppableId;
    if (destId.startsWith("day-")) {
      const newDate = destId.replace("day-", "");
      onDragEnd(result.draggableId, newDate);
    } else if (destId === "lesson-pool" && result.source.droppableId.startsWith("day-")) {
      onDragEnd(result.draggableId, null);
    }
  }

  const unitPlacements = activeUnit
    ? placements.filter((p) => p.unitId === activeUnit.id)
    : placements;
  const taught = unitPlacements.filter((p) => p.status === "taught").length;
  const total = unitPlacements.length;
  const progress = total > 0 ? Math.round((taught / total) * 100) : 0;

  const unplacedPlans = lessonPlans.filter(
    (p) => !placements.some((pl) => pl.lessonPlanId === p.id)
  );

  if (view === "weekly") {
    const weekDays = getWeekDays(dateStr);
    return (
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-text-muted">
            Week of {format(parseISO(weekDays[0]), "MMM d")} — {format(parseISO(weekDays[6]), "MMM d, yyyy")}
          </p>
          {activeUnit && (
            <div className="flex items-center gap-2">
              <div className="h-2 w-24 overflow-hidden rounded-full bg-surface-muted">
                <div
                  className="h-full rounded-full bg-accent transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs font-medium text-text-muted">
                {taught}/{total} taught ({progress}%)
              </span>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {weekDays.map((day) => (
            <CalendarDayCell
              key={day}
              date={day}
              placements={placements}
              lessonPlans={lessonPlans}
              units={units}
              colorMode={colorMode}
              onToggleStatus={onToggleStatus}
            />
          ))}
        </div>
        <LessonPool plans={unplacedPlans} units={units} colorMode={colorMode} />
      </DragDropContext>
    );
  }

  if (view === "monthly") {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startPad = (monthStart.getDay() + 6) % 7;

    return (
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onDateChange(subMonths(selectedDate, 1))}
              className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-surface-muted"
            >
              ←
            </button>
            <p className="text-sm font-semibold text-text">
              {format(selectedDate, "MMMM yyyy")}
            </p>
            <button
              type="button"
              onClick={() => onDateChange(addMonths(selectedDate, 1))}
              className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-surface-muted"
            >
              →
            </button>
          </div>
          {activeUnit && (
            <span className="text-xs font-medium text-text-muted">
              {taught}/{total} taught ({progress}%)
            </span>
          )}
        </div>
        <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-medium text-text-muted">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startPad }).map((_, i) => (
            <div key={`pad-${i}`} className="min-h-[60px]" />
          ))}
          {days.map((day) => {
            const d = format(day, "yyyy-MM-dd");
            return (
              <CalendarDayCell
                key={d}
                date={d}
                placements={placements}
                lessonPlans={lessonPlans}
                units={units}
                colorMode={colorMode}
                onToggleStatus={onToggleStatus}
              />
            );
          })}
        </div>
        <LessonPool plans={unplacedPlans} units={units} colorMode={colorMode} />
      </DragDropContext>
    );
  }

  // Term view
  const termUnits = activeUnit ? [activeUnit] : units;
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="space-y-4">
        {termUnits.map((unit) => {
          if (!unit.startDate || !unit.endDate) return null;
          const unitPl = placements.filter((p) => p.unitId === unit.id);
          const unitTaught = unitPl.filter((p) => p.status === "taught").length;
          const unitProgress = unitPl.length > 0 ? Math.round((unitTaught / unitPl.length) * 100) : 0;

          return (
            <div key={unit.id} className="rounded-xl border border-border p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: unit.color }}
                  />
                  <h4 className="font-semibold text-text">{unit.name}</h4>
                  <span className="text-xs text-text-muted">
                    {unit.startDate} — {unit.endDate}
                  </span>
                </div>
                <span className="text-xs font-medium text-accent">
                  {unitTaught}/{unitPl.length} taught ({unitProgress}%)
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 lg:grid-cols-10">
                {eachDayOfInterval({
                  start: parseISO(unit.startDate),
                  end: parseISO(unit.endDate),
                })
                  .filter((_, i) => i % Math.max(1, Math.floor(
                    (parseISO(unit.endDate) - parseISO(unit.startDate)) / (1000 * 60 * 60 * 24) / 10
                  )) === 0 || i === 0)
                  .slice(0, 20)
                  .map((day) => {
                    const d = format(day, "yyyy-MM-dd");
                    const count = unitPl.filter((p) => p.date === d).length;
                    return (
                      <div
                        key={d}
                        className="rounded-lg border border-border bg-surface-muted/50 p-2 text-center"
                      >
                        <p className="text-[10px] text-text-muted">{format(day, "MMM d")}</p>
                        <p className="text-sm font-bold text-text">{count}</p>
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
      <LessonPool plans={unplacedPlans} units={units} colorMode={colorMode} />
    </DragDropContext>
  );
}

function LessonPool({ plans, units, colorMode }) {
  return (
    <div className="mt-4">
      <p className="mb-2 text-xs font-medium text-text-muted">Drag lessons onto the calendar</p>
      <Droppable droppableId="lesson-pool" direction="horizontal">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex flex-wrap gap-2 rounded-xl border border-dashed border-border bg-surface-muted/30 p-3"
          >
            {plans.length === 0 ? (
              <p className="text-xs text-text-muted">All lessons are placed on the calendar.</p>
            ) : (
              plans.map((plan, index) => {
                const unit = units.find((u) => u.id === plan.unitId);
                const color = getItemColor(plan, unit, colorMode);
                return (
                  <Draggable key={`pool-${plan.id}`} draggableId={`pool-${plan.id}`} index={index}>
                    {(dragProvided) => (
                      <div
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        {...dragProvided.dragHandleProps}
                        className="cursor-grab rounded-lg px-3 py-1.5 text-xs font-medium text-white"
                        style={{ backgroundColor: color }}
                      >
                        {plan.title}
                      </div>
                    )}
                  </Draggable>
                );
              })
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export function CalendarDatePicker({ selectedDate, onChange }) {
  return (
    <div className="lesson-planner-calendar">
      <Calendar
        onChange={onChange}
        value={selectedDate}
        className="w-full rounded-xl border border-border !bg-surface"
      />
    </div>
  );
}
