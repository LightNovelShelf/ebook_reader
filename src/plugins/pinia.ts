import { createPinia } from 'pinia'

const pinia = createPinia()

pinia.use(({ store }) => {
  store.$subscribe((mutation) => {
    // react to store changes
    if (mutation.storeId === 'app.read' && mutation.type === 'direct') {
      if (
        mutation.events.type === 'set' &&
        mutation.events.key === 'fontSize' &&
        mutation.events.newValue !== mutation.events.oldValue
      ) {
        store.setFontSize(mutation.events.newValue)
      }
    }
  })
})

export default pinia
