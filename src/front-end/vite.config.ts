/// <reference types="vitest" />

import { type ConfigEnv, type UserConfigExport, loadEnv } from "vite"
import path, { resolve } from "path"
import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"
import { createSvgIconsPlugin } from "vite-plugin-svg-icons"
import svgLoader from "vite-svg-loader"
import UnoCSS from "unocss/vite"

/** Configuration item document: https://cn.vitejs.dev/config */
export default ({ mode }: ConfigEnv): UserConfigExport => {
  const viteEnv = loadEnv(mode, process.cwd()) as ImportMetaEnv
  const { VITE_PUBLIC_PATH } = viteEnv
  return {
    /** Modify base according to actual situation when packaging */
    base: VITE_PUBLIC_PATH,
    resolve: {
      alias: {
        /** @ symbol points to the src directory */
        "@": resolve(__dirname, "./src")
      }
    },
    server: {
      /** Set host: true to use Network form to access the project by IP */
      host: true, // host: "0.0.0.0"
      /** The port number */
      port: 3333,
      /** Whether to automatically open the browser */
      open: false,
      /** Cross-domain settings allowed */
      cors: true,
      /** Whether to exit directly when the port is occupied */
      strictPort: false,
      /** Interface proxy */
      proxy: {
        "/api/v1": {
          target: "https://mock.mengxuegu.com/mock/63218b5fb4c53348ed2bc212",
          ws: true,
          /** Whether to allow cross-domain */
          changeOrigin: true
        }
      },
      /** Preheat commonly used files to improve initial page loading speed */
      warmup: {
        clientFiles: ["./src/layouts/**/*.vue"]
      }
    },
    build: {
      /** Warn when the size of a single chunk file exceeds 2048KB */
      chunkSizeWarningLimit: 2048,
      /** Disable gzip compression size reporting */
      reportCompressedSize: false,
      /** Static resource directory after packaging */
      assetsDir: "static",
      rollupOptions: {
        output: {
          /**
           * Chunking strategy
           * 1. Note that these package names must exist, otherwise the package will report an error
           * 2. If you don’t want to customize the chunk splitting strategy, you can directly remove this configuration
           */
          manualChunks: {
            vue: ["vue", "vue-router", "pinia"],
            element: ["element-plus", "@element-plus/icons-vue"],
            vxe: ["vxe-table", "vxe-table-plugin-element", "xe-utils"]
          }
        }
      }
    },
    /** Obfuscator */
    esbuild:
      mode === "development"
        ? undefined
        : {
            /** Remove console.log when packaging */
            pure: ["console.log"],
            /** Remove debugger when packaging */
            drop: ["debugger"],
            /** Remove all comments when packaging */
            legalComments: "none"
          },
    /** Vite plug-in */
    plugins: [
      vue(),
      vueJsx(),
      /** Convert SVG static images into Vue components */
      svgLoader({ defaultImport: "url" }),
      /** SVG */
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), "src/icons/svg")],
        symbolId: "icon-[dir]-[name]"
      }),
      /** UnoCSS */
      UnoCSS()
    ],
    /** Vitest unit test configuration: https://cn.vitest.dev/config */
    test: {
      include: ["tests/**/*.test.ts"],
      environment: "jsdom"
    }
  }
}
