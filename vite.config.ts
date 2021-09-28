import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'epubjs/src/epubcfi': path.resolve(__dirname, 'node_modules/epubjs/src/epubcfi'),
      'epubjs/src/utils/core': path.resolve(__dirname, 'node_modules/epubjs/src/utils/core'),
      epubjs85: path.resolve(__dirname, 'node_modules/epubjs85/dist/epub.min.js'),
      epubjs: path.resolve(__dirname, 'node_modules/epubjs/dist/epub.min.js')
    }
  },
  optimizeDeps: {
    exclude: []
  }
})
