import type { Active, Over } from "@dnd-kit/core";

import type { ValidEntry } from "./hasDraggableData.types";

export const hasDraggableData = (entry: Active | Over | null | undefined): entry is ValidEntry =>
  !!entry && !!entry.data.current && (entry.data.current.type === "Column" || entry.data.current.type === "Task");
