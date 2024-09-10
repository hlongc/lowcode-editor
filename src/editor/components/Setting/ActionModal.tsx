import { Segmented, Modal } from "antd";
import { useEffect, useState } from "react";
import GotoLink from "./actions/GotoLink";
import ShowTip from "./actions/ShowTip";
import { ComponentEvent } from "@/editor/store/component-config";
import { Component } from "@/editor/store/components";
import { ActionEnum, GotoLinkConfig, ShowTipConfig } from "./common";
import { useMemoizedFn } from "ahooks";

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

  const handleInit = useMemoizedFn(() => {
    if (!visible) {
      setKey("访问链接");
      setLinkValue(undefined);
      setTipValue(undefined);
    } else {
      setLinkValue(
        component.props[event?.name]?.actions?.find(
          (action: any) => action.type === ActionEnum.gotoLink
        )
      );
      setTipValue(
        component.props[event?.name]?.actions?.find(
          (action: any) => action.type === ActionEnum.showTip
        )
      );
    }
  });

  useEffect(() => {
    handleInit();
  }, [visible]);

  const [linkValue, setLinkValue] = useState<GotoLinkConfig | undefined>();

  const [tipValue, setTipValue] = useState<ShowTipConfig | undefined>();

  const onOk = () => {
    const actions = [];
    if (linkValue) {
      actions.push(linkValue);
    }
    if (tipValue) {
      actions.push(tipValue);
    }

    handleOk(actions);
  };

  return (
    <Modal
      title="事件绑定"
      width={900}
      open={visible}
      onCancel={handleClose}
      onOk={onOk}
      cancelText="取消"
      okText="确定"
    >
      <div className="flex flex-col">
        <Segmented<string>
          value={key}
          options={["访问链接", "消息提示", "自定义js"]}
          onChange={setKey}
          block
        />
      </div>
      <div className="p-[10px]">
        {key === "访问链接" && (
          <GotoLink value={linkValue} onChange={setLinkValue} />
        )}
        {key === "消息提示" && (
          <ShowTip value={tipValue} onChange={setTipValue} />
        )}
      </div>
    </Modal>
  );
}
