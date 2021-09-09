/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'v-hotkey'
declare module 'epubjs/src/utils/core'
declare module 'epubjs/src/managers/continuous/index.js'
