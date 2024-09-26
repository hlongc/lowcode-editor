import { CommonComponentProps } from "../../../interface";
import useMaterialDrop from "../../../hooks/useMaterialDrop";
import { useDrag } from "react-dnd";
import React, { ReactNode, useEffect, useRef } from "react";
import { Form as AntdForm, Form, Input } from "antd";
import { useCreation } from "ahooks";

const accept = ["FormItem"];

export default function Table({
  children,
  id,
  style,
  name,
  onFinish,
  layout,
  ...props
}: CommonComponentProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [form] = AntdForm.useForm();
  const { canDrop, drop } = useMaterialDrop(accept, id);

  const [_, drag] = useDrag({
    type: name,
    item: { type: name, id, dragType: "move" },
  });

  const FormItems = useCreation(() => {
    return React.Children.map(children, (child: any) => {
      const { type, id, label, name, ...props } = child.props ?? {};
      let el: ReactNode = null;
      const realName = name ?? `field-${type}-${id}`;
      if (type === "input") {
        el = <Input className="pointer-events-none" />;
      }
      return (
        <div data-component-id={id} onClickCapture={(e) => e.preventDefault()}>
          <Form.Item name={realName} label={label} {...props}>
            {el}
          </Form.Item>
        </div>
      );
    });
  }, [children]);

  useEffect(() => {
    drop(divRef);
    drag(divRef);
  }, []);

  return (
    <div
      ref={divRef}
      data-type={name}
      data-component-id={id}
      className={`w-[100%] p-[16px] ${
        canDrop ? "border-[2px] border-[blue]" : "border-[1px] border-[#000]"
      }`}
      style={style}
    >
      <AntdForm form={form} onFinish={onFinish} layout={layout}>
        {FormItems}
      </AntdForm>
    </div>
  );
}
