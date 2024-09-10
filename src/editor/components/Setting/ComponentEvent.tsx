import { Button, Collapse, CollapseProps } from "antd";
import { useComponentsStore } from "@/editor/store/components";
import {
  useComponentConfigStore,
  ComponentEvent as EventType,
} from "@/editor/store/component-config";
import ActionModal from "./ActionModal";
import { useState } from "react";

export default function ComponentEvent() {
  const { currentComponent, updateComponentProps } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  const [open, setOpen] = useState(false);
  const [event, setEvent] = useState<EventType>();

  const items: CollapseProps["items"] = (
    componentConfig[currentComponent!.name].events ?? []
  )?.map((event) => {
    return {
      key: event.name,
      label: event.label,
      extra: (
        <Button
          type="primary"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setEvent(event);
            setOpen(true);
          }}
        >
          添加动作
        </Button>
      ),
    };
  });

  if (!currentComponent) return null;
  return (
    <div className="p-[10px]">
      <Collapse items={items} />
      <ActionModal
        visible={open}
        handleClose={() => setOpen(false)}
        handleOk={(data) => {
          updateComponentProps(currentComponent.id, {
            [event!.name]: {
              ...(currentComponent.props[event!.name].action ?? []),
              ...data,
            },
          });
        }}
        event={event!}
        component={currentComponent}
      />
    </div>
  );
}
