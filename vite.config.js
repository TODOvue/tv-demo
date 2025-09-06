import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import dts from "vite-plugin-dts";
const isDemo = process.env.VITE_BUILD_TARGET === "demo";

export default defineConfig({
  plugins: [
    vue(),
    cssInjectedByJsPlugin(),
    dts({
      insertTypesEntry: true,
      outputDir: "dist",
      skipDiagnostics: false,
    })],
  build: isDemo
    ? {
      outDir: "dist-demo",
      emptyOutDir: true,
    }
    : {
      lib: {
        entry: "src/entry.ts",
        name: "TvDemo",
        fileName: format => `tv-demo.${format}.js`,
        formats: ["es", "cjs"]
      },
      rollupOptions: {
        external: ["vue", "vue-highlight-code"],
        output: {
          globals: {
            vue: "Vue"
          }
        }
      }
    },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler"
      }
    }
  }
});
