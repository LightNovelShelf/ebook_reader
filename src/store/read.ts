import { defineStore } from 'pinia'
import Epub85, { Book as Book85 } from 'epubjs85'
// import EpubLast from 'epubjs'
import { Book } from 'epubjs'

export const useReadStore = defineStore('app.read', {
  state: () => ({
    book: null as null | Book | Book85
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
    }
  }
})
