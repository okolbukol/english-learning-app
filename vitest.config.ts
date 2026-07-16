import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      react: "C:/Users/tolga/Documents/Codex/active-projects/english-learning-app/apps/web/node_modules/react",
      "react-dom": "C:/Users/tolga/Documents/Codex/active-projects/english-learning-app/apps/web/node_modules/react-dom",
      "@html2pdf-pro/teaching-engine": "C:/Users/tolga/Documents/Codex/active-projects/english-learning-app/packages/teaching-engine/src/index.ts"
    }
  },
  test: {
    coverage: {
      reporter: ["text", "html"]
    },
    environment: "jsdom",
    globals: true,
    include: ["apps/**/*.test.{ts,tsx}", "packages/**/*.test.ts"],
    setupFiles: ["./vitest.setup.ts"]
  }
});
