import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
  },
  mutations: {
    // Sets user from the payload (Loggs him in)
    setUser(state, payload) {
      state.user = Object.assign({}, payload);
    },
    // Logs user out from the vuex session
    logUserOut(state) {
      state.user = null;
    },
  },
});
