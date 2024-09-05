import { Tree } from "antd";
import {
  useComponentsStore,
  getComponentById,
  Component,
} from "@/editor/store/components";
import { useState } from "react";

export default function Outline() {
  const {
    components,
    setCurrentComponentId,
    currentComponentId,
    currentComponent,
    setHoverComponentId,
  } = useComponentsStore();

  const [expandedKeys, setExpandedKeys] = useState<number[]>(() => {
    if (currentComponent) {
      let target: Component | undefined = currentComponent;
      const ret = [];
      while (target && target.parentId) {
        ret.push(target.parentId);

        target = getComponentById(target.parentId, components);
      }
      return ret;
    }
    return [];
  });

  return (
    <Tree
      showLine={{ showLeafIcon: false }}
      showIcon={false}
      expandedKeys={expandedKeys}
      onExpand={(keys) => setExpandedKeys(keys as number[])}
      selectedKeys={
        currentComponentId !== undefined ? [currentComponentId] : []
      }
      onSelect={([id]) => setCurrentComponentId(id as number)}
      onMouseEnter={(info) => setHoverComponentId(info.node.key as number)}
      onMouseLeave={() => setHoverComponentId(undefined)}
      treeData={components}
      fieldNames={{ title: "desc", children: "children", key: "id" }}
    />
  );
}
