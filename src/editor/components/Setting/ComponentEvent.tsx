import { useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Collapse, CollapseProps, Popconfirm } from "antd";
import { useComponentsStore } from "@/editor/store/components";
import {
  useComponentConfigStore,
  ComponentEvent as EventType,
} from "@/editor/store/component-config";
import ActionModal from "./ActionModal";
import { ActionEnum, ActionConfig, ActionTypeEnum } from "./common";

function EventTitle({
  title,
  onConfirm,
  onEdit,
}: {
  title: string;
  onConfirm: () => void;
  onEdit: () => void;
}) {
  return (
    <div className="text-[#333] text-[14px] flex justify-between items-center gap-[5px]">
      <span>{title}</span>

      <EditOutlined
        className="cursor-pointer ml-auto"
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
      />
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
  const [tab, setTab] = useState<ActionTypeEnum>(ActionTypeEnum.link);

  useEffect(() => {
    if (!open) {
      setTab(ActionTypeEnum.link);
    }
  }, [open]);

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
        (currentComponent?.props[event.name]?.actions ?? []) as ActionConfig[]
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

        const onEdit = (tab: ActionTypeEnum) => {
          setEvent(event);
          setTab(tab);
          setOpen(true);
        };

        if (type === ActionEnum.gotoLink) {
          return (
            <div key={type} className={itemClass} style={style}>
              <EventTitle
                title="跳转链接"
                onConfirm={handleDelete}
                onEdit={() => onEdit(ActionTypeEnum.link)}
              />
              <div className="text-[gray]">
                跳转至：<span className="text-[blue]">{action.url}</span>
              </div>
            </div>
          );
        } else if (action.type === ActionEnum.showTip) {
          return (
            <div key={type} className={itemClass} style={style}>
              <EventTitle
                title="消息提醒"
                onConfirm={handleDelete}
                onEdit={() => onEdit(ActionTypeEnum.tip)}
              />
              <div className="text-[gray]">消息类型：{action.messageType}</div>
              <div className="text-[gray]">提示信息：{action.text}</div>
            </div>
          );
        } else if (action.type === ActionEnum.customJs) {
          return (
            <div key={type} className={itemClass} style={style}>
              <EventTitle
                title="自定义JS"
                onConfirm={handleDelete}
                onEdit={() => onEdit(ActionTypeEnum.js)}
              />
              <div className="text-[gray]">JS代码：{action.code}</div>
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
        defaultTab={tab}
      />
    </div>
  );
}
