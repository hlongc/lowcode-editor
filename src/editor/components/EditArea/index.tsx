import { createElement, ReactNode, useState } from "react";
import { useComponetsStore, Component } from "@/editor/store/components";
import { useComponentConfigStore } from "@/editor/store/component-config";
import HoverMask from "../HoverMask";

export default function EditArea() {
  const { componentConfig } = useComponentConfigStore();
  const { components } = useComponetsStore();
  const [hoverComponentId, setHoverComponentId] = useState<number>();
  console.log("components", components);

  const renderComponents = (components: Component[]): ReactNode => {
    return components.map((component) => {
      // 从已注册的组件中拿到组件信息
      const config = componentConfig[component.name];
      if (!config?.name) return null;

      return createElement(
        config.component,
        {
          key: component.id,
          id: component.id,
          ...config.defaultProps,
          ...component.props,
        },
        renderComponents(component.children || [])
      );
    });
  };

  const onMouseOver = (e: React.MouseEvent) => {
    const path = e.nativeEvent.composedPath();
    for (let i = 0; i < path.length; i++) {
      const el = path[i] as HTMLElement;
      const componentId = el.dataset?.componentId;
      if (componentId) {
        setHoverComponentId(+componentId);
        break;
      }
    }
  };

  const onMouseLeave = () => {
    setHoverComponentId(undefined);
  };

  return (
    <div
      className="h-[100%] edit-area"
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
    >
      {renderComponents(components)}
      <div className="mask-container"></div>
      {hoverComponentId && (
        <HoverMask
          componentId={hoverComponentId}
          containerClassName="edit-area"
          wrapperClassName="mask-container"
        />
      )}
    </div>
  );
}
