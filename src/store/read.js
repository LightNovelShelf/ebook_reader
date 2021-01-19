import { saveReadProgress, StatusBarHeight } from '@/util/read'
import { getFullUrl } from '@/util'
import vuetify from '../plugins/vuetify'
import { Storage } from '@/util/storage'
import EpubCFI from 'epubjs/src/epubcfi'
import bg_paper from '@/assets/img/bg-paper.jpg'
import bg_paper_dark from '@/assets/img/bg-paper-dark.jpg'
import READ_STYLE from '@/assets/styles/read.scss'
import { createBlobUrl } from 'epubjs/src/utils/core'

const LightNovel_Reading_Bg_Setting = 'LightNovel_Reading_Bg_Setting'
const LightNovel_Reading_Bg_Custom = 'LightNovel_Reading_Bg_Custom'
const Reading_FontSize = 'Reading_FontSize'

export default {
  state: {
    book: null,
    rendition: null,
    bookName: null,
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
    fontSize: Storage.read(Reading_FontSize) || 16,
    readingCustomBg: Storage.read(LightNovel_Reading_Bg_Custom) || null,
    readingBgSetting: Storage.read(LightNovel_Reading_Bg_Setting) || 'none'
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
    bgSettingShow(state) {
      return state.bgSettingShow
    },
    bookAvailable(state) {
      return state.bookAvailable
    },
    navigation(state) {
      return state.navigation
    },
    readingCustomBg(state) {
      return state.readingCustomBg
    },
    readingBgSetting(state) {
      return state.readingBgSetting
    }
  },
  mutations: {
    updateBookName(state, value) {
      state.bookName = value
    },
    updateFontSize(state, value) {
      state.fontSize = value
      state.book.rendition.themes.fontSize(value + 'px')
      Storage.write(Reading_FontSize, value)
    },
    updateFontSettingShow(state, value) {
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
    updateMenuShow(state, value) {
      state.menuShow = value
    },
    updateBgSettingShow(state, value) {
      state.bgSettingShow = value
    },
    updateSidebarShow(state, value) {
      state.sidebarShow = value
    },
    updateReadingCustomBg(state, { value = null }) {
      state.readingCustomBg = value
      setBg(state)
      Storage.write(LightNovel_Reading_Bg_Custom, value)
    },
    updateReadingBgSetting(state, { setting = 'none' }) {
      state.readingBgSetting = setting
      setBg(state)
      Storage.write(LightNovel_Reading_Bg_Setting, setting)
      // loadBg(state.book.rendition.themes)
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
    getRendition({ commit, state }, { element, option }) {
      let inserRules = `@import url('${getFullUrl(READ_STYLE)}');
body{
--read-padding: ${StatusBarHeight + 20}px;
font-size: ${state.fontSize}px;
}`
      option.stylesheet = createBlobUrl(inserRules, 'text/css')
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
      const color = computeFontColor(r, g, b) === 'light' ? 'rgba(255,255,255,0.7)' : ''
      state.rendition.themes.override('--color', color)
      document.documentElement.style.setProperty('--bg-img', `rgba(${r},${g},${b},${a})`)
      break
    }
    case 'paper':
      document.documentElement.style.setProperty(
        '--bg-img',
        `url(${vuetify.framework.theme.dark ? bg_paper_dark : getFullUrl(bg_paper)}) repeat`
      )
      state.rendition.themes.override('--color', vuetify.framework.theme.dark ? 'rgba(255,255,255,0.7)' : '')
      break
    default:
      state.rendition.themes.override('--color', '')
      document.documentElement.style.setProperty('--bg-img', '')
  }
}
