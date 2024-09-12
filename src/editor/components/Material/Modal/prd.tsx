import {
  forwardRef,
  useImperativeHandle,
  ForwardRefRenderFunction,
  useState,
} from "react";
import { Modal as AntdModal } from "antd";
import { CommonComponentProps } from "../../../interface";

export interface ModalRef {
  open: () => void;
  close: () => void;
}

const Modal: ForwardRefRenderFunction<ModalRef, CommonComponentProps> = (
  { children, style, title, onOk, onCancel },
  ref
) => {
  const [open, setOpen] = useState(false);

  useImperativeHandle(ref, () => {
    return {
      open: () => setOpen(true),
      close: () => setOpen(false),
    };
  });

  return (
    <AntdModal
      title={title}
      style={style}
      open={open}
      onOk={() => onOk?.()}
      onCancel={() => {
        setOpen(false);
        onCancel?.();
      }}
    >
      {children}
    </AntdModal>
  );
};

export default forwardRef(Modal);
