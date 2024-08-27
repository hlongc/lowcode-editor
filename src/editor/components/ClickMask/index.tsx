import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useCreation, useMemoizedFn } from "ahooks";
import {
  useComponentsStore,
  getComponentById,
  PageComponentId,
} from "@/editor/store/components";
import { CloseSquareOutlined } from "@ant-design/icons";
import { Dropdown, Popconfirm, MenuProps } from "antd";
import { debounce } from "lodash-es";

interface Props {
  containerClassName: string;
  wrapperClassName: string;
}

export default function ClickMask({
  containerClassName,
  wrapperClassName,
}: Props) {
  const {
    components,
    currentComponent,
    currentComponentId,
    setCurrentComponentId,
    deleteComponent,
  } = useComponentsStore();

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

  const items = useCreation(() => {
    if (!currentComponentId) return [];
    const data = [] as Exclude<MenuProps["items"], undefined>;

    const stack = [currentComponentId];
    while (stack.length) {
      const component = getComponentById(stack.pop()!, components);
      if (component) {
        // 不显示根节点Page
        if (component.id === PageComponentId) continue;
        data.unshift({
          key: component.id,
          label: (
            <span className="cursor-pointer" title="点击选中该元素">
              {component.desc}
            </span>
          ),
          onClick: () => setCurrentComponentId(component.id),
        });
        if (component.parentId) {
          stack.push(component.parentId);
        }
      }
    }
    return data;
  }, [currentComponentId, components]);

  useEffect(() => {
    updatePosition();
  }, [currentComponentId, components]);

  useEffect(() => {
    const resizeHandler = debounce(() => {
      updatePosition();
    }, 50);

    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

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
          gap: "10px",
          transform: "translate(-100%, -100%)",
          backgroundColor: "blue",
          color: "#fff",
          padding: "0 8px",
        }}
      >
        <Dropdown menu={{ items }}>
          <div style={{ whiteSpace: "nowrap", cursor: "pointer" }}>
            {currentComponent?.desc}
          </div>
        </Dropdown>
        <Popconfirm
          title={`确认删除组件${currentComponent?.desc}及下级组件吗？`}
          cancelText="取消"
          okText="确认"
          onConfirm={() => {
            deleteComponent(currentComponentId!);
            setCurrentComponentId(undefined);
          }}
        >
          <CloseSquareOutlined style={{ cursor: "pointer" }} />
        </Popconfirm>
      </div>
    </>,
    document.querySelector(`.${wrapperClassName}`) as HTMLElement
  );
}
