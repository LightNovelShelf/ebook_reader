import { saveReadProgress, StatusBarHeight } from '@/util/read'
import { getFullUrl } from '@/util'
import vuetify from '../../plugins/vuetify'
import { Storage } from '@/util/storage'
import EpubCFI from 'epubjs/src/epubcfi'
import bg_paper from '@/assets/img/bg-paper.jpg'
import bg_paper_dark from '@/assets/img/bg-paper-dark.jpg'
import READ_STYLE from '@/assets/styles/read.scss'
import { createBlobUrl } from 'epubjs/src/utils/core'
import store from '../index'

const EBookReader_Reading_Bg_Setting = 'EBookReader_Reading_Bg_Setting'
const EBookReader_Reading_Bg_Custom = 'EBookReader_Reading_Bg_Custom'
const EBookReader_Reading_FontSize = 'EBookReader_Reading_FontSize'

export default {
  namespaced: true,
  state: {
    book: null,
    rendition: null,
    bookHash: null,
    cover: null,
    navigation: null,
    metadata: null,
    bookAvailable: false,
    readProgress: 0,
    section: 1,
    menuShow: false,
    fontSettingShow: false,
    bgSettingShow: false,
    sidebarShow: false,
    searchShow: false,
    fontSize: Storage.read(EBookReader_Reading_FontSize) || 16,
    readingCustomBg: Storage.read(EBookReader_Reading_Bg_Custom) || null,
    readingBgSetting: Storage.read(EBookReader_Reading_Bg_Setting) || 'none'
  },
  getters: {
    readSection(state) {
      if (state.navigation) return state.navigation[state.section - 1]?.label
      else return state.metadata?.title
    }
  },
  mutations: {
    updateBookHash(state, value) {
      state.bookHash = value
    },
    updateFontSize(state, value) {
      state.fontSize = value
      state.book.rendition.themes.fontSize(value + 'px')
      Storage.write(EBookReader_Reading_FontSize, value)
    },
    updateFontSettingShow(state, value) {
      if (window.device && state.fontSettingShow !== value) {
        pushOrPop(value, 'Font')
      }
      state.fontSettingShow = value
    },
    updateBook(state, value) {
      state.book = value
    },
    updateRendition(state, value) {
      state.rendition = value
    },
    updateCover(state, value) {
      state.cover = value
    },
    updateNavigation(state, value) {
      state.navigation = value
    },
    updateMetadata(state, value) {
      state.metadata = value
    },
    updateBookAvailable(state, value) {
      state.bookAvailable = value
    },
    updateReadProgress(state, value) {
      state.readProgress = value
    },
    updateSection(state, value) {
      state.section = value
    },
    updateSearchShow(state, value) {
      if (window.device && state.searchShow !== value) {
        pushOrPop(value, 'Search')
      }
      state.searchShow = value
    },
    updateMenuShow(state, value) {
      if (window.device && state.menuShow !== value) {
        pushOrPop(value, 'menu')
      }
      state.menuShow = value
    },
    updateBgSettingShow(state, value) {
      if (window.device && state.bgSettingShow !== value) {
        pushOrPop(value, 'Bg')
      }
      state.bgSettingShow = value
    },
    updateSidebarShow(state, value) {
      if (window.device && state.sidebarShow !== value) {
        pushOrPop(value, 'Sidebar')
      }
      state.sidebarShow = value
    },
    updateReadingCustomBg(state, { value = null }) {
      state.readingCustomBg = value
      setBg(state)
      Storage.write(EBookReader_Reading_Bg_Custom, value)
    },
    updateReadingBgSetting(state, { setting = 'none' }) {
      state.readingBgSetting = setting
      setBg(state)
      Storage.write(EBookReader_Reading_Bg_Setting, setting)
      // loadBg(state.book.rendition.themes)
    }
  },
  actions: {
    refreshLocation({ commit, state }, [isSection, isProgress, isSave = true]) {
      const currentLocation = state.book.rendition.currentLocation()
      if (currentLocation && currentLocation.start) {
        const startCfi = currentLocation.start.cfi
        if (isSave) saveReadProgress(state.bookHash, startCfi)
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
            let progress = Math.floor(currentLocation.start.percentage * 1000)
            commit('updateReadProgress', progress)
            window.device?.setProgress(progress)
          }
        }
      }
    },
    display({ commit, state }, target) {
      return state.book.rendition.display(target)
    },
    getRendition({ commit, state }, { element, option }) {
      let insertRules = `@import url('${getFullUrl(READ_STYLE)}');
body{
--read-padding: ${StatusBarHeight + 20}px;
font-size: ${state.fontSize}px;
}
`
      option.stylesheet = createBlobUrl(insertRules, 'text/css')
      let rendition = state.book.renderTo(element, option)
      commit('updateRendition', rendition)
      setBg(state)
      return rendition
    }
  },
  modules: {}
}

function computeFontColor(r, g, b) {
  let contrast = (r * 299 + g * 587 + b * 114) / 1000
  if (contrast >= 125) {
    return 'dark'
  }
  return 'light'
}

function setBg(state) {
  switch (state.readingBgSetting) {
    case 'custom': {
      let { r, g, b, a } = state.readingCustomBg
      const color = computeFontColor(r, g, b) === 'light' ? 'rgba(255,255,255,0.7)' : 'black'
      state.rendition.themes.override('--color', color)
      document.documentElement.style.setProperty('--bg-img', `rgba(${r},${g},${b},${a})`)
      break
    }
    case 'paper':
      document.documentElement.style.setProperty(
        '--bg-img',
        `url(${vuetify.framework.theme.dark ? bg_paper_dark : getFullUrl(bg_paper)}) repeat`
      )
      state.rendition.themes.override('--color', vuetify.framework.theme.dark ? 'rgba(255,255,255,0.7)' : 'black')
      break
    default:
      state.rendition.themes.override('--color', 'black')
      document.documentElement.style.setProperty('--bg-img', '')
  }
}

export function pushOrPop(value, str) {
  if (value) {
    device.push(str)
  } else {
    device.pop()
  }
}

window.back = function (str) {
  switch (str) {
    case 'menu': {
      store.commit('read/updateMenuShow', false)
      break
    }
    case 'Bg': {
      store.commit('read/updateBgSettingShow', false)
      break
    }
    case 'Sidebar': {
      store.commit('read/updateSidebarShow', false)
      break
    }
    case 'Font': {
      store.commit('read/updateFontSettingShow', false)
      break
    }
    case 'Search': {
      store.commit('read/updateSearchShow', false)
      break
    }
    case 'EpubJsSetting': {
      window.closeEpubJsSetting()
      break
    }
    default:
      break
  }
}
