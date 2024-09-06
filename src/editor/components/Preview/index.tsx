import { Drawer } from "antd";
import { Component, useComponentsStore } from "@/editor/store/components";
import { useComponentConfigStore } from "@/editor/store/component-config";
import React, { createElement } from "react";

export default function Preview() {
  const { showPreview, setShowPreview, components } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  const renderComponents = (components: Component[]): React.ReactNode => {
    return components.map((component) => {
      const config = componentConfig[component.name];
      if (!config?.name || !config.prd) return null;

      return createElement(
        config.prd,
        {
          key: component.id,
          id: component.id,
          style: component.style,
          ...config.defaultProps,
          ...component.props,
        },
        renderComponents(component.children || [])
      );
    });
  };

  return (
    <Drawer
      title="预览"
      placement="bottom"
      closable={false}
      onClose={() => setShowPreview(false)}
      open={showPreview}
      height="90%"
      destroyOnClose
    >
      {renderComponents(components)}
    </Drawer>
  );
}
