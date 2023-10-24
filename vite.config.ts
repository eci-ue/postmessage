/**
 * @file Vite Config
 * @author svon.me@gmail.com
 */

import path from "path";
import { defineConfig } from "vite";

export default defineConfig(async function() {
  return {
    resolve: {
      extensions: [".ts", ".js"],
      alias: {
        "src/": path.resolve(__dirname, "src") + "/",
      },
    },
    plugins: [
    ],
    optimizeDeps: {
      include: [
      ]
    },
    build: {
      target: "modules",
      polyfillModulePreload: false,
      lib: {
        entry: "src/message",
        name: "Message",
        formats: ["es", "umd"],
        fileName: "message"
      },
      cssCodeSplit: true,
      sourcemap: true,
      manifest: false,
      rollupOptions: {
        external: [
        ],
        output: {
          inlineDynamicImports: true
        }
      }
    },
  };
});
