import { useDrop } from "react-dnd";
import { useComponentConfigStore } from "../store/component-config";
import { useComponetsStore } from "../store/components";

export default function useMaterialDrop(accept: string[], id: number) {
  const { componentConfig } = useComponentConfigStore();
  const { addComponent } = useComponetsStore();

  const [{ canDrop }, drop] = useDrop({
    accept,
    drop({ type }: { type: string }, monitor) {
      const didDrop = monitor.didDrop();
      if (didDrop) return;

      const props = componentConfig[type].defaultProps;
      addComponent(
        {
          id: Date.now(),
          name: type,
          props,
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
