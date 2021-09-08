import { defineStore } from 'pinia'
import Epub85, { Book as Book85, Rendition as Rendition85, EpubCFI as EpubCFI85 } from 'epubjs85'
import { RenditionOptions as RenditionOptions85 } from 'epubjs85/types/rendition'
// import EpubLast from 'epubjs'
import { Book, Rendition, EpubCFI } from 'epubjs'
import { RenditionOptions } from 'epubjs/types/rendition'

export const useReadStore = defineStore('app.read', {
  state: () => ({
    book: null as null | Book | Book85,
    rendition: null as null | Rendition | Rendition85
  }),
  actions: {
    loadEpub(bookUrlOrData: string | BinaryType): Promise<Book85 | Book> {
      if (typeof bookUrlOrData === 'string') {
        this.book = Epub85(bookUrlOrData)
        return this.book.opened
      } else {
        this.book = new Book()
        return this.book.openEpub(bookUrlOrData)
      }
    },
    getRendition(option: RenditionOptions | RenditionOptions85) {
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
      return this.rendition!.next()
    }
  }
})
