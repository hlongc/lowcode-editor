import { Segmented, Modal } from "antd";
import { useState } from "react";
import GotoLink, { GotoLinkConfig } from "./actions/GotoLink";
import ShowTip, { ShowTipConfig } from "./actions/ShowTip";
import { ComponentEvent } from "@/editor/store/component-config";
import { Component } from "@/editor/store/components";
import { ActionEnum } from "./common";

interface ActionModalProps {
  visible: boolean;
  handleClose: () => void;
  handleOk: (data: any) => void;
  event: ComponentEvent;
  component: Component;
}

export default function ActionModal({
  visible,
  handleClose,
  handleOk,
  event,
  component,
}: ActionModalProps) {
  const [key, setKey] = useState<string>("访问链接");

  const [linkValue, setLinkValue] = useState<GotoLinkConfig>(
    component.props[event?.name]?.actions?.find(
      (action: any) => action.type === ActionEnum.gotoLink
    )
  );

  const [tipValue, setTipValue] = useState<ShowTipConfig>(
    component.props[event?.name]?.actions?.find(
      (action: any) => action.type === ActionEnum.showTip
    )
  );

  const onOk = () => {
    const actions = [];
    if (linkValue) {
      actions.push({ ...linkValue, type: ActionEnum.gotoLink });
    }
    if (tipValue) {
      actions.push({ ...tipValue, type: ActionEnum.showTip });
    }

    handleOk(actions);
  };

  return (
    <Modal title="事件绑定" open={visible} onCancel={handleClose} onOk={onOk}>
      <div className="flex flex-col">
        <Segmented<string>
          value={key}
          options={["访问链接", "消息提示", "自定义js"]}
          onChange={setKey}
          block
        />
      </div>
      {key === "访问链接" && (
        <GotoLink
          value={linkValue}
          onChange={(type, data) => {
            setLinkValue(data);
          }}
        />
      )}
      {key === "消息提示" && (
        <ShowTip
          value={tipValue}
          onChange={(type, data) => {
            setTipValue(data);
          }}
        />
      )}
    </Modal>
  );
}
