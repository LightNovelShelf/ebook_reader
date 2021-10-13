import { createPinia } from 'pinia'
import { debounceAction } from './debounce'

const piniaInstance = createPinia()
piniaInstance.use(debounceAction)

export { piniaInstance }
