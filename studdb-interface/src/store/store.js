import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    server: 'http://127.0.0.1:5000',
    students: [],
    classes: [],
  },
  getters: {
    students(state) {
      return state.students;
    },
  },
  mutations: {
    // Sets user from the payload (Loggs him in)
    setUser(state, payload) {
      state.user = Object.assign({}, payload);
    },
    // Logs user out from the vuex session
    logUserOut(state) {
      state.user = {};
    },
    clearList(state, which) {
      state[which] = [];
    },
    SET_STUDENTS(state, payload) {
      state.students = payload.slice();
    },
  },
  actions: {
    fetchStudents(context) {
      Vue.axios.get(`${context.state.server}/api/student/all`)
      .then((resp) => {
        if (resp.data.success) {
          context.commit('SET_STUDENTS', resp.data.students);
        } else {
          // TODO: Display error
          console.log(resp.message);
        }
      })
      .catch((error) => {
        // TODO: Display the error somehow
        console.log(error);
      });
    },
  },
});
