/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.json' {
  const value: any
  export default value
}

declare module '*.svg' {
  const value: string
  export default value
}

declare module '*/read.scss' {
  const value: string
  export default value
}

declare module 'v-hotkey'

