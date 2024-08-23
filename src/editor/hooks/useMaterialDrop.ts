import { useDrop } from "react-dnd";
import { useComponentConfigStore } from "@/editor/store/component-config";
import { useComponentsStore } from "../store/components";

export default function useMaterialDrop(accept: string[], id: number) {
  const { componentConfig } = useComponentConfigStore();
  const { addComponent } = useComponentsStore();

  const [{ canDrop }, drop] = useDrop({
    accept,
    drop({ type }: { type: string }, monitor) {
      const didDrop = monitor.didDrop();
      if (didDrop) return;

      const component = componentConfig[type];
      addComponent(
        {
          id: Date.now(),
          name: type,
          props: component.defaultProps,
          desc: component.desc,
        },
        id
      );
    },
    collect(monitor) {
      return { canDrop: monitor.canDrop() };
    },
  });

  return { canDrop, drop };
}
