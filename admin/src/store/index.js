import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentCrumbs: [],
    currentUser: null
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
    },
    UPDATE_CURRENT_USER: (state, value) => {
      state.currentUser = value
    }
  },
  actions: {
    async fetchCurrentUser ({ commit }) {
      const res = await Vue.prototype.$http.get('rest/admin_users/current_user')
      if (res && res.data) {
        commit('UPDATE_CURRENT_USER', res.data)
      }
      return res.data
    }
  }
})
