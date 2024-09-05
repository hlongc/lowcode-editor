import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import monacoEditorPlugin from "vite-plugin-monaco-editor";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), (monacoEditorPlugin as any).default({})],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
