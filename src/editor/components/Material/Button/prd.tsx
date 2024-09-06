import { Button as AntdButton } from "antd";
import { ButtonType } from "antd/es/button";
import { CommonComponentProps } from "@/editor/interface";

export interface ButtonProps extends CommonComponentProps {
  type: ButtonType;
  text: string;
}

const Button = ({ type, text, style }: ButtonProps) => {
  return (
    <AntdButton style={style} type={type}>
      {text}
    </AntdButton>
  );
};

export default Button;
