import { Input, Select, TreeSelect } from "antd";
import { ActionEnum, ComponentMethodConfig } from "../common";
import { useComponentsStore } from "@/editor/store/components";
import { useComponentConfigStore } from "@/editor/store/component-config";

export interface ShowTipProps {
  value?: ComponentMethodConfig;
  onChange?: (data: ComponentMethodConfig) => void;
}

export default function Reaction(props: ShowTipProps) {
  const { value, onChange } = props;

  return (
    <div className="flex flex-col gap-[10px]">
      <div className="flex items-center">
        <div>类型：</div>
        <TreeSelect
          showSearch
          style={{ width: "100%" }}
          value={value}
          dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
          placeholder="Please select"
          allowClear
          treeDefaultExpandAll
          onChange={onChange}
          treeData={treeData}
          onPopupScroll={onPopupScroll}
        />
      </div>
      <div className="flex items-center">
        <div>文案：</div>
        <Input
          className="flex-1"
          placeholder="请输入提示文案"
          onChange={(e) =>
            onChange?.({
              messageType: value?.messageType,
              text: e.target.value,
              type: ActionEnum.showTip,
            })
          }
          value={value?.text}
        />
      </div>
    </div>
  );
}
