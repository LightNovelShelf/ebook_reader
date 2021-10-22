import { defineStore } from 'pinia'
import { toRaw } from 'vue'
// import { default as Epub85 } from 'epubjs85'
import EpubCFI from 'epubjs/src/epubcfi'
// 后续让用户选择时需要
import { default as EpubLast } from 'epubjs'
import { Book as BookLast } from 'epubjs'
import { Book, Rendition, RenditionOptions, PackagingMetadataObject, NavItem, Contents } from '@/types/epubjs'
import localforage from 'localforage'
import { getCache, setCache } from '@/utils/localforage'

export const useReadStore = defineStore('app.read', {
  state: () => ({
    book: undefined as undefined | Book,
    bookId: '',
    rendition: undefined as undefined | Rendition,
    cover: '',
    metadata: {} as PackagingMetadataObject,
    toc: undefined as undefined | Array<any>,
    // 当前章节位置
    section: {
      // 当前位置对于toc对象的位置
      index: 0,
      // 当前章节的总页数
      pageTotal: 0,
      // 现在阅读的页数
      pageIndex: 0
    },
    changeSection: false
  }),
  actions: {
    loadEpub(bookUrlOrData: string | ArrayBuffer, bookId?: string): Promise<Book> {
      // 每本书一个id，不同书但id相同会导致无法找到目录等情况
      if (typeof bookUrlOrData === 'string') {
        this.bookId = 'EbookReader_Book_' + (bookId || bookUrlOrData)
        this.book = EpubLast(bookUrlOrData)
      } else {
        this.bookId = 'EbookReader_Book_' + (bookId || '')
        this.book = new BookLast()
        this.book.open(bookUrlOrData)
      }
      return this.book.opened.then(async (book) => {
        // 加载书籍信息并保存
        const info = (await localforage.getItem(this.bookId)) as Record<string, unknown>

        if (info && info.cover) {
          this.cover = info.cover as string
        } else {
          book.loaded.cover.then(async (cover) => {
            this.cover = cover
            await setCache(this.bookId, 'cover', cover)
          })
        }

        if (info && info.metadata) {
          this.metadata = info.metadata as PackagingMetadataObject
        } else {
          book.loaded.metadata.then(async (metadata) => {
            this.metadata = metadata
            await setCache(this.bookId, 'metadata', metadata)
          })
        }

        // 把多级目录转换成1级目录，新增一个level属性判断级别
        if (info && info.toc) {
          this.toc = info.toc as Array<any>
        } else {
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
            await setCache(this.bookId, 'toc', toc)
          })
        }

        return book
      })
    },
    getRendition(option?: RenditionOptions) {
      this.rendition = this.book!.renderTo('read', option)
      this.rendition.on('locationChanged', (location: any) => {
        // console.log(location)
        this.saveLocation(this.rendition?.location)
      })
      // 渲染的时候遍历toc，记录每个章节的cfi地址
      this.rendition.hooks.content.register(async (contents: Contents) => {
        const match = contents.cfiBase.match(/\[(.*?)\]/)
        if (match) {
          const baseName = match[1]
          this.toc?.forEach((navItem: any) => {
            if (navItem.href.indexOf(baseName) !== -1) {
              const href = navItem.href.match(/\/(.*?)$/)[1]
              const id = href.replace(/^([^#]*)#?(.*)$/, '$2')
              if (id) {
                //得到每个目录的cfi地址
                const node = contents.document.getElementById(id)
                if (node) {
                  const cfi = new EpubCFI(node, contents.cfiBase)
                  navItem.cfi = cfi.toString()
                }
              } else if (href === baseName) {
                // 完全一样取开头
                const cfi = new EpubCFI(contents.document.body.firstChild, contents.cfiBase)
                navItem.cfi = cfi.toString()
              }
            }
          })
          await setCache(this.bookId, 'toc', toRaw(this.toc))
        }
      })
      return this.rendition
    },
    display(cfi?: string | number) {
      return this.rendition!.display(`${cfi}`)
    },
    // 保存进度并刷新当前章节位置,一般来说无需手动调用
    async saveLocation(location?: any) {
      const currentLocation = location || (this.rendition!.currentLocation() as any) // 这里默认给出的类型不对
      if (currentLocation && currentLocation.start) {
        const cfiLocation = currentLocation.start
        const temp = [] as Array<number>
        this.toc?.forEach((navItem: any, index: number) => {
          if (navItem.href === cfiLocation.href) {
            temp.push(index)
          } else {
            if (navItem.cfi) {
              const cfi_a = new EpubCFI(navItem.cfi)
              const cfi_b = new EpubCFI(cfiLocation.cfi)
              if (cfi_a.compare(cfi_b, cfi_a) != -1) {
                temp.push(index)
              }
            }
          }
        })
        // 把所有位置比当前位置小的都记录下来，然后取最大的
        if (this.changeSection) {
          this.changeSection = false
        } else {
          this.section.index = Math.max(...temp)
        }
        this.section.pageIndex = cfiLocation.displayed.page
        this.section.pageTotal = cfiLocation.displayed.total

        await setCache(this.bookId, 'location', cfiLocation.cfi)
      }
    },
    // 获取进度
    async getLocation(bookId?: string) {
      const key = bookId ? `book_${bookId}` : this.bookId
      return (await getCache(key, 'location')) as string | undefined
    },
    // TODO 内部添加节流
    nextPage() {
      console.log('下一页')
      return this.rendition!.next()
    },
    nextSection() {
      console.log('下一章')

      if (this.toc) {
        if (this.section.index === this.toc.length - 1) {
          // 已经最后了
          return
        } else {
          this.changeSection = true
          this.section.index++
          this.display(this.toc[this.section.index].href)
        }
      }
    },
    prevPage() {
      console.log('上一页')
      return this.rendition!.prev()
    },
    prevSection() {
      console.log('上一章')
      if (this.toc) {
        if (this.section.index === 0) {
          // 已经最前了
          return
        } else {
          this.changeSection = true
          this.section.index--
          this.display(this.toc[this.section.index].href)
        }
      }
    }
  }
})
