import { PropsWithChildren } from "react";

import { useDndContext } from "@dnd-kit/core";
import { cva } from "class-variance-authority";

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
    <div
      className={variations({
        dragging: dndContext.active ? "active" : "default",
      })}
    >
      <div className="flex flex-row items-start justify-center gap-4">{children}</div>
    </div>
  );
};
