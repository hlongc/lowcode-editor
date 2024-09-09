import { ComponentEvent } from "@/editor/store/component-config";
import { useComponentsStore } from "@/editor/store/components";
import { Input, Select } from "antd";

export default function ShowTip(props: { event: ComponentEvent }) {
  const { event } = props;
  const { currentComponent, updateComponentProps } = useComponentsStore();

  const updateTipType = (eventName: string, messageType: string) => {
    if (!currentComponent) return;
    updateComponentProps(currentComponent.id, {
      [eventName]: {
        ...currentComponent.props[eventName],
        messageType,
      },
    });
  };

  const updateText = (eventName: string, text: string) => {
    if (!currentComponent) return;
    updateComponentProps(currentComponent.id, {
      [eventName]: {
        ...currentComponent.props[eventName],
        text,
      },
    });
  };

  return (
    <div className="flex flex-col gap-[10px]">
      <div className="flex items-center">
        <div>提示信息类型：</div>
        <Select
          options={[
            { label: "成功", value: "success" },
            { label: "错误", value: "error" },
          ]}
          className="flex-1"
          placeholder="请选择提示类型"
          onChange={(value) => updateTipType(event.name, value)}
          value={currentComponent?.props[event.name]?.messageType}
        />
      </div>
      <div className="flex items-center">
        <div>提示文案：</div>
        <Input
          className="flex-1"
          placeholder="请输入提示文案"
          onChange={(e) => updateText(event.name, e.target.value)}
          value={currentComponent?.props[event.name]?.text}
        />
      </div>
    </div>
  );
}
