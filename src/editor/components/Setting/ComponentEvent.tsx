import { Collapse, CollapseProps, Select } from "antd";
import { useComponentsStore } from "@/editor/store/components";
import { useComponentConfigStore } from "@/editor/store/component-config";
import GotoLink from "./actions/GotoLink";
import ShowTip from "./actions/ShowTip";
import { ActionEnum } from "./common";

export default function ComponentEvent() {
  const { currentComponent, updateComponentProps } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  const selectAction = (eventName: string, type: string) => {
    if (!currentComponent) return;
    updateComponentProps(currentComponent.id, { [eventName]: { type } });
  };

  const items: CollapseProps["items"] = (
    componentConfig[currentComponent!.name].events ?? []
  )?.map((event) => {
    return {
      key: event.name,
      label: event.label,
      children: (
        <div className="flex flex-col gap-[10px]">
          <div className="flex items-center">
            <div>动作：</div>
            <Select
              className="flex-1"
              options={[
                { label: "显示提示", value: ActionEnum.showTip },
                { label: "跳转链接", value: ActionEnum.gotoLink },
              ]}
              placeholder="选择事件"
              onChange={(value) => selectAction(event.name, value)}
              value={currentComponent!.props[event.name]?.type}
            />
          </div>
          {currentComponent?.props[event.name]?.type ===
            ActionEnum.gotoLink && <GotoLink event={event} />}
          {currentComponent?.props[event.name]?.type === ActionEnum.showTip && (
            <ShowTip event={event} />
          )}
        </div>
      ),
    };
  });

  if (!currentComponent) return null;
  return (
    <div className="p-[10px]">
      <Collapse items={items} />
    </div>
  );
}
