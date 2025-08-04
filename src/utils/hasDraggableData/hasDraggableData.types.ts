import type { Active, Over } from "@dnd-kit/core";

import type { ColumnDragData } from "@/components/BoardColumn";
import type { TaskDragData } from "@/components/TaskCard";

export type DraggableData = ColumnDragData | TaskDragData;

export type ValidEntry = (Active | Over) & {
  data: {
    current: DraggableData;
  };
};
