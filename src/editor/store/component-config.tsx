import { create } from "zustand";
import ContainerDev from "../components/Material/Container/dev";
import ContainerPrd from "../components/Material/Container/prd";
import ButtonDev from "../components/Material/Button/dev";
import ButtonPrd from "../components/Material/Button/prd";
import PageDev from "../components/Material/Page/dev";
import PagePrd from "../components/Material/Page/prd";

export interface ComponentSetter {
  name: string;
  label: string;
  type: string;
  [key: string]: any;
}

export interface ComponentEvent {
  name: string;
  label: string;
}

export interface ComponentConfig {
  name: string;
  desc: string;
  defaultProps: Record<string, any>;
  /** 属性设置 */
  setter?: ComponentSetter[];
  styleSetter?: ComponentSetter[];
  /** 事件绑定 */
  events?: ComponentEvent[];
  /** 编辑区组件 */
  dev: any;
  /** 预览组件 */
  prd: any;
}

interface State {
  componentConfig: { [key: string]: ComponentConfig };
}

interface Action {
  registerComponent: (name: string, componentConfig: ComponentConfig) => void;
}

export const useComponentConfigStore = create<State & Action>((set) => ({
  componentConfig: {
    Container: {
      name: "Container",
      desc: "容器",
      defaultProps: {},
      dev: ContainerDev,
      prd: ContainerPrd,
    },
    Button: {
      name: "Button",
      desc: "按钮",
      defaultProps: {
        type: "primary",
        text: "按钮",
      },
      dev: ButtonDev,
      prd: ButtonPrd,
      setter: [
        {
          name: "type",
          label: "按钮类型",
          type: "select",
          options: [
            { label: "主按钮", value: "primary" },
            { label: "次按钮", value: "default" },
          ],
        },
        {
          name: "text",
          label: "文本",
          type: "input",
        },
      ],
      styleSetter: [
        {
          name: "width",
          label: "宽度",
          type: "inputNumber",
        },
        {
          name: "height",
          label: "高度",
          type: "inputNumber",
        },
      ],
      events: [
        { label: "点击事件", name: "onClick" },
        { label: "双击事件", name: "onDoubleClick" },
      ],
    },
    Page: {
      name: "Page",
      desc: "页面",
      defaultProps: {},
      dev: PageDev,
      prd: PagePrd,
    },
  },
  registerComponent: (name, componentConfig) =>
    set((state) => {
      return {
        ...state,
        componentConfig: {
          ...state.componentConfig,
          [name]: componentConfig,
        },
      };
    }),
}));
