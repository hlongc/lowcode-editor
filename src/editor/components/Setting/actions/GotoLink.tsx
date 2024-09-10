import { Input } from "antd";
import { ActionEnum } from "../common";

export interface GotoLinkConfig {
  url: string;
}

export interface GotoLinkProps {
  value?: GotoLinkConfig;
  onChange?: (type: string, data: GotoLinkConfig) => void;
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
          onChange?.(ActionEnum.gotoLink, { url: e.target.value })
        }
        value={value?.url}
      />
    </div>
  );
}
