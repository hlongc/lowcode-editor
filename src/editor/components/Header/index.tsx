import { Button } from "antd";
import { useComponentsStore } from "@/editor/store/components";

export default function Header() {
  const { setShowPreview } = useComponentsStore();

  return (
    <div className="h-[100%] w-[100%] flex justify-between px-[16px] items-center">
      <span>Header</span>
      <div>
        <Button type="primary" onClick={() => setShowPreview(true)}>
          预览
        </Button>
      </div>
    </div>
  );
}
