import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@scui/core": path.resolve(__dirname, "../../packages/core/src"),
      "@scui/react": path.resolve(__dirname, "../../packages/react/src"),
      "@scui/adapters": path.resolve(__dirname, "../../packages/adapters/src"),
      "@scui/zod": path.resolve(__dirname, "../../packages/zod/src")
    }
  },
  build: {
    target: "esnext"
  }
});


