import { useCreation } from "ahooks";
import { useComponentConfigStore } from "../../store/component-config";
import MaterialItem from "../MaterialItem";

export default function Material() {
  const { componentConfig } = useComponentConfigStore();

  const components = useCreation(() => {
    return Object.values(componentConfig).filter(
      (component) => component.name !== "Page"
    );
  }, [componentConfig]);

  return (
    <div>
      {components.map((component) => (
        <MaterialItem
          key={component.name}
          name={component.name}
          desc={component.desc}
        />
      ))}
    </div>
  );
}
