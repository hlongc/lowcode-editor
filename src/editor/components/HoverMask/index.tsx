import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useCreation, useMemoizedFn } from "ahooks";
import {
  useComponentsStore,
  getComponentById,
} from "@/editor/store/components";

interface Props {
  containerClassName: string;
  componentId: number;
  wrapperClassName: string;
}

export default function HoverMask({
  componentId,
  containerClassName,
  wrapperClassName,
}: Props) {
  const { components } = useComponentsStore();

  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    labelTop: 0,
    labelLeft: 0,
  });

  const component = useCreation(() => {
    return getComponentById(componentId, components);
  }, [components, componentId]);

  const updatePosition = useMemoizedFn(() => {
    if (!componentId) return;
    const root = document.querySelector(
      `.${containerClassName}`
    ) as HTMLElement;
    if (!root) return;
    const target = root.querySelector(
      `[data-component-id="${componentId}"]`
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
  }, [componentId]);

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
          display: !position.width || position.width < 10 ? "none" : "inline",
          transform: "translate(-100%, -100%)",
        }}
      >
        <div
          style={{
            padding: "0 8px",
            backgroundColor: "blue",
            borderRadius: 4,
            color: "#fff",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {component?.desc}
        </div>
      </div>
    </>,
    document.querySelector(`.${wrapperClassName}`) as HTMLElement
  );
}
