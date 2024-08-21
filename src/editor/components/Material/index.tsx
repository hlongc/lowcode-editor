import { useCreation } from "ahooks";
import { useComponentConfigStore } from "../../store/component-config";
import MaterialItem from "../MaterialItem";

export default function Material() {
  const { componentConfig } = useComponentConfigStore();

  const components = useCreation(() => {
    return Object.values(componentConfig);
  }, [componentConfig]);

  return (
    <div>
      {components.map((component) => (
        <MaterialItem key={component.name} name={component.name} />
      ))}
    </div>
  );
}
