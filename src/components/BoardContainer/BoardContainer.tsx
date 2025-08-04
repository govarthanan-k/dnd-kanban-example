import { PropsWithChildren } from "react";

import { useDndContext } from "@dnd-kit/core";
import { cva } from "class-variance-authority";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export const BoardContainer = (props: PropsWithChildren) => {
  const { children } = props;
  const dndContext = useDndContext();

  const variations = cva("px-2 md:px-0 flex lg:justify-center pb-4", {
    variants: {
      dragging: {
        default: "snap-x snap-mandatory",
        active: "snap-none",
      },
    },
  });

  return (
    <ScrollArea
      className={variations({
        dragging: dndContext.active ? "active" : "default",
      })}
    >
      <div className="flex flex-row items-center justify-center gap-4">{children}</div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
