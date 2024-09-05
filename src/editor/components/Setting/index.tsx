import { Segmented } from "antd";
import { useComponentsStore } from "../../store/components";
import { useState } from "react";
import ComponentStyle from "./ComponentStyle";
import ComponentAttr from "./ComponentAttr";
import ComponentEvent from "./ComponentEvent";

export default function Setting() {
  const { components, currentComponentId } = useComponentsStore();

  const [key, setKey] = useState<string>("属性");

  if (!currentComponentId) return null;

  return (
    <div className="h-[100%] flex flex-col">
      <Segmented<string>
        value={key}
        options={["属性", "样式", "事件"]}
        onChange={(value) => setKey(value)}
        block
      />
      <div className="flex-1 box-border pt-[16px]">
        {key === "属性" && <ComponentAttr />}
        {key === "样式" && <ComponentStyle />}
        {key === "事件" && <ComponentEvent />}
      </div>
    </div>
  );
}
