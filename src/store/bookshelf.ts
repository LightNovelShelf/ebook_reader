import { defineStore } from 'pinia'
import { toRaw } from 'vue'
import { BookCard, BookData } from '@/types/bookCard'
import bookshelfMockData from '@/assets/data/bookshelf.json'
import localforage from 'localforage'

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
    async addBook(id: string, book: BookData) {
      this.bookList.unshift({ type: 'BookCard', id, data: book })
      await localforage.setItem('bookshelf', toRaw(this.bookList))
    },
    async init() {
      this.bookList = (await localforage.getItem('bookshelf')) || (bookshelfMockData as BookCard[])
    },
    hasBook(path: string) {
      const index = this.bookList.findIndex((item: BookCard) => {
        if (item.type === 'BookCard' && item.data.path === path) return true
        if (item.type === 'BookGroupCard') {
          const groupIndex = item.data.findIndex((subItem) => subItem.path === path)
          if (groupIndex !== -1) return true
        }
        return false
      })
      return index !== -1
    }
  }
})
