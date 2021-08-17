import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentCrumbs: [],
    currentUser: {
      avatar: '',
      name: 'admin'
    }
  },
  getters: {
    getCurrentCrumbs: state => {
      return state.currentCrumbs
    },
    getCurrentUser: state => {
      return state.currentUser
    }
  },
  mutations: {
    UPDATE_CURRENT_CRUMBS: (state, value) => {
      state.currentCrumbs = value
    }
  },
  actions: {

  }
})
