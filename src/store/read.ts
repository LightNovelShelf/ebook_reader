import { defineStore } from 'pinia'
import { default as Epub85 } from 'epubjs85'
// 后续让用户选择时需要
import { default as EpubLast } from 'epubjs'
import { Book as BookLast } from 'epubjs'
import { Book, Rendition, RenditionOptions } from './epubjs'

export const useReadStore = defineStore('app.read', {
  state: () => ({
    book: undefined as undefined | Book,
    rendition: undefined as undefined | Rendition
  }),
  actions: {
    loadEpub(bookUrlOrData: string | BinaryType): Promise<Book> {
      if (typeof bookUrlOrData === 'string') {
        this.book = Epub85(bookUrlOrData)
        return this.book.opened
      } else {
        this.book = new BookLast()
        return this.book.openEpub(bookUrlOrData)
      }
    },
    getRendition(option?: RenditionOptions) {
      this.rendition = this.book!.renderTo('read', option)
      return this.rendition
    },
    display(cfi?: string | number) {
      // @ts-ignore
      return this.rendition!.display(cfi)
    },
    nextPage() {
      console.log('下一页')
      return this.rendition!.next()
    },
    prevPage() {
      console.log('上一页')
      return this.rendition!.prev()
    }
  }
})
