import { CommonComponentProps } from "../../../interface";
import useMaterialDrop from "../../../hooks/useMaterialDrop";

export default function Page({ children, id, style }: CommonComponentProps) {
  const { canDrop, drop } = useMaterialDrop(["Container", "Button"], id);

  return (
    <div
      ref={drop}
      data-type="Page"
      data-component-id={id}
      className={`p-[20px] h-[100%] box-border border-[1px] border-solid border-[${
        canDrop ? "blue" : "#000"
      }]`}
      style={style}
    >
      {children}
    </div>
  );
}
