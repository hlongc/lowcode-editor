import { CommonComponentProps } from "../../../interface";
import useMaterialDrop from "../../../hooks/useMaterialDrop";

export default function Container({
  children,
  id,
  style,
}: CommonComponentProps) {
  const { canDrop, drop } = useMaterialDrop(["Container", "Button"], id);

  return (
    <div
      ref={drop}
      data-type="Container"
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
