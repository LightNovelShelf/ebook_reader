import localforage from 'localforage'

const stack = [] as any[]
let isRun = false

const _setCache = async (cacheId: string, key: string, value: unknown) => {
  const info = ((await localforage.getItem(cacheId)) as Record<string, unknown>) || {}
  info[key] = value
  await localforage.setItem(cacheId, info)
  new Promise(next)
}

export const getCache = async (cacheId: string, key: string): Promise<unknown | undefined> => {
  const info = (await localforage.getItem(cacheId)) as Record<string, unknown>
  return info ? info[key] : undefined
}

function next() {
  if (stack.length === 0) {
    isRun = false
    return
  }
  const fn = stack.shift()
  fn()
}

function run() {
  if (!isRun) {
    isRun = true
    next()
  }
}

export const setCache = (cacheId: string, key: string, value: unknown): void => {
  stack.push(() => _setCache(cacheId, key, value))
  run()
}
