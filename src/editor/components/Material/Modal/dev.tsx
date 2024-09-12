import { CommonComponentProps } from "../../../interface";
import useMaterialDrop from "../../../hooks/useMaterialDrop";

const accept = ["Container", "Button"];

export default function Modal({
  children,
  id,
  style,
  title,
}: CommonComponentProps) {
  const { canDrop, drop } = useMaterialDrop(accept, id);

  return (
    <div
      ref={drop}
      data-type="Modal"
      data-component-id={id}
      className={`min-h-[100px] p-[20px] border-[1px] border-solid border-[${
        canDrop ? "blue" : "#000"
      }]`}
      style={style}
    >
      <h4>{title}</h4>
      <div>{children}</div>
    </div>
  );
}
