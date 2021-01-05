import { Storage } from '@/util/storage'
import { trimStr, formatDate, guid } from '../util/index'
import { BookList } from './mockData'
import store from './index'
import md5 from 'md5'
import { toByteArray } from 'base64-js'
import Epub from 'epubjs'
import Vue from 'vue'

const LOCAL_BOOK_LIST_KEY = 'EBookReader_BOOK'

export default {
  state: {
    list: Storage.read(LOCAL_BOOK_LIST_KEY) || [],
    coverCache: {}
  },
  getters: {
    localBookExist: (state, getters) => {
      return getters.allGroup.length > 0 || getters.allList.length > 0
    },
    BookList: (state) => {
      return state.list
    },
    hasGroup: (state, getters) => {
      return (gid) => {
        if (gid === null) return true
        return !!getters.BookList.find((item) => item.gid === gid)
      }
    },
    groupTitleExist: (state, getters) => {
      return (title, gid) => {
        let str = trimStr(title)
        if (str.length === 0) return true
        return !!getters.BookList.find((item) => item.gid !== gid && item.book_title === str)
      }
    },
    cacheTitleExist: (state, getters) => {
      return (title, gid) => {
        let str = trimStr(title)
        if (str.length === 0) return true
        return (
          !!getters.allGroup.find((item) => item.gid !== gid && item.data.title === str) ||
          !!getters.BookListCache.find((item) => !item.bid && item.gid !== gid && item.data.title === str)
        )
      }
    },
    hasBook: (state, getters) => {
      return (book_path) => {
        return !!getters.BookList.find((item) => {
          if (item.gid) {
            return !!item.data.find((subItem) => subItem.book_path === book_path)
          }
          return item.book_path === book_path
        })
      }
    },
    findBook: (state, getters) => {
      return (book_path) => {
        return getters.allList.find((item) => item.book_path === book_path)
      }
    },
    findGroup: (state, getters) => {
      return (gid) => {
        return getters.BookList.find((item) => item.gid === gid)
      }
    },
    mapList: (state, getters) => {
      return (list) => {
        return {
          list: getters.allList.filter(
            (item) => !!list.find(({ bid, gid }) => item.bid === bid || (!bid && item.gid === gid))
          ),
          group: getters.allGroup.filter((item) => !!list.find(({ bid, gid }) => !bid && item.gid === gid))
        }
      }
    },
    coverCache: (state) => {
      return state.coverCache
    }
  },
  mutations: {
    updateBookList(state, payload) {
      state.list = payload || []
      Storage.write(LOCAL_BOOK_LIST_KEY, state.list)
    },
    updateCoverCache(state, payload) {
      Vue.set(state.coverCache,payload.name,payload.data)
    }
  },
  actions: {
    addBookGroup({ commit, getters, dispatch }, payload) {
      if (!getters.groupTitleExist(payload.group_name)) {
        let newList = [payload, ...getters.BookList]
        commit('updateBookList', newList)
        return true
      } else {
        return false
      }
    },
    removeBookGroup({ commit, getters, dispatch }, payload) {
      if (!Array.isArray(payload)) {
        payload = [payload]
      }
      let newList = getters.allGroup.filter((item) => !payload.find((p) => p.gid === item.gid))
      commit('updateBookGroup', newList)
      return true
    },
    updateBookGroup({ commit, getters, dispatch }, payload) {
      if (!Array.isArray(payload)) {
        payload = [payload]
      }
      let newList = getters.allGroup.map((item) => {
        let find = payload.find((p) => p.gid === item.gid)
        return find && !getters.groupTitleExist(find.data.title, find.gid)
          ? {
              ...item,
              ...find,
              last_update_time: formatDate(new Date(), 'yyyy-MM-dd hh:mm:sss'),
              data: {
                ...item.data,
                ...find.data
              }
            }
          : item
      })
      commit('updateBookGroup', newList)
      return true
    },
    addToBook({ commit, getters, dispatch }, payload) {
      let newList = [payload, ...getters.BookList]
      commit('updateBookList', newList)
      return true
    },
    removeFromBook({ commit, getters, dispatch }, payload) {
      if (!Array.isArray(payload)) {
        payload = [payload]
      }
      let newList = getters.allList.filter((item) => !payload.find((p) => p.bid === item.bid))
      commit('updateBookList', newList)
      return true
    },
    updateBook({ commit, getters, dispatch }, payload) {
      if (!Array.isArray(payload)) {
        payload = [payload]
      }
      let newList = getters.allList.map((item) => {
        let find = payload.find((p) => p.bid === item.bid)
        return find && getters.hasGroup(find.gid)
          ? {
              ...item,
              last_update_time: formatDate(new Date(), 'yyyy-MM-dd hh:mm:sss'),
              ...find,
              data: {
                ...item.data,
                ...find.data
              }
            }
          : item
      })
      commit('updateBookList', newList)
      return true
    },
  }
}

function sortBook(a, b) {
  let aIdx = a.idx || 0
  let bIdx = b.idx || 0
  if (aIdx > bIdx) {
    return 1
  } else if (aIdx < bIdx) {
    return -1
  } else {
    return a.last_update_time > b.last_update_time ? -1 : 1
  }
}

//暴露出函数给原生调用
window.addToBook = function (path, name) {
  if (store.getters.hasBook(path)) return
  const time = new Date()
  const temp = {
    book_title: name,
    book_path: path,
    add_time: `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`,
    book_cover: md5(name)
  }
  store.dispatch('addToBook', temp)
}

window.addToBooks = function (name, data) {
  let payload = {}
  payload.gid = guid()
  payload.group_name = name
  payload.data = JSON.parse(data)
  store.dispatch('addBookGroup', payload)
}

window.readFileResult = function (resultCode, name, data) {
  switch (resultCode) {
    // getImagePath2中读取EPUB
    case 0: {
      data = toByteArray(data)
      let book = new Epub()
      book.open(data.buffer).then(async () => {
        let cover = await book.loaded.cover
        let coverData = await book.archive.getBase64(cover || '/OEBPS/Images/cover.jpg')
        // let coverData = await book.archive.getBase64(cover)
        new Promise(function () {
          device.saveFile(name, 'Pictures', coverData)
        })
        store.commit('updateCoverCache', { name: name, data: coverData })
      })
      break
    }
    // getImagePath2中读取封面
    case 1: {
      store.commit('updateCoverCache', { name: name, data: 'data:image/jpeg;base64,' + data })
      break
    }
  }
}
