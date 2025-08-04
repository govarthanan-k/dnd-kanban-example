import { UniqueIdentifier } from "@dnd-kit/core";

import { ColumnId } from "@/constants";

export interface Task {
  id: UniqueIdentifier;
  columnId: ColumnId;
  content: string;
}

export interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
}

export type TaskType = "Task";

export interface TaskDragData {
  type: TaskType;
  task: Task;
}
