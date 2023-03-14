import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    commonjsOptions: {
      include: ["tailwind-config.cjs", "node_modules/**"],
    },
  },

  optimizeDeps: {
    include: ["tailwind-config"],
  },

  plugins: [react()],

  resolve: {
    alias: {
      "@": "/src",
      "tailwind-config": "tailwind.config.cjs",
    },
  },
});
