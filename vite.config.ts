import { defineConfig } from "vite"
import { resolve } from "path"

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    target: "es2020",
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        content: resolve(process.cwd(), "src/content/contentScript.ts"),
        background: resolve(process.cwd(), "src/background/background.ts")
      },
      output: {
        format: "es",
        entryFileNames: "[name].js",
        manualChunks: undefined
      }
    }
  }
})
