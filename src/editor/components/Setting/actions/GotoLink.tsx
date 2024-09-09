import { ComponentEvent } from "@/editor/store/component-config";
import { useComponentsStore } from "@/editor/store/components";
import { Input } from "antd";

export default function GotoLink(props: { event: ComponentEvent }) {
  const { event } = props;
  const { currentComponent, updateComponentProps } = useComponentsStore();

  const updateUrl = (eventName: string, url: string) => {
    if (!currentComponent) return;
    updateComponentProps(currentComponent.id, {
      [eventName]: {
        ...currentComponent.props[eventName],
        url,
      },
    });
  };

  return (
    <div className="flex items-center">
      <div>链接：</div>
      <Input
        className="flex-1"
        placeholder="请输入url链接"
        onChange={(e) => updateUrl(event.name, e.target.value)}
        value={currentComponent?.props[event.name].url}
      />
    </div>
  );
}
