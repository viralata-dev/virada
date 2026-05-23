import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const srcPath = fileURLToPath(new URL("./src", import.meta.url));
const publicPath = fileURLToPath(new URL("./public", import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "~": srcPath,
      "@app": `${srcPath}/app`,
      "@components": `${srcPath}/app/components`,
      "@data": `${srcPath}/data`,
      "@hooks": `${srcPath}/hooks`,
      "@types": `${srcPath}/types`,
      "@utils": `${srcPath}/utils`,
      "@public": publicPath,
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    css: false,
  },
});
