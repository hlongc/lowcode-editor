import MonacoEditor, { loader, OnMount } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { ActionEnum, CustomJsConfig } from "../common";

loader.config({ monaco });

export interface CustomJsProps {
  value?: CustomJsConfig;
  onChange?: (config: CustomJsConfig) => void;
}

export default function CustomJS({ value, onChange }: CustomJsProps) {
  const handleEditorMount: OnMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
      editor.getAction("editor.action.formatDocument")?.run();
    });
  };

  return (
    <div className="mt-[40px] h-full">
      <MonacoEditor
        width="100%"
        height="400px"
        path="action.js"
        language="javascript"
        onMount={handleEditorMount}
        onChange={(val) => onChange?.({ type: ActionEnum.customJs, code: val })}
        value={value?.code}
        options={{
          fontSize: 14,
          scrollBeyondLastLine: false,
          minimap: { enabled: false },
          scrollbar: {
            verticalScrollbarSize: 6,
            horizontalScrollbarSize: 6,
          },
        }}
      />
    </div>
  );
}
