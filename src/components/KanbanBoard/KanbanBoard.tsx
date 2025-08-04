import { useMemo, useState } from "react";

import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";

import { BoardColumn } from "@/components/BoardColumn";
import type { Column } from "@/components/BoardColumn";
import { CustomDragOverlay } from "@/components/CustomDragOverlay";
import { type Task } from "@/components/TaskCard";

import { hasDraggableData } from "@/utils/hasDraggableData";
import { moveBeforeIndex } from "@/utils/moveBeforeIndex";
import type { ColumnId } from "@/constants";
import { DEFAULT_COLUMNS, INITIAL_TASKS } from "@/constants";

export const KanbanBoard = () => {
  // Columns state
  const [columns, setColumns] = useState<Column[]>(DEFAULT_COLUMNS);
  const columnIds = useMemo(() => columns.map((col) => col.id), [columns]);

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  // Active drag state
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // DnD-kit sensors (mouse + touch)
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  /**
   * Handles the start of a drag event in the Kanban board.
   * Sets the active column or task based on the type of item being dragged.
   *
   * @param {DragStartEvent} event - The drag start event from dnd-kit.
   */
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    // Ensure the dragged item has valid draggable data
    if (!hasDraggableData(active)) {
      console.error(`There is no draggable data for ${active.id}`);
      return;
    }

    const { type, column, task } = active.data.current;

    // Set state based on what type of item is being dragged
    if (type === "Column") {
      setActiveColumn(column);
    } else if (type === "Task") {
      setActiveTask(task);
    }
  };

  /**
   * Handles the drag over event in the Kanban board.
   * Determines the appropriate action when a draggable item is dragged over another item or column.
   *
   * @param {DragOverEvent} event - The drag over event from dnd-kit.
   */
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    // Exit early if there's no "over" target, or the dragged item is over itself,
    // or if either active or over item lacks valid draggable data
    if (!over || active.id === over.id || !hasDraggableData(active) || !hasDraggableData(over)) {
      return;
    }

    const activeData = active.data.current;
    const overData = over.data.current;

    // Only proceed if the active (dragged) item is a Task
    if (activeData.type !== "Task") {
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    // 🧩 Case 1: Dropping a Task over another Task
    if (overData.type === "Task") {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
        const activeTask = tasks[activeIndex];
        const overTask = tasks[overIndex];

        // If either task is missing (shouldn't happen, but safe to check), do nothing
        if (!activeTask || !overTask) {
          return tasks;
        }

        // If moving across columns, update the active task's column
        if (activeTask.columnId !== overTask.columnId) {
          activeTask.columnId = overTask.columnId;

          // Move the task to the new column just before the target task
          return moveBeforeIndex(tasks, activeIndex, overIndex);
        }

        // Reordering within the same column
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    // 🧩 Case 2: Dropping a Task over a Column (not over a specific task)
    if (overData.type === "Column") {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const activeTask = tasks[activeIndex];

        // If the task is missing (shouldn't happen), do nothing
        if (!activeTask) {
          return tasks;
        }

        // Update the task's column to the new column
        activeTask.columnId = overId as ColumnId;

        // No reordering needed — just force a rerender by returning the same array
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  };

  /**
   * Handles the end of a drag-and-drop interaction.
   * Responsible for resetting drag state and reordering columns if a column was moved.
   *
   * @param {DragEndEvent} event - The drag end event from dnd-kit.
   */
  const handleDragEnd = (event: DragEndEvent) => {
    // Reset any temporarily active drag state
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;

    // No drop target, exit early
    if (!over) {
      return;
    }

    // Prevent processing if item has no draggable data
    if (!hasDraggableData(active)) {
      return;
    }

    const {
      id: activeId,
      data: { current: activeData },
    } = active;
    const overId = over.id;

    // No need to update if dropped on itself
    if (activeId === overId) {
      return;
    }

    // Only handle column reordering here
    if (activeData.type !== "Column") {
      return;
    }

    setColumns((columns) => {
      const fromIndex = columns.findIndex((col) => col.id === activeId);
      const toIndex = columns.findIndex((col) => col.id === overId);
      // Reorder the columns array by moving the dragged column from its original index to the target index
      return arrayMove(columns, fromIndex, toIndex);
    });
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      {/* Main board layout */}
      <div className="flex flex-row items-start justify-center gap-4 px-2 pb-4 md:px-0 lg:justify-center">
        {/* SortableContext enables drag-and-drop sorting of columns using their IDs */}
        <SortableContext items={columnIds}>
          {columns.map((col) => (
            <BoardColumn key={col.id} column={col} tasks={tasks.filter((task) => task.columnId === col.id)} />
          ))}
        </SortableContext>
      </div>

      {/* DragOverlay renders a floating preview of the dragged item */}
      <CustomDragOverlay activeColumn={activeColumn} activeTask={activeTask} tasks={tasks} />
    </DndContext>
  );
};
