import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { ref } from 'vue'

/** signalr接入点 */
const HOST = location.hostname === '10.0.2.2' ? 'http://127.0.0.1:5555/api' : `${import.meta.env.VITE_API_SERVER}`

/** 缓存 HubConnection，当初始化或者链接失效时置为null */
let connection: null | HubConnection = null
/** 记录Promise避免多次发起链接 */
let connectPromise: null | Promise<HubConnection> = null

/** signalr联通情况监听 */
export const isConnected = ref<boolean>(false)

/** 失败重连需要相隔10s */
const RECONNECT_TIMEOUT = 10 * 1000

/** 单例句柄，保险 */
let lastReConnect = 0
/** 延时重连 */
const reConnect = () => {
  if (lastReConnect) {
    clearTimeout(lastReConnect)
  }
  lastReConnect = setTimeout(() => {
    getSignalr()
    lastReConnect = 0
  }, RECONNECT_TIMEOUT) as unknown as number
}

/** 返回一个 signalr 实例 */
export const getSignalr = (): Promise<HubConnection> => {
  if (connection) {
    return Promise.resolve(connection)
  }

  if (!connectPromise) {
    connectPromise = (async () => {
      /** 初始化 HubConnection */
      const hub = new HubConnectionBuilder().withUrl(HOST).configureLogging(LogLevel.Information).build()

      /** 并待其start完成 */
      try {
        await hub.start()
      } catch (e) {
        reConnect()
        throw e
      }
      isConnected.value = true

      return hub
    })()

    /** 待start完成后记录 清除Promise，避免掉线重连时发现有Promise就不执行重连操作 */
    connectPromise.finally(() => {
      connectPromise = null
    })

    /** 待start完成后记录 HubConnection，不再重复初始化 */
    connectPromise.then((hub) => {
      connection = hub
      /** 意外关闭时清除缓存 */
      connection.onclose(() => {
        connection = null
        isConnected.value = false
        reConnect()
      })
    })
  }

  return connectPromise
}

export const requestWithSignalr = async <Res = unknown, Data extends unknown[] = unknown[]>(
  url: string,
  ...data: Data
): Promise<Res> => {
  const hub = await getSignalr()

  const { success, response, status, msg } = await hub.invoke(url, ...data)
  if (status === 200 && success) {
    return response
  }

  throw new Error(msg || '未知服务错误')
}
