import Vuex from 'vuex';
import Vue from 'vue';
import showError from '@/assets/js/globalError';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    server: 'http://127.0.0.1:5000',
    students: [],
    classes: [],
    parents: [],
    professors: [],
  },
  getters: {
    students(state) {
      return state.students;
    },
    parents(state) {
      return state.parents;
    },
    professors(state) {
      return state.professors;
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
    // Saves the students from the passed-in payload into the global storage
    SET_STUDENTS(state, payload) {
      state.students = payload.slice();
    },
    // Saves the parents from the passed-in payload into the global storage
    SET_PARENTS(state, payload) {
      state.parents = payload.slice();
    },
    // Saves the parents from the passed-in payload into the global storage
    SET_PROFESSORS(state, payload) {
      state.professors = payload.slice();
    },
  },
  actions: {
    // Fetches students from the server
    fetchStudents(context, payload) {
      let url;

      // This is because first I fetch just a few parents so the loading feels instant and then I fetch the rest
      if (payload !== undefined && 'first' in payload) {
        url = `${context.state.server}/api/student/all?first=${payload.first}`;
      } else {
        url = `${context.state.server}/api/student/all`;
      }

      Vue.axios.get(url)
      .then((resp) => {
        if (resp.data.success) {
          context.commit('SET_STUDENTS', resp.data.students);
        } else {
          showError(resp.data.message);
        }
      })
      .catch((error) => {
        showError(error);
      });
    },
    // Fetches parents from the server
    fetchParents(context, payload) {
      let url;

      // This is because first I fetch just a few parents so the loading feels instant and then I fetch the rest
      if (payload !== undefined && 'first' in payload) {
        url = `${context.state.server}/api/parent/all?first=${payload.first}`;
      } else {
        url = `${context.state.server}/api/parent/all`;
      }

      Vue.axios.get(url)
      .then((resp) => {
        if (resp.data.success) {
          context.commit('SET_PARENTS', resp.data.parents);
        } else {
          showError(resp.data.message);
        }
      })
      .catch((error) => {
        showError(error);
      });
    },
    // Fetches all the professors from the API
    fetchProfessors(context, payload) {
      let url;

      // This is because first I fetch just a few parents so the loading feels instant and then I fetch the rest
      if (payload !== undefined && 'first' in payload) {
        url = `${context.state.server}/api/professor/all?first=${payload.first}`;
      } else {
        url = `${context.state.server}/api/professor/all`;
      }

      Vue.axios.get(url)
      .then((resp) => {
        if (resp.data.success) {
          context.commit('SET_PROFESSORS', resp.data.professors);
        } else {
          showError(resp.data.message);
        }
      })
      .catch((error) => {
        showError(error);
      });
    },
  },
});
