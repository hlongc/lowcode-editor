import { createElement, ReactNode, useState } from "react";
import { useComponentsStore, Component } from "@/editor/store/components";
import { useComponentConfigStore } from "@/editor/store/component-config";
import HoverMask from "../HoverMask";
import ClickMask from "../ClickMask";

const hoverMaskClassName = "hover-mask-container";
const clickMaskClassName = "click-mask-container";

export default function EditArea() {
  const { componentConfig } = useComponentConfigStore();
  const { components, setCurrentComponentId, currentComponentId } =
    useComponentsStore();
  const [hoverComponentId, setHoverComponentId] = useState<number>();

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

  const onClick = (e: React.MouseEvent) => {
    const path = e.nativeEvent.composedPath();
    for (let i = 0; i < path.length; i++) {
      const el = path[i] as HTMLElement;
      const componentId = el.dataset?.componentId;
      if (componentId) {
        setCurrentComponentId(+componentId);
        break;
      }
    }
  };

  return (
    <div
      className="h-[100%] edit-area"
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {renderComponents(components)}
      <div className={hoverMaskClassName}></div>
      <div className={clickMaskClassName}></div>
      {/* 避免hover的和click的同时出现 */}
      {hoverComponentId && hoverComponentId !== currentComponentId && (
        <HoverMask
          componentId={hoverComponentId}
          containerClassName="edit-area"
          wrapperClassName={hoverMaskClassName}
        />
      )}
      {currentComponentId && (
        <ClickMask
          containerClassName="edit-area"
          wrapperClassName={clickMaskClassName}
        />
      )}
    </div>
  );
}
