import { Storage } from '@/util/storage'

const EBookReader_EPUBJS_Version = 'EBookReader_EPUBJS_Version'

export default {
  namespaced: true,
  state: {
    epubJsVersion: Storage.read(EBookReader_EPUBJS_Version) || '85.chinese'
  },
  getters: {},
  mutations: {
    updateEpubJsVersion(state, value) {
      state.epubJsVersion = value
      Storage.write(EBookReader_EPUBJS_Version, value)
    }
  },
  actions: {},
  modules: {}
}
