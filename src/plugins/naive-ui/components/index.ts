import { create } from 'naive-ui'
import * as components from './export'

console.log(components)

export const naive = create({
  components: Object.values(components)
})
