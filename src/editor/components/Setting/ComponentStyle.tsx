import { useEffect, useState } from "react";
import { useMemoizedFn } from "ahooks";
import { debounce } from "lodash-es";
import { Form, Input, Select, InputNumber } from "antd";
import styleToObject from "style-to-object";
import {
  useComponentConfigStore,
  ComponentSetter,
} from "@/editor/store/component-config";
import { useComponentsStore } from "@/editor/store/components";
import CssEditor from "./CssEditor";

function toCSSStr(css: Record<string, any>) {
  let str = `.comp {\n`;
  for (const key in css) {
    let value = css[key];
    if (!value) {
      continue;
    }
    if (["width", "height"].includes(key) && !value.toString().endsWith("px")) {
      value += "px";
    }

    str += `\t${key}: ${value};\n`;
  }
  str += `}`;
  return str;
}

export default function ComponentStyle() {
  const [form] = Form.useForm();
  const [css, setCss] = useState<string>(`.comp{\n\n}`);

  const { currentComponentId, currentComponent, updateComponentStyle } =
    useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  useEffect(() => {
    form.resetFields();
    const data = form.getFieldsValue();

    form.setFieldsValue({ ...data, ...currentComponent?.style });
    setCss(toCSSStr(currentComponent?.style || {}));
  }, [currentComponent]);

  const renderSetter = useMemoizedFn((setter: ComponentSetter) => {
    const { type, options } = setter;
    if (type === "input") {
      return <Input />;
    } else if (type === "select") {
      return <Select options={options} />;
    } else if (type === "inputNumber") {
      return <InputNumber />;
    }
    return null;
  });

  const handleEditorChange = debounce((value: string | undefined) => {
    if (!value || !currentComponentId) return;
    const css: Record<string, any> = {};

    try {
      const cssStr = value
        .replace(/\/\*.*\*\//, "") // 去掉注释 /** */
        .replace(/(\.?[^{]+{)/, "") // 去掉 .comp {
        .replace("}", ""); // 去掉 }

      styleToObject(cssStr, (name, value) => {
        css[
          name.replace(/-\w/, (item) => item.toUpperCase().replace("-", ""))
        ] = value;
      });

      console.log(css);
      updateComponentStyle(
        currentComponentId,
        { ...form.getFieldsValue(), ...css },
        true
      );
    } catch {}
  }, 500);

  if (!currentComponentId || !currentComponent) return null;

  return (
    <Form
      form={form}
      onValuesChange={(changeValues) => {
        if (currentComponentId) {
          updateComponentStyle(currentComponentId, changeValues);
        }
      }}
      labelCol={{ span: 7 }}
      wrapperCol={{ span: 15 }}
    >
      {componentConfig[currentComponent.name].styleSetter?.map((setter) => {
        return (
          <Form.Item key={setter.name} label={setter.label} name={setter.name}>
            {renderSetter(setter)}
          </Form.Item>
        );
      })}
      <div className="h-[200px] border-[1px] border-[#ccc]">
        <CssEditor value={css} onChange={handleEditorChange} />
      </div>
    </Form>
  );
}
