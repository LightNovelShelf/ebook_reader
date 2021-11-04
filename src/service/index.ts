import { requestWithSignalr } from './internal/request'
import { BookInfo } from './type'

/** 显示通知 */
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

/** 获取目录下所有文件夹 */
export function readFile(path: string) {
  return requestWithSignalr<string[]>('ReadFile', path)
}

/** 读取epub文件，返回opf的文件位置 和 文件md5 */
export function getEpubPath(path: string) {
  return requestWithSignalr<string[]>('GetEpubPath', path, process.env.NODE_ENV === 'development')
}

/** 删除文件 */
export function deleteFile(path: string) {
  return requestWithSignalr<string>('DeleteFile', path)
}

/** 取epub信息 */
// 虽然是异步函数，但Asp.Net Core 2下的Signalr无法并发调用，有空可以尝试改用立刻返回并服务端返回事件来处理信息
export function getEpubInfo(path: string) {
  return requestWithSignalr<BookInfo>('GetEpubInfo', path, process.env.NODE_ENV === 'development')
}

export function getIndentFile() {
  return requestWithSignalr<string[]>('GetIndentFile', process.env.NODE_ENV === 'development')
}
