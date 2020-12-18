import Vue from 'vue'
import Vuex from 'vuex'
import readModule from './read'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    read: readModule
  }
})
