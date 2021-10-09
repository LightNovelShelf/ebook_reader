import { defineStore } from 'pinia'
import { BookList } from '@/types/bookCard'
import bookshelfMockData from '@/assets/data/bookshelf.json'

export const useBookshelfStore = defineStore('app.bookshelf', {
  state: () => ({
    bookList: bookshelfMockData as BookList
  })
})
