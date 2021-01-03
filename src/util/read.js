import { toByteArray } from 'base64-js'
import Epub from 'epubjs'
import md5 from 'md5'

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

export function GetReadProgress(fileName) {
  let record = JSON.parse(localStorage.getItem(`Reading_Record`) || '{}')
  return record[fileName]?.cfi
}

export function getFontSize() {
  return localStorage.getItem('Reading_FontSize') || 16
}

export function saveFontSize(size) {
  localStorage.setItem('Reading_FontSize', size)
}

export const ImagePath = window.drive?.getExternalFilesDir('Pictures')

export async function getImagePath(name, uri) {
  if (name.startsWith('http')) return name
  let path = ImagePath + '/' + name
  if (window.drive) {
    if (!drive.fileExits(path)) {
      let data = toByteArray(drive.readFile(uri))
      let book = new Epub()
      await book.open(data.buffer)
      let cover = await book.loaded.cover
      let coverData = await book.archive.getBase64(cover)
      new Promise(function() {
        drive.saveFile(name, 'Pictures', coverData)
      })
      return coverData
    } else {
      if (window.location.origin !== 'file://') {
        return 'data:image/jpeg;base64,' + drive.readFile(path)
      }
    }
  }
  return 'file://' + path
}

export function loadBook(book) {
  window.drive?.loadBook(book['book_title'], book['book_path'])
}
