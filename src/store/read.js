import { saveFontSize, saveReadProgress } from '@/util/read'
import EpubCFI from 'epubjs/src/epubcfi'

export default {
  state: {
    book: null,
    bookName: null,
    cover: null,
    navigation: null,
    metadata: null,
    bookAvailable: false,
    readProgress: 0,
    section: 1,
    menuShow: false,
    fontSettingShow: false,
    sidebarShow: false,
    fontSize: 16
  },
  getters: {
    readSection(state) {
      if (state.navigation) return state.navigation[state.section - 1]?.label
      else return state.metadata?.title
    },
    section(state) {
      return state.section
    },
    fontSize(state) {
      return state.fontSize
    },
    fontSettingShow(state) {
      return state.fontSettingShow
    },
    book(state) {
      return state.book
    },
    menuShow(state) {
      return state.menuShow
    },
    sidebarShow(state) {
      return state.sidebarShow
    },
    bookAvailable(state) {
      return state.bookAvailable
    },
    navigation(state) {
      return state.navigation
    }
  },
  mutations: {
    updateBookName(state, payload) {
      state.bookName = payload
    },
    updateFontSize(state, payload) {
      state.fontSize = payload
    },
    updateFontSettingShow(state, payload) {
      state.fontSettingShow = payload
    },
    updateBook(state, payload) {
      state.book = payload
    },
    updateCover(state, payload) {
      state.cover = payload
    },
    updateNavigation(state, payload) {
      state.navigation = payload
    },
    updateMetadata(state, payload) {
      state.metadata = payload
    },
    updateBookAvailable(state, payload) {
      state.bookAvailable = payload
    },
    updateReadProgress(state, payload) {
      state.readProgress = payload
    },
    updateSection(state, payload) {
      state.section = payload
    },
    updateMenuShow(state, payload) {
      state.menuShow = payload
    },
    updateSidebarShow(state, payload) {
      state.sidebarShow = payload
    }
  },
  actions: {
    refreshLocation({ commit, state }, [isSection, isProgress, isSave = true]) {
      const currentLocation = state.book.rendition.currentLocation()
      console.log(currentLocation)
      if (currentLocation && currentLocation.start) {
        const startCfi = currentLocation.start.cfi
        if (isSave) saveReadProgress(state.bookName, startCfi)
        if (state.bookAvailable) {
          if (isSection) {
            const endCfi = new EpubCFI(currentLocation.end.cfi)
            let temp = 0
            let flag = true
            for (let i = 0; i < state.navigation.length; ++i) {
              const navItem = state.navigation[i]
              let href = navItem.href
              if (href.indexOf('#') !== -1) href = href.split('#')[0]
              if (navItem.cfi) {
                temp = endCfi.compare(navItem.cfi, endCfi)
              } else {
                const index = state.book.spine.spineItems.findIndex((item) => item.href === href)
                if (index > endCfi.spinePos) {
                  temp = 1
                } else {
                  temp = -1
                }
              }
              if (flag) {
                flag = false
                if (temp === 1) {
                  commit('updateSection', 0)
                  break
                }
              } else {
                if (i === state.navigation.length - 1) {
                  commit('updateSection', i + 1)
                }
                if (temp === 1) {
                  commit('updateSection', i)
                  break
                }
              }
            }
          }
          if (isProgress) {
            commit('updateReadProgress', Math.floor(currentLocation.start.percentage * 1000))
          }
        }
      }
    },
    display({ commit, state }, target) {
      return state.book.rendition.display(target)
    },
    setFontSize({ commit, state }, size) {
      state.book.rendition.themes.fontSize(size + 'px')
      commit('updateFontSize', size)
      saveFontSize(size)
    }
  },
  modules: {}
}
