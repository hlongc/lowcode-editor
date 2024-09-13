import { Button as AntdButton } from "antd";
import { ButtonType } from "antd/es/button";
import { useDrag } from "react-dnd";
import { CommonComponentProps } from "@/editor/interface";
import { DragTypeEnum } from "@/editor/hooks/useMaterialDrop";

export interface ButtonProps extends CommonComponentProps {
  type: ButtonType;
  text: string;
}

const Button = ({ type, text, id, style, name }: ButtonProps) => {
  const [_, drag] = useDrag({
    type: name,
    item: { type: name, id, dragType: DragTypeEnum.move },
  });

  return (
    <AntdButton
      ref={drag}
      data-type={name}
      style={style}
      data-component-id={id}
      type={type}
    >
      {text}
    </AntdButton>
  );
};

export default Button;
