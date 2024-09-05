import { Segmented } from "antd";
import Source from "../Source";
import Outline from "../Outline";
import Material from "../Material";
import { useState } from "react";

export default function MaterialWrapper() {
  const [key, setKey] = useState<string>("物料");

  return (
    <div className="h-[100%] flex flex-col">
      <Segmented<string>
        value={key}
        options={["物料", "大纲", "源码"]}
        onChange={(value) => setKey(value)}
        block
      />
      <div className="flex-1 box-border pt-[16px]">
        {key === "物料" && <Material />}
        {key === "大纲" && <Outline />}
        {key === "源码" && <Source />}
      </div>
    </div>
  );
}
