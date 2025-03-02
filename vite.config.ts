import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import sass from 'sass'
// https://vite.dev/config/
export default defineConfig({
  plugins: [preact(), viteSingleFile()],
  css: {
    preprocessorOptions: {
      sass: {
        implementation: sass,
      },
    },
  },
  build: {
    target: 'esnext',
  }
})
