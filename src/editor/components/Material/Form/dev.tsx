import { CommonComponentProps } from "../../../interface";
import useMaterialDrop from "../../../hooks/useMaterialDrop";
import { useDrag } from "react-dnd";
import React, { useEffect, useRef } from "react";
import { Form as AntdForm } from "antd";

const accept = ["FormItem"];

export default function Table({
  children,
  id,
  style,
  name,
  onFinish,
  ...props
}: CommonComponentProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [form] = AntdForm.useForm();
  const { canDrop, drop } = useMaterialDrop(accept, id);

  const [_, drag] = useDrag({
    type: name,
    item: { type: name, id, dragType: "move" },
  });

  console.log("columns", children);

  useEffect(() => {
    drop(divRef);
    drag(divRef);
  }, []);

  return (
    <div
      ref={divRef}
      data-type={name}
      data-component-id={id}
      className={`w-[100%] ${
        canDrop ? "border-[2px] border-[blue]" : "border-[1px] border-[#000]"
      }`}
      style={style}
    >
      <AntdForm form={form} onFinish={onFinish}></AntdForm>
    </div>
  );
}
