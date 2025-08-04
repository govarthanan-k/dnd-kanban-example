import { DragOverlay } from "@dnd-kit/core";
import { createPortal } from "react-dom";

import { BoardColumn } from "@/components/BoardColumn";
import { TaskCard } from "@/components/TaskCard";

import type { CustomDragOverlayProps } from "./CustomDragOverlay.types";

/**
 * Renders a custom drag overlay for the Kanban board.
 * Displays a floating preview of the column or task currently being dragged.
 *
 * @param {CustomDragOverlayProps} props - The props for the drag overlay, including the active column, active task, and all tasks.
 * @returns {JSX.Element | null} The drag overlay portal, or null if not on the client.
 */
export const CustomDragOverlay = (props: CustomDragOverlayProps) => {
  const { activeColumn, activeTask, tasks } = props;
  // Only render portal on the client
  if (typeof window === "undefined") {
    return null;
  }

  return createPortal(
    <DragOverlay>
      {/* Show floating column when dragging a column */}
      {activeColumn && (
        <BoardColumn isOverlay column={activeColumn} tasks={tasks.filter((task) => task.columnId === activeColumn.id)} />
      )}
      {/* Show floating task when dragging a task */}
      {activeTask && <TaskCard task={activeTask} isOverlay />}
    </DragOverlay>,
    document.body
  );
};
