import localforage from 'localforage'
import PQueue from 'p-queue'

const queue = new PQueue({ concurrency: 1 })

export const _getCache = async (cacheId: string, key: string): Promise<unknown | undefined> => {
  const info = (await localforage.getItem(cacheId)) as Record<string, unknown>
  return info ? info[key] : undefined
}

const _setCache = async (cacheId: string, key: string, value: unknown): Promise<Record<string, unknown>> => {
  const info = ((await localforage.getItem(cacheId)) as Record<string, unknown>) || {}
  info[key] = value
  return await localforage.setItem(cacheId, info)
}

export const setCache = (cacheId: string, key: string, value: unknown): Promise<Record<string, unknown>> => {
  return queue.add(() => _setCache(cacheId, key, value))
}

export const getCache = (cacheId: string, key: string): Promise<unknown | undefined> => {
  return queue.add(() => _getCache(cacheId, key))
}
