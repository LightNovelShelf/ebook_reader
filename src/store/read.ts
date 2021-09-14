import { defineStore } from 'pinia'
import { default as Epub85 } from 'epubjs85'
// 后续让用户选择时需要
// import { default as EpubLast } from 'epubjs'
import { Book as BookLast } from 'epubjs'
import { Book, Rendition, RenditionOptions } from '../types/epubjs'
import localforage from 'localforage'

export const useReadStore = defineStore('app.read', {
  state: () => ({
    book: undefined as undefined | Book,
    bookId: '',
    rendition: undefined as undefined | Rendition
  }),
  actions: {
    loadEpub(bookUrlOrData: string | ArrayBuffer, bookId?: string): Promise<Book> {
      if (typeof bookUrlOrData === 'string') {
        this.bookId = bookId || bookUrlOrData
        this.book = Epub85(bookUrlOrData)
      } else {
        this.bookId = bookId || ''
        this.book = new BookLast()
        this.book.open(bookUrlOrData)
      }
      return this.book.opened
    },
    getRendition(option?: RenditionOptions) {
      this.rendition = this.book!.renderTo('read', option)
      this.rendition.hooks.render.register(this.saveLocation)
      return this.rendition
    },
    display(cfi?: string | number) {
      // @ts-ignore
      return this.rendition!.display(cfi)
    },
    // 保存进度
    async saveLocation() {
      const currentLocation = this.rendition!.currentLocation() as any // 这里默认给出的类型不对
      if (currentLocation && currentLocation.start) {
        const key = `book_${this.bookId}`
        const info = ((await localforage.getItem(key)) as Record<string, unknown>) || {}
        info.location = currentLocation.start.cfi
        await localforage.setItem(key, info)
      }
    },
    // 获取进度
    async getLocation(bookId?: string) {
      const key = `book_${bookId || this.bookId}`
      const info = ((await localforage.getItem(key)) as Record<string, unknown>) || {}
      if (info) return info.location as string
      return undefined
    },
    nextPage() {
      console.log('下一页')
      return this.rendition!.next().then(this.saveLocation)
    },
    prevPage() {
      console.log('上一页')
      return this.rendition!.prev().then(this.saveLocation)
    }
  }
})
