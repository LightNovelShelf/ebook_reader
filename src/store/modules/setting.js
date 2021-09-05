import { Storage } from '@/util/storage'

const EBookReader_EPUBJS_Version = 'EBookReader_EPUBJS_Version'
const EBookReader_EPUBJS_Manager = 'EBookReader_EPUBJS_Manager'
const EBookReader_EPUBJS_Flow = 'EBookReader_EPUBJS_Flow'

export default {
  namespaced: true,
  state: {
    epubJsVersion: Storage.read(EBookReader_EPUBJS_Version) || '85.chinese',
    epubJsManager: Storage.read(EBookReader_EPUBJS_Manager) || 'continuous',
    epubJsFlow: Storage.read(EBookReader_EPUBJS_Flow) || 'none'
  },
  getters: {},
  mutations: {
    updateEpubJsVersion(state, value) {
      state.epubJsVersion = value
      Storage.write(EBookReader_EPUBJS_Version, value)
    },
    updateEpubJsManager(state, value) {
      state.epubJsManager = value
      Storage.write(EBookReader_EPUBJS_Manager, value)
    },
    updateEpubJsFlow(state, value) {
      state.epubJsFlow = value
      Storage.write(EBookReader_EPUBJS_Flow, value)
    }
  },
  actions: {},
  modules: {}
}
