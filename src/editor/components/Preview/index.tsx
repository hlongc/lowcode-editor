import { Drawer, message } from "antd";
import { Component, useComponentsStore } from "@/editor/store/components";
import { useComponentConfigStore } from "@/editor/store/component-config";
import React, { createElement } from "react";
import { ActionEnum, GotoLinkConfig, ShowTipConfig } from "../Setting/common";

export default function Preview() {
  const { showPreview, setShowPreview, components } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  const handleEvents = (component: Component) => {
    const props: Record<string, any> = {};

    componentConfig[component.name].events?.forEach((event) => {
      const eventConfig = component.props[event.name];
      if (eventConfig) {
        props[event.name] = () => {
          const actions = (eventConfig.actions ?? []) as (
            | GotoLinkConfig
            | ShowTipConfig
          )[];
          actions.forEach((action) => {
            const { type } = action;
            if (type === ActionEnum.gotoLink) {
              if (action.url) {
                window.open(action.url);
              }
            } else if (type === ActionEnum.showTip) {
              const { messageType, text } = action;
              const content = text ?? "提示信息";
              if (messageType === "success") {
                message.success(content);
              } else if (messageType === "error") {
                message.error(content);
              }
            }
          });
        };
      }
    });

    return props;
  };

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
          ...handleEvents(component),
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
