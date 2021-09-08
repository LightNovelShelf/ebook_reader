import { defineStore } from 'pinia'
import Epub85, { Book as Book85, Rendition as Rendition85 } from 'epubjs85'
import { RenditionOptions as RenditionOptions85 } from 'epubjs85/types/rendition'
// import EpubLast from 'epubjs'
import { Book, Rendition } from 'epubjs'
import { RenditionOptions } from 'epubjs/types/rendition'

export const useReadStore = defineStore('app.read', {
  state: () => ({
    book: null as null | Book | Book85,
    rendition: null as null | Rendition | Rendition85
  }),
  actions: {
    loadEpub(bookUrlOrData: string | BinaryType): Promise<Book85 | Book> {
      if (typeof bookUrlOrData == 'string') {
        this.book = Epub85(bookUrlOrData)
        return this.book.opened
      } else {
        this.book = new Book()
        return this.book.openEpub(bookUrlOrData)
      }
    },
    getRendition(option: RenditionOptions | RenditionOptions85) {
      return this.book!.renderTo('read', option)
    }
  }
})
