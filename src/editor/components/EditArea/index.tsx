import { createElement, ReactNode } from "react";
import { useComponetsStore, Component } from "../../store/components";
import { useComponentConfigStore } from "../../store/component-config";

export default function EditArea() {
  const { componentConfig } = useComponentConfigStore();
  const { components } = useComponetsStore();
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

  return <div className="h-[100%]">{renderComponents(components)}</div>;
}
