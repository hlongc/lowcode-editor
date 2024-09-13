import { useDrop } from "react-dnd";
import { useComponentConfigStore } from "@/editor/store/component-config";
import { useComponentsStore, getComponentById } from "../store/components";

const genId = () => Math.random().toString(16).slice(2, 8);

export enum DragTypeEnum {
  add = "add",
  move = "move",
}

interface ItemType {
  type: string;
  /** 操作类型 */
  dragType?: DragTypeEnum;
  id: number;
}

export default function useMaterialDrop(accept: string[], id: number) {
  const { componentConfig } = useComponentConfigStore();
  const { addComponent, deleteComponent, components } = useComponentsStore();

  const [{ canDrop }, drop] = useDrop({
    accept,
    drop(item: ItemType, monitor) {
      const { id: itemId, type, dragType = DragTypeEnum.add } = item;
      const didDrop = monitor.didDrop();
      if (didDrop) return;

      if (dragType === DragTypeEnum.add) {
        const component = componentConfig[type];
        addComponent(
          {
            id: Date.now(),
            name: type,
            props: component.defaultProps,
            desc: `${component.desc}-${genId()}`,
          },
          id
        );
      } else {
        const component = getComponentById(itemId, components)!;
        deleteComponent(itemId);
        addComponent(component, id);
      }
    },
    collect(monitor) {
      return { canDrop: monitor.canDrop() };
    },
  });

  return { canDrop, drop };
}
