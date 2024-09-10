import { Input, Select } from "antd";
import { ActionEnum, ShowTipConfig } from "../common";

export interface ShowTipProps {
  value?: ShowTipConfig;
  onChange?: (data: ShowTipConfig) => void;
}

export default function ShowTip(props: ShowTipProps) {
  const { value, onChange } = props;

  return (
    <div className="flex flex-col gap-[10px]">
      <div className="flex items-center">
        <div>类型：</div>
        <Select
          options={[
            { label: "成功", value: "success" },
            { label: "错误", value: "error" },
          ]}
          className="flex-1"
          placeholder="请选择提示类型"
          onChange={(val) =>
            onChange?.({
              messageType: val,
              text: value?.text,
              type: ActionEnum.showTip,
            })
          }
          value={value?.messageType}
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
