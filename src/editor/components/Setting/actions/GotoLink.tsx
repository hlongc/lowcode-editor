import { Input } from "antd";
import { ActionEnum, GotoLinkConfig } from "../common";

export interface GotoLinkProps {
  value?: GotoLinkConfig;
  onChange?: (data: GotoLinkConfig) => void;
}

export default function GotoLink(props: GotoLinkProps) {
  const { value, onChange } = props;

  return (
    <div className="flex items-center">
      <div>链接：</div>
      <Input
        className="flex-1"
        placeholder="请输入url链接"
        onChange={(e) =>
          onChange?.({
            url: e.target.value,
            type: ActionEnum.gotoLink,
          })
        }
        value={value?.url}
      />
    </div>
  );
}
