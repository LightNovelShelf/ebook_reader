import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      epubjs85: path.resolve(__dirname, 'node_modules/epubjs85/dist/epub.min.js'),
      epubjs: path.resolve(__dirname, 'node_modules/epubjs/dist/epub.min.js')
    }
  }
})
