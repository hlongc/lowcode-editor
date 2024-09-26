import { ReactNode, useEffect } from "react";
import { useMemoizedFn } from "ahooks";
import { Form, Input, Radio, Select } from "antd";
import {
  useComponentConfigStore,
  ComponentSetter,
} from "@/editor/store/component-config";
import { useComponentsStore } from "@/editor/store/components";
import { SetterTypeEnum } from "@/editor/constant/enum";

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
    const { type, options, name, label, valuePropName } = setter;
    let el: ReactNode = null;

    if (type === SetterTypeEnum.Input) {
      el = <Input />;
    } else if (type === SetterTypeEnum.Select) {
      el = <Select options={options} />;
    } else if (type === SetterTypeEnum.RadioGroup) {
      el = <Radio.Group size="small" options={options} optionType="button" />;
    }

    return (
      <Form.Item
        key={name}
        label={label}
        name={name}
        valuePropName={valuePropName}
      >
        {el}
      </Form.Item>
    );
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
      {componentConfig[currentComponent.name].setter?.map(renderSetter)}
    </Form>
  );
}
