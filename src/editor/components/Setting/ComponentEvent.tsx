import { Button, Collapse, CollapseProps, Popconfirm } from "antd";
import { useComponentsStore } from "@/editor/store/components";
import {
  useComponentConfigStore,
  ComponentEvent as EventType,
} from "@/editor/store/component-config";
import ActionModal from "./ActionModal";
import { ActionEnum, GotoLinkConfig, ShowTipConfig } from "./common";
import { useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";

function EventTitle({
  title,
  onConfirm,
}: {
  title: string;
  onConfirm: () => void;
}) {
  return (
    <div className="text-[#333] text-[14px] flex justify-between items-center">
      <span>{title}</span>

      <Popconfirm
        title={`确认删除绑定的 ${title} 吗？`}
        onConfirm={onConfirm}
        cancelText="取消"
        okText="确认"
      >
        <DeleteOutlined />
      </Popconfirm>
    </div>
  );
}

export default function ComponentEvent() {
  const { currentComponent, updateComponentProps } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  const [open, setOpen] = useState(false);
  const [event, setEvent] = useState<EventType>();

  const items: CollapseProps["items"] = (
    componentConfig[currentComponent!.name].events ?? []
  )?.map((event) => {
    return {
      key: event.name,
      label: event.label,
      extra: (
        <Button
          type="primary"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setEvent(event);
            setOpen(true);
          }}
        >
          添加动作
        </Button>
      ),
      children: (
        (currentComponent?.props[event.name]?.actions ?? []) as (
          | GotoLinkConfig
          | ShowTipConfig
        )[]
      ).map((action, index, list) => {
        const type = action.type;
        const itemClass =
          "flex flex-col gap-[5px] border border-[#aaa] p-[5px]";
        const style = { marginBottom: index === list.length - 1 ? 0 : 10 };

        const handleDelete = () => {
          updateComponentProps(currentComponent!.id, {
            [event.name]: {
              actions: list.filter((_, i) => i !== index),
            },
          });
        };

        if (type === ActionEnum.gotoLink) {
          return (
            <div key={type} className={itemClass} style={style}>
              <EventTitle title="跳转链接" onConfirm={handleDelete} />
              <div className="text-[gray]">
                跳转至：<span className="text-[blue]">{action.url}</span>
              </div>
            </div>
          );
        } else if (action.type === ActionEnum.showTip) {
          return (
            <div key={type} className={itemClass} style={style}>
              <EventTitle title="消息提醒" onConfirm={handleDelete} />
              <div className="text-[gray]">消息类型：{action.messageType}</div>
              <div className="text-[gray]">提示信息：{action.text}</div>
            </div>
          );
        }
      }),
    };
  });

  if (!currentComponent) return null;
  return (
    <div className="p-[10px]">
      <Collapse
        items={items}
        defaultActiveKey={componentConfig[currentComponent.name]?.events?.map(
          (event) => event.name
        )}
      />
      <ActionModal
        visible={open}
        handleClose={() => setOpen(false)}
        handleOk={(data) => {
          updateComponentProps(currentComponent.id, {
            [event!.name]: { actions: data },
          });
          setOpen(false);
          setEvent(undefined);
        }}
        event={event!}
        component={currentComponent}
      />
    </div>
  );
}
