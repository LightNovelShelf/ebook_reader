import { defineStore } from 'pinia'
import { HubConnection } from '@microsoft/signalr'
import Epub85 from '@/assets/js/epub.85'
import EpubLast from '@/assets/js/epub.last'
import EpubCFI from 'epubjs/src/epubcfi'

export const useReadStore = defineStore('app.read', {
  state: () => ({
    book: null
  }),
  actions: {
    loadEpub(bookData) {
      if (Object.prototype.toString.call(bookData) === '[object String]') {
        return new Promise((resolve, reject) => {
          this.book = new Epub85(bookData)
          resolve()
        })
      } else {
        this.book = new Epub85()
        return this.book.open(bookData).then(() => {})
      }
    }
  }
})
