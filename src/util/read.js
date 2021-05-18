import store from '../store'
import vuetify from '../plugins/vuetify'
import bg_paper_dark from '../assets/img/bg-paper-dark.jpg'
import bg_paper from '../assets/img/bg-paper.jpg'
import { Storage } from '@/util/storage'

export function throttle(fn, ms = 160) {
  // let timeout
  let start = new Date()
  return function () {
    let context = this
    let args = arguments
    let curr = new Date() - 0
    // clearTimeout(timeout)
    if (curr - start >= ms) {
      fn.apply(context, args)
      start = curr
    } else {
      // timeout = setTimeout(() => fn.apply(context, args), ms)
    }
  }
}

export function throttle2(fn, ms = 160) {
  let timeout
  let start = new Date()
  return function () {
    let context = this
    let args = arguments
    let curr = new Date() - 0
    clearTimeout(timeout)
    if (curr - start >= ms) {
      fn.apply(context, args)
      start = curr
    } else {
      timeout = setTimeout(() => fn.apply(context, args), ms)
    }
  }
}

export function flatten(array) {
  return [].concat(...array.map((item) => [].concat(item, ...flatten(item.subitems))))
}

export function saveReadProgress(fileName, cfi) {
  let record = JSON.parse(localStorage.getItem(`Reading_Record`) || '{}')
  if (!record[fileName]) record[fileName] = {}
  record[fileName].cfi = cfi
  localStorage.setItem(`Reading_Record`, JSON.stringify(record))
}

export function GetReadProgress(hash) {
  let record = JSON.parse(localStorage.getItem(`Reading_Record`) || '{}')
  return record[hash]?.cfi
}

export function getReadTime() {
  return Storage.read('EBookReader_Time')
}

export function saveReadTime(time) {
  Storage.write('EBookReader_Time', time)
}

// dateDiff是分钟
export function lastUpdateFromNow(dateDiff) {
  let hours = Math.floor(dateDiff / 60 * 100) / 100
  if (hours > 0) {
    return hours
  }
  return 0
}

export const ImagePath = window.device?.getExternalFilesDir('Pictures')
export const StatusBarHeight = (window.device?.getStatusBarHeight() || 0) / window.devicePixelRatio
document.documentElement.style.setProperty('--status-bar-height', StatusBarHeight + 'px')

const readFilePromise = {}

export function getImagePath(name, uri) {
  if (readFilePromise[uri]) return readFilePromise[uri]
  return new Promise(function (resolve, reject) {
    if (store.state.book.coverCache[name]) resolve()
    if (name.startsWith('http')) {
      store.commit('book/updateCoverCache', { name: name, data: name })
      resolve()
    }
    let path = ImagePath + '/' + name
    if (window.device) {
      if (!device.fileExits(path)) {
        store.commit('book/updateCoverCache', { name: name, data: '' })
        // Todo 封面缓存不存在 在原生解析封面后通知给Web
        readFilePromise[uri] = this
        device.loadCover(1, name, path, uri)
        resolve()
      } else {
        if (window.location.origin !== 'file://') {
          // 远程调试，
          device.readFileAsync(1, name, path)
          resolve()
        } else {
          const result = 'file://' + path
          store.commit('book/updateCoverCache', { name: name, data: result })
          resolve(result)
        }
      }
    } else {
      const result = 'file://' + path
      store.commit('book/updateCoverCache', { name: name, data: result })
      resolve()
    }
  })
}

export function loadBg(themes) {
  switch (store.state.read.readingBgSetting) {
    case 'custom': {
      break
    }
    case 'paper': {
      themes.override('background', `url(${vuetify.theme?.dark ? bg_paper_dark : bg_paper}) repeat`)
      break
    }
    default:
      themes.override('--color', '')
  }
}
