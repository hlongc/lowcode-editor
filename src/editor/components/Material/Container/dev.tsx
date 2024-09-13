import { useEffect, useRef } from "react";
import { useDrag } from "react-dnd";
import { CommonComponentProps } from "@/editor/interface";
import useMaterialDrop, { DragTypeEnum } from "@/editor/hooks/useMaterialDrop";

const accept = ["Container", "Button"];

export default function Container({
  children,
  id,
  name,
  style,
}: CommonComponentProps) {
  const { canDrop, drop } = useMaterialDrop(accept, id);
  const divRef = useRef<HTMLDivElement>(null);

  const [_, drag] = useDrag({
    type: name,
    item: { type: name, id, dragType: DragTypeEnum.move },
  });

  useEffect(() => {
    drop(divRef);
    drag(divRef);
  }, []);

  return (
    <div
      ref={divRef}
      data-type={name}
      data-component-id={id}
      className={`min-h-[100px] p-[20px] border-[1px] border-solid border-[${
        canDrop ? "blue" : "#000"
      }]`}
      style={style}
    >
      {children}
    </div>
  );
}
