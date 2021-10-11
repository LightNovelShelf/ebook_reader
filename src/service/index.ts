import { requestWithSignalr } from './internal/request'

/** 获取书籍列表 */
export function showToast(str: string) {
  return requestWithSignalr('ShowToast', str)
}

/** 获取手机根目录 */
export function getExternalStorageDirectory() {
  return requestWithSignalr<string>('GetExternalStorageDirectory')
}

/** 获取目录下所有文件 */
export function getFiles(path: string) {
  return requestWithSignalr<string[]>('GetFiles', path)
}

/** 获取目录下所有文件夹 */
export function getDirectories(path: string) {
  return requestWithSignalr<string[]>('GetDirectories', path)
}

/** 读取文件 */
export function readFile(path: string) {
  return requestWithSignalr<string[]>('ReadFile', path)
}
