/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: "dist/stats.html",
      gzipSize: true,
      brotliSize: true,
      template: "treemap"
    })
  ],
  build: { outDir: "dist", sourcemap: true },
  server: { port: 3000, open: true },
  define: { __BUILD_TIME__: JSON.stringify(new Date().toISOString()) }
});

// npm run build
// npm run dev
