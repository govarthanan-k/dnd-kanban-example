import type { Column } from "@/components/BoardColumn";
import type { Task } from "@/components/TaskCard";

export interface CustomDragOverlayProps {
  activeColumn: Column | null;
  activeTask: Task | null;
  tasks: Task[];
}
