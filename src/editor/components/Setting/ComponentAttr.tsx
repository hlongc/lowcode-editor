import { useEffect } from "react";
import { useMemoizedFn } from "ahooks";
import { Form, Input, Select } from "antd";
import {
  useComponentConfigStore,
  ComponentSetter,
} from "@/editor/store/component-config";
import { useComponentsStore } from "@/editor/store/components";

export default function ComponentAttr() {
  const [form] = Form.useForm();

  const { currentComponentId, currentComponent, updateComponentProps } =
    useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  useEffect(() => {
    const data = form.getFieldsValue();

    form.setFieldsValue({ ...data, ...currentComponent?.props });
  }, [currentComponent]);

  const renderSetter = useMemoizedFn((setter: ComponentSetter) => {
    const { type, options } = setter;
    if (type === "input") {
      return <Input />;
    } else if (type === "select") {
      return <Select options={options} />;
    }
    return null;
  });

  if (!currentComponentId || !currentComponent) return null;

  return (
    <Form
      form={form}
      onValuesChange={(changeValues) => {
        if (currentComponentId) {
          updateComponentProps(currentComponentId, changeValues);
        }
      }}
      labelCol={{ span: 7 }}
      wrapperCol={{ span: 15 }}
    >
      <Form.Item label="组件id">
        <Input disabled value={currentComponent.id} />
      </Form.Item>
      <Form.Item label="组件名称">
        <Input disabled value={currentComponent.name} />
      </Form.Item>
      <Form.Item label="组件描述">
        <Input disabled value={currentComponent.desc} />
      </Form.Item>
      {componentConfig[currentComponent.name].setter?.map((setter) => {
        return (
          <Form.Item key={setter.name} label={setter.label} name={setter.name}>
            {renderSetter(setter)}
          </Form.Item>
        );
      })}
    </Form>
  );
}
