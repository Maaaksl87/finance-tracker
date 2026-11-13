import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import type { LoggerEvent } from 'babel-plugin-react-compiler'

const reactCompilerLogger = {
  logEvent(filename: string | null, event: LoggerEvent) {
    const file = filename ?? '<unknown>'
    switch (event.kind) {
      case 'CompileSkip':
        console.warn(`\x1b[33m[React Compiler] ○ skip\x1b[0m ${file}\n  ${event.reason}`)
        break
      case 'CompileError':
        console.error(`\x1b[31m[React Compiler] ✗ error\x1b[0m ${file}\n  ${event.detail.reason}`)
        break
    }
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            'babel-plugin-react-compiler',
            {
              target: '19',
              panicThreshold: 'none',
              logger: reactCompilerLogger,
            },
          ],
        ],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
})
