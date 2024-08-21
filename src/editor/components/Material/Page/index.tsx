import { CommonComponentProps } from "../../../interface";
import useMaterialDrop from "../../../hooks/useMaterialDrop";

export default function Page({ children, id }: CommonComponentProps) {
  const { canDrop, drop } = useMaterialDrop(["Container", "Button"], id);

  return (
    <div
      ref={drop}
      datatype="Page"
      className="p-[20px] h-[100%] box-border"
      style={{
        border: canDrop ? "1px solid blue" : "none",
      }}
    >
      {children}
    </div>
  );
}
