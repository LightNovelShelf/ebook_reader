import { PiniaPluginContext } from 'pinia'
import { debounce } from 'lodash'

declare module 'pinia' {
  export interface DefineStoreOptions<Id extends string, S extends StateTree, G, A>
    extends DefineStoreOptionsBase<S, Store<Id, S, G, A>> {
    debounce?: {
      // allow defining a number of ms for any of the actions
      [k in keyof A]?: number
    }
  }
}

/** 允许定义store时对某些action设置 debounce */
export function debounceAction({ options, store }: PiniaPluginContext) {
  if (options.debounce) {
    // we are overriding the actions with new ones
    return Object.keys(options.debounce).reduce((debouncedActions, action) => {
      debouncedActions[action] = debounce(store[action], options.debounce![action])
      return debouncedActions
    }, {} as any)
  }
}
