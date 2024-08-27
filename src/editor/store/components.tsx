import { create } from "zustand";

export interface Component {
  id: number;
  name: string;
  desc: string;
  props: Record<string, any>;
  children?: Component[];
  parentId?: number;
}

interface State {
  components: Component[];
  currentComponentId?: number;
  currentComponent?: Component;
}

interface Action {
  addComponent: (component: Component, parentId?: number) => void;
  deleteComponent: (componentId: number) => void;
  updateComponentProps: (componentId: number, props: any) => void;
  setCurrentComponentId: (componentId: number | undefined) => void;
}

export function getComponentById(
  id: number | undefined,
  components: Component[]
): Component | undefined {
  if (!id) return undefined;

  for (const component of components) {
    if (component.id == id) return component;
    if (component.children && component.children.length > 0) {
      const result = getComponentById(id, component.children);
      if (result !== null) return result;
    }
  }
  return undefined;
}

export const PageComponentId = 1;

export const useComponentsStore = create<State & Action>((set, get) => ({
  components: [
    {
      id: PageComponentId,
      name: "Page",
      props: {},
      desc: "页面",
    },
  ],
  setCurrentComponentId: (componentId) =>
    set((state) => {
      const component = getComponentById(componentId, state.components);
      return {
        currentComponentId: componentId,
        currentComponent: component,
      };
    }),
  addComponent: (component, parentId) =>
    set((state) => {
      if (parentId) {
        const parentComponent = getComponentById(parentId, state.components);
        if (parentComponent) {
          if (parentComponent.children) {
            parentComponent.children.push(component);
          } else {
            parentComponent.children = [component];
          }
        }

        component.parentId = parentId;
        return { components: [...state.components] };
      }
      return { components: [...state.components, component] };
    }),
  deleteComponent: (componentId) => {
    if (!componentId) return;

    const component = getComponentById(componentId, get().components);
    if (component?.parentId) {
      const parentComponent = getComponentById(
        component.parentId,
        get().components
      );

      if (parentComponent) {
        parentComponent.children = parentComponent?.children?.filter(
          (item) => item.id !== +componentId
        );

        set({ components: [...get().components] });
      }
    }
  },
  updateComponentProps: (componentId, props) =>
    set((state) => {
      const component = getComponentById(componentId, state.components);
      if (component) {
        component.props = { ...component.props, ...props };

        return { components: [...state.components] };
      }

      return { components: [...state.components] };
    }),
}));
