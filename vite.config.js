import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import dts from "vite-plugin-dts";
const isDemo = process.env.VITE_BUILD_TARGET === "demo";
import packageInfo from './package.json';

export default defineConfig({
  plugins: [
    vue(),
    cssInjectedByJsPlugin(),
    dts({
      insertTypesEntry: true,
      outputDir: "dist",
      skipDiagnostics: false,
    })],
  define: {
    __APP_VERSION__: JSON.stringify(packageInfo.version),
  },
  build: isDemo
    ? {
      outDir: "dist-demo",
      emptyOutDir: true,
    }
    : {
      lib: {
        entry: "src/components/TvDemo.vue",
        name: "TvDemo",
        fileName: format => `todovue-demo.${format}.js`,
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
