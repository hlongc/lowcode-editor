import { CommonComponentProps } from "../../../interface";
import useMaterialDrop from "../../../hooks/useMaterialDrop";

export default function Container({ children, id }: CommonComponentProps) {
  const { canDrop, drop } = useMaterialDrop(["Container", "Button"], id);

  return (
    <div
      ref={drop}
      data-type="Container"
      data-component-id={id}
      className="min-h-[100px] p-[20px]"
      style={{
        border: canDrop ? "1px solid blue" : "1px solid #000",
      }}
    >
      {children}
    </div>
  );
}
