import { defineStore } from 'pinia'
import { toRaw } from 'vue'
import { BookCard, BookData, BookGroupCardData } from '@/types/bookCard'
import bookshelfMockData from '@/assets/data/bookshelf.json'
import localforage from 'localforage'
import { Guid } from 'js-guid'

export const useBookshelfStore = defineStore('app.bookshelf', {
  state: () => ({
    bookList: [] as BookCard[]
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
        (item: BookCard) => item.type === 'BookGroupCard' && item.groupName === groupName
      )
      if (group) {
        group.data = group.data.concat(data)
      } else {
        const id = Guid.newGuid().toString()
        this.bookList.push({ type: 'BookGroupCard', id, data, groupName })
      }
      await this.saveData()
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
