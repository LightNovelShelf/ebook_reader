import { Storage } from '@/util/storage'
import { trimStr, formatDate, guid } from '../../util'
import { MOCK_DATA } from '../mockData'
import store from '../index'
import md5 from 'md5'
import Vue from 'vue'

const LOCAL_BOOK_LIST_KEY = 'EBookReader_BOOK'

export default {
  namespaced: true,
  state: {
    bookList: Storage.read(LOCAL_BOOK_LIST_KEY) || [...MOCK_DATA],
    coverCache: {}
  },
  getters: {
    localBookExist: (state, getters) => {
      return getters.allGroup.length > 0 || getters.allList.length > 0
    },
    hasGroup: (state, getters) => {
      return (gid) => {
        if (gid === null) return true
        return !!state.bookList.find((item) => item.gid === gid)
      }
    },
    groupTitleExist: (state, getters) => {
      return (title, gid) => {
        let str = trimStr(title)
        if (str.length === 0) return true
        return !!state.bookList.find((item) => item.gid !== gid && item.book_title === str)
      }
    },
    cacheTitleExist: (state, getters) => {
      return (title, gid) => {
        let str = trimStr(title)
        if (str.length === 0) return true
        return (
          !!getters.allGroup.find((item) => item.gid !== gid && item.data.title === str) ||
          !!state.bookListCache.find((item) => !item.bid && item.gid !== gid && item.data.title === str)
        )
      }
    },
    hasBook: (state, getters) => {
      return (book_path) => {
        return !!state.bookList.find((item) => {
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
        return state.bookList.find((item) => item.gid === gid)
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
      state.bookList = payload || []
      Storage.write(LOCAL_BOOK_LIST_KEY, state.bookList)
    },
    updateCoverCache(state, payload) {
      Vue.set(state.coverCache, payload.name, payload.data)
    }
  },
  actions: {
    addBookGroup({ commit, getters, state  }, payload) {
      if (!getters.groupTitleExist(payload.group_name)) {
        let newList = [payload, ...state.bookList]
        commit('book/updateBookList', newList)
        return true
      } else {
        return false
      }
    },
    removeBookGroup({ commit, getters }, payload) {
      if (!Array.isArray(payload)) {
        payload = [payload]
      }
      let newList = getters.allGroup.filter((item) => !payload.find((p) => p.gid === item.gid))
      commit('book/updateBookGroup', newList)
      return true
    },
    updateBookGroup({ commit, getters }, payload) {
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
      commit('book/updateBookGroup', newList)
      return true
    },
    addToBook({ commit, getters, state  }, payload) {
      let newList = [payload, ...state.bookList]
      commit('book/updateBookList', newList)
      return true
    },
    removeFromBook({ commit, getters }, payload) {
      if (!Array.isArray(payload)) {
        payload = [payload]
      }
      let newList = getters.allList.filter((item) => !payload.find((p) => p.bid === item.bid))
      commit('book/updateBookList', newList)
      return true
    },
    saveBookList({ state }) {
      Storage.write(LOCAL_BOOK_LIST_KEY, state.bookList)
    }
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
window.addToBook = function (path, name, progress) {
  if (store.getters.hasBook(path)) return
  const time = new Date()
  const temp = {
    book_title: name,
    book_path: path,
    add_time: `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`,
    book_cover: md5(path),
    read_progress: progress
  }
  store.dispatch('book/addToBook', temp)
}

window.addToBooks = function (name, data) {
  let payload = {}
  payload.gid = guid()
  payload.group_name = name
  payload.data = JSON.parse(data)
  store.dispatch('book/addBookGroup', payload)
}

window.readFileResult = function (resultCode, name, data) {
  switch (resultCode) {
    case 1: {
      store.commit('book/updateCoverCache', { name: name, data: 'data:image/jpeg;base64,' + data })
      break
    }
  }
}
