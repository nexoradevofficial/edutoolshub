import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { IconTrash } from "../../../icons/ToolIcons";
import { textareaClass } from "../shared/FormField";

export default function SectionDragDrop({ sections, onChange, onRemove, onAdd }) {
  const sorted = [...sections].sort((a, b) => a.order - b.order);

  function handleDragEnd(result) {
    if (!result.destination) return;
    const items = [...sorted];
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    onChange(items.map((s, i) => ({ ...s, order: i })));
  }

  function updateSection(id, patch) {
    onChange(sections.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  return (
    <div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
              {sorted.map((section, index) => (
                <Draggable key={section.id} draggableId={section.id} index={index}>
                  {(dragProvided, snapshot) => (
                    <div
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      className={`rounded-xl border bg-surface p-4 transition-shadow ${
                        snapshot.isDragging
                          ? "border-primary shadow-lg shadow-primary/10"
                          : "border-border"
                      }`}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <span
                          {...dragProvided.dragHandleProps}
                          className="cursor-grab rounded-lg bg-surface-muted px-2 py-1 text-xs text-text-muted active:cursor-grabbing"
                          title="Drag to reorder"
                        >
                          ⋮⋮
                        </span>
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => updateSection(section.id, { title: e.target.value })}
                          className="flex-1 rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm font-semibold text-text focus:border-border focus:bg-surface-muted focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => onRemove(section.id)}
                          className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-red-50 hover:text-red-600"
                          title="Remove section"
                        >
                          <IconTrash className="h-4 w-4" />
                        </button>
                      </div>
                      <textarea
                        value={section.content}
                        onChange={(e) => updateSection(section.id, { content: e.target.value })}
                        placeholder={`Enter ${section.title.toLowerCase()}...`}
                        className={textareaClass}
                        rows={4}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <button
        type="button"
        onClick={onAdd}
        className="mt-3 w-full rounded-xl border-2 border-dashed border-border py-3 text-sm font-medium text-text-muted transition-colors hover:border-primary/40 hover:text-primary"
      >
        + Add Custom Section
      </button>
    </div>
  );
}
