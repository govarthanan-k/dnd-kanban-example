import type { UniqueIdentifier } from "@dnd-kit/core";

import type { Task } from "@/components/TaskCard";

export interface Column {
  id: UniqueIdentifier;
  title: string;
}

export type ColumnType = "Column";

export interface ColumnDragData {
  type: ColumnType;
  column: Column;
}

export interface BoardColumnProps {
  column: Column;
  tasks: Task[];
  isOverlay?: boolean;
}
