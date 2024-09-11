import { Segmented, Modal } from "antd";
import { useEffect, useState } from "react";
import GotoLink from "./actions/GotoLink";
import ShowTip from "./actions/ShowTip";
import CustomJS from "./actions/CustomJs";
import { ComponentEvent } from "@/editor/store/component-config";
import { Component } from "@/editor/store/components";
import {
  ActionEnum,
  GotoLinkConfig,
  ShowTipConfig,
  CustomJsConfig,
  ActionTypeEnum,
} from "./common";
import { useMemoizedFn } from "ahooks";

const tuple = <T extends string[]>(...args: T) => args;

const tabs = tuple(ActionTypeEnum.link, ActionTypeEnum.tip, ActionTypeEnum.js);
interface ActionModalProps {
  visible: boolean;
  handleClose: () => void;
  handleOk: (data: any) => void;
  event: ComponentEvent;
  component: Component;
  defaultTab?: (typeof tabs)[number];
}

export default function ActionModal({
  visible,
  handleClose,
  handleOk,
  event,
  component,
  defaultTab,
}: ActionModalProps) {
  const [key, setKey] = useState<string>();

  useEffect(() => {
    setKey(defaultTab ?? ActionTypeEnum.link);
  }, [defaultTab]);

  const getActionValue = useMemoizedFn((type: ActionEnum) => {
    return component.props[event?.name]?.actions?.find(
      (action: any) => action.type === type
    );
  });

  const handleInit = useMemoizedFn(() => {
    if (!visible) {
      setKey(ActionTypeEnum.link);
      setLinkValue(undefined);
      setTipValue(undefined);
      setCodeValue(undefined);
    } else {
      setLinkValue(getActionValue(ActionEnum.gotoLink));
      setTipValue(getActionValue(ActionEnum.showTip));
      setCodeValue(
        getActionValue(ActionEnum.customJs) ?? {
          type: ActionEnum.customJs,
          code: `
          // 编写你的代码 context属性包含 props和showMessage方法
        `,
        }
      );
    }
  });

  useEffect(() => {
    handleInit();
  }, [visible]);

  const [linkValue, setLinkValue] = useState<GotoLinkConfig | undefined>();
  const [tipValue, setTipValue] = useState<ShowTipConfig | undefined>();
  const [codeValue, setCodeValue] = useState<CustomJsConfig | undefined>();

  const onOk = () => {
    const actions = [];
    if (linkValue) {
      actions.push(linkValue);
    }
    if (tipValue) {
      actions.push(tipValue);
    }
    if (codeValue) {
      actions.push(codeValue);
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
        <Segmented<string> value={key} options={tabs} onChange={setKey} block />
      </div>
      <div className="p-[10px] min-h-[400px]">
        {key === ActionTypeEnum.link && (
          <GotoLink value={linkValue} onChange={setLinkValue} />
        )}
        {key === ActionTypeEnum.tip && (
          <ShowTip value={tipValue} onChange={setTipValue} />
        )}
        {key === ActionTypeEnum.js && (
          <CustomJS value={codeValue} onChange={setCodeValue} />
        )}
      </div>
    </Modal>
  );
}
