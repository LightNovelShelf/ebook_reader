import { defineStore } from 'pinia'
import { default as Epub85 } from 'epubjs85'
// 后续让用户选择时需要
// import { default as EpubLast } from 'epubjs'
import { Book as BookLast } from 'epubjs'
import { Book, Rendition, RenditionOptions, PackagingMetadataObject, NavItem } from '../types/epubjs'
import localforage from 'localforage'
import { getCache, setCache } from '@/utils/localforage'

export const useReadStore = defineStore('app.read', {
  state: () => ({
    book: undefined as undefined | Book,
    bookId: '',
    rendition: undefined as undefined | Rendition,
    cover: '',
    metadata: {} as PackagingMetadataObject,
    toc: {} as any
  }),
  actions: {
    loadEpub(bookUrlOrData: string | ArrayBuffer, bookId?: string): Promise<Book> {
      // 每本书一个id，不同书但id相同会导致无法找到目录等情况
      if (typeof bookUrlOrData === 'string') {
        this.bookId = bookId || bookUrlOrData
        this.book = Epub85(bookUrlOrData)
      } else {
        this.bookId = bookId || ''
        this.book = new BookLast()
        this.book.open(bookUrlOrData)
      }
      return this.book.opened.then(async (book) => {
        // 加载书籍信息并保存
        const key = `book_${this.bookId}`
        // const info = (await localforage.getItem(key)) as Record<string, unknown>

        book.loaded.cover.then(async (cover) => {
          this.cover = cover
          await setCache(key, 'cover', cover)
        })

        book.loaded.metadata.then(async (metadata) => {
          this.metadata = metadata
          await setCache(key, 'metadata', metadata)
        })
        // 把多级目录转换成1级目录，新增一个level属性判断级别
        book.loaded.navigation.then(async (nav) => {
          function flatten(array: NavItem[]): any {
            return [].concat(...array.map((item: any) => [].concat(item, ...flatten(item.subitems))))
          }
          const navItem = flatten(nav.toc)
          function find(item: NavItem, levle = 0): any {
            return !item.parent
              ? levle
              : find(navItem.filter((parentItem: NavItem) => parentItem.id === item.parent)[0], ++levle)
          }
          const basePath = book.packaging.navPath ? book.packaging.navPath.split('/') : false
          const toc = navItem.map((item: any) => {
            const obj = { ...item }
            obj.level = find(obj)
            obj.label = obj.label.trim()
            if (basePath) {
              if (obj.href.startsWith('#')) {
                obj.href = book.packaging.navPath + obj.href
              } else {
                basePath[basePath.length - 1] = obj.href
                obj.href = basePath.join('/')
              }
            }
            return obj
          })
          this.toc = toc
          await setCache(key, 'toc', toc)
        })
        return book
      })
    },
    getRendition(option?: RenditionOptions) {
      this.rendition = this.book!.renderTo('read', option)
      this.rendition.on('locationChanged', (location: any) => {
        // console.log(location)
        this.saveLocation(this.rendition?.location)
      })
      return this.rendition
    },
    display(cfi?: string | number) {
      // @ts-ignore
      return this.rendition!.display(cfi)
    },
    // 保存进度
    async saveLocation(location?: any) {
      // console.log('saveLocation')
      const currentLocation = location || (this.rendition!.currentLocation() as any) // 这里默认给出的类型不对
      if (currentLocation && currentLocation.start) {
        const key = `book_${this.bookId}`
        await setCache(key, 'location', currentLocation.start.cfi)
      }
    },
    // 获取进度
    async getLocation(bookId?: string) {
      const key = `book_${bookId || this.bookId}`
      return (await getCache(key, 'location')) as string | null
    },
    nextPage() {
      console.log('下一页')
      return this.rendition!.next()
    },
    nextSection() {
      console.log('下一章')
      return this.rendition!.next()
    },
    prevPage() {
      console.log('上一页')
      return this.rendition!.prev()
    }
  }
})
