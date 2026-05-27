import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: "es2020",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("@sanity") || id.includes("/sanity/")) return "vendor-sanity";
          if (id.includes("embla-carousel")) return "vendor-embla";
          if (id.includes("@portabletext")) return "vendor-portabletext";
          if (id.includes("date-fns")) return "vendor-date-fns";
          if (id.includes("react-router")) return "vendor-router";
          if (id.includes("react-dom") || id.includes("/react/")) return "vendor-react";
        },
      },
    },
  },
});
