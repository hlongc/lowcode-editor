import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useMemoizedFn } from "ahooks";
import { useComponentsStore } from "@/editor/store/components";
import { CloseSquareOutlined } from "@ant-design/icons";
import { Popconfirm } from "antd";

interface Props {
  containerClassName: string;
  wrapperClassName: string;
}

export default function ClickMask({
  containerClassName,
  wrapperClassName,
}: Props) {
  const { components, currentComponent, currentComponentId } =
    useComponentsStore();

  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    labelTop: 0,
    labelLeft: 0,
  });

  const updatePosition = useMemoizedFn(() => {
    if (!currentComponentId) return;
    const root = document.querySelector(
      `.${containerClassName}`
    ) as HTMLElement;
    if (!root) return;
    const target = root.querySelector(
      `[data-component-id="${currentComponentId}"]`
    ) as HTMLElement;
    if (!target) return;

    const { left, top, width, height } = target.getBoundingClientRect();
    const { left: containerLeft, top: containerTop } =
      root.getBoundingClientRect();

    const labelTop = top - containerTop + target.scrollTop;
    let labelLeft = left - containerLeft + width;

    if (labelLeft <= 0) {
      labelLeft = -20;
    }

    setPosition({
      left: left - containerLeft + target.scrollLeft,
      top: top - containerTop + target.scrollTop,
      width,
      height,
      labelTop,
      labelLeft,
    });
  });

  useEffect(() => {
    updatePosition();
  }, [currentComponentId]);

  return createPortal(
    <>
      <div
        style={{
          position: "absolute",
          left: position.left,
          top: position.top,
          width: position.width,
          height: position.height,
          backgroundColor: "rgba(0,0,255,0.1)",
          border: "1px solid blue",
          pointerEvents: "none",
          zIndex: 12,
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          left: position.labelLeft,
          top: position.labelTop,
          fontSize: "14px",
          zIndex: 13,
          display: !position.width || position.width < 10 ? "none" : "flex",
          alignItems: "center",
          gap: "5px",
          transform: "translate(-100%, -100%)",
          backgroundColor: "blue",
          color: "#fff",
          padding: "0 8px",
        }}
      >
        <div style={{ whiteSpace: "nowrap" }}>{currentComponent?.name}</div>
        <Popconfirm
          title={`确认删除组件${currentComponent?.desc}及下级组件吗？`}
          cancelText="取消"
          okText="确认"
          onConfirm={() => {
            console.log("确认");
          }}
        >
          <CloseSquareOutlined style={{ cursor: "pointer" }} />
        </Popconfirm>
      </div>
    </>,
    document.querySelector(`.${wrapperClassName}`) as HTMLElement
  );
}
