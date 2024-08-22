import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useMemoizedFn } from "ahooks";

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
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });

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

    setPosition({
      left: left - containerLeft + target.scrollLeft,
      top: top - containerTop + target.scrollTop,
      width,
      height,
    });
  });

  useEffect(() => {
    updatePosition();
  }, [componentId]);

  return createPortal(
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
    ></div>,
    document.querySelector(`.${wrapperClassName}`) as HTMLElement
  );
}
