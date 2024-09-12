import { Drawer, message } from "antd";
import { Component, useComponentsStore } from "@/editor/store/components";
import { useComponentConfigStore } from "@/editor/store/component-config";
import React, { createElement, useRef } from "react";
import { ActionEnum, ActionConfig } from "../Setting/common";

export default function Preview() {
  const { showPreview, setShowPreview, components } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  const componentRef = useRef<Record<string, any>>({});

  const handleEvents = (component: Component) => {
    const props: Record<string, any> = {};

    componentConfig[component.name].events?.forEach((event) => {
      const eventConfig = component.props[event.name];
      if (eventConfig) {
        props[event.name] = () => {
          const actions = (eventConfig.actions ?? []) as ActionConfig[];
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
            } else if (type === ActionEnum.customJs) {
              if (action.code) {
                const fn = new Function("context", action.code);
                fn({
                  props: component.props,
                  showMessage: message,
                });
              }
            } else if (type === ActionEnum.reaction) {
              const { componentId, method } = action;
              if (componentId && method) {
                const ref = componentRef.current[componentId];
                ref?.[method]?.();
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
          ref: (ref: Record<string, any>) => {
            componentRef.current[component.id] = ref;
          },
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
