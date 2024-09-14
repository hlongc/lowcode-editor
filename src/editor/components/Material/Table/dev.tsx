import { CommonComponentProps } from "../../../interface";
import useMaterialDrop from "../../../hooks/useMaterialDrop";
import { useDrag } from "react-dnd";
import React, { useEffect, useRef } from "react";
import { Table as AntdTable } from "antd";
import { useCreation } from "ahooks";

const accept = ["TableColumn"];

export default function Table({
  children,
  id,
  style,
  title,
  name,
  rowKey,
  ...props
}: CommonComponentProps) {
  console.log("table props", props);
  const divRef = useRef<HTMLDivElement>(null);
  const { canDrop, drop } = useMaterialDrop(accept, id);

  const [_, drag] = useDrag({
    type: name,
    item: { type: name, id, dragType: "move" },
  });

  const columns = useCreation(() => {
    return React.Children.map(children, (child: any) => {
      console.log("child", child);
      return {
        title: (
          <div
            className="m-[-16px] p-[16px]"
            data-component-id={child.props?.id}
          >
            {child.props?.title}
          </div>
        ),
        dataIndex: child.props?.dataIndex,
      };
    });
  }, [children]);

  console.log("columns", columns);

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
      <AntdTable
        rowKey={rowKey}
        columns={columns}
        dataSource={[]}
        pagination={false}
      />
    </div>
  );
}
