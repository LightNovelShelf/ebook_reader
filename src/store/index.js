import Vue from 'vue'
import Vuex from 'vuex'
import readModule from './read'
import bookModule from './book'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    read: readModule,
    book: bookModule
  }
})
