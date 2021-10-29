import { defineStore } from 'pinia'
import { toRaw } from 'vue'
import { BookCard, BookData, BookGroupCardData } from '@/types/bookCard'
import bookshelfMockData from '@/assets/data/bookshelf.json'
import localforage from 'localforage'
import { Guid } from 'js-guid'

export const useBookshelfStore = defineStore('app.bookshelf', {
  state: () => ({
    bookList: [] as BookCard[],
    moveFunction: undefined
  }),
  getters: {
    getBookList: (state) => {
      return (id) => {
        if (id) {
          return state.bookList.find((item: BookCard) => item.type === 'BookGroupCard' && item.id === id)
        } else {
          return state.bookList
        }
      }
    }
  },
  actions: {
    async init() {
      this.bookList = (await localforage.getItem('bookshelf')) || (bookshelfMockData as BookCard[])
    },
    async saveData() {
      await localforage.setItem('bookshelf', toRaw(this.bookList))
    },
    async addBook(id: string, book: BookData) {
      this.bookList.unshift({ type: 'BookCard', id, data: book })
      await this.saveData()
    },
    async addBookGroup(groupName: string, data: BookData[]) {
      const group: BookGroupCardData = this.bookList.find(
        (item: BookCard): item is BookGroupCardData => item.type === 'BookGroupCard' && item.groupName === groupName
      )
      if (group) {
        group.data = group.data.concat(data)
      } else {
        const id = Guid.newGuid().toString()
        this.bookList.push({ type: 'BookGroupCard', id, data, groupName })
      }
      await this.saveData()
    },
    async moveToFirst(book: BookData) {
      let index = this.bookList.findIndex((item: BookCard) => {
        return item.type === 'BookCard' && item.data === book
      })
      if (index > 0) {
        // 单本
        const temp = this.bookList[index]
        this.bookList.splice(index, 1)
        this.bookList.splice(0, 0, temp)
        await this.saveData()
        return
      }

      let subIndex = -1
      index = this.bookList.findIndex((item: BookCard) => {
        if (item.type === 'BookGroupCard') {
          subIndex = item.data.findIndex((subItem) => subItem === book)
          if (subIndex !== -1) return true
        }
        return false
      })

      if (index > 0) {
        const temp = this.bookList[index]
        this.bookList.splice(index, 1)
        this.bookList.splice(0, 0, temp)
      }
      if (subIndex > 0) {
        const temp = this.bookList[0].data[subIndex]
        // @ts-expect-error
        this.bookList[0].data.splice(subIndex, 1)
        // @ts-expect-error
        this.bookList[0].data.splice(0, 0, temp)
      }

      if (index > 0 || subIndex > 0) await this.saveData()
    },
    getBookByPath(path: string): BookData {
      let data = null
      this.bookList.find((item: BookCard) => {
        if (item.type === 'BookCard' && item.data.path === path) {
          data = item.data
        }
        if (item.type === 'BookGroupCard') {
          data = item.data.find((subItem) => subItem.path === path)
        }
        return data
      })
      return data
    }
  }
})
