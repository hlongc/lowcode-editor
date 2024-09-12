import { Select, TreeSelect } from "antd";
import { ActionEnum, ComponentMethodConfig } from "../common";
import {
  useComponentsStore,
  getComponentById,
  Component,
} from "@/editor/store/components";
import { useComponentConfigStore } from "@/editor/store/component-config";
import { useCreation } from "ahooks";
import { cloneDeep } from "lodash-es";

export interface ShowTipProps {
  value?: ComponentMethodConfig;
  onChange?: (data: ComponentMethodConfig) => void;
}

export default function Reaction(props: ShowTipProps) {
  const { value, onChange } = props;
  const { components } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  const treeData = useCreation(() => {
    const clone = cloneDeep(components[0]?.children ?? []);

    const run = (data: Component[]) => {
      data.forEach((item) => {
        const component = getComponentById(item.id, components);
        if (!component) return;
        const config = componentConfig[component.name];
        // 没有配置事件的不能选择
        (item as any).disabled = !config?.methods?.length;
        (item as any).selectable = !!config?.methods?.length;

        run(item?.children ?? []);
      });
    };

    run(clone);

    return clone;
  }, [components]);

  const options = useCreation(() => {
    if (!value?.componentId) return [];
    const component = getComponentById(value.componentId, components);
    if (!component) return [];

    return (
      componentConfig[component.name]?.methods?.map((event) => ({
        label: event.label,
        value: event.name,
      })) ?? []
    );
  }, [components, value?.componentId]);

  return (
    <div className="flex flex-col gap-[10px]">
      <div className="flex items-center">
        <div>组件：</div>
        <TreeSelect
          showSearch
          style={{ flex: 1 }}
          value={value?.componentId}
          dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
          placeholder="请选择组件"
          allowClear
          onChange={(componentId) =>
            onChange?.({
              componentId,
              method: value?.method,
              type: ActionEnum.reaction,
            })
          }
          treeData={treeData}
          fieldNames={{ label: "desc", value: "id", children: "children" }}
        />
      </div>
      <div className="flex items-center">
        <div>方法：</div>
        <Select
          options={options}
          style={{ flex: 1 }}
          placeholder="请选择方法"
          value={value?.method}
          onChange={(val) => {
            onChange?.({
              componentId: value?.componentId,
              method: val,
              type: ActionEnum.reaction,
            });
          }}
        />
      </div>
    </div>
  );
}
