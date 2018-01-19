import Vuex from 'vuex';
import Vue from 'vue';
import showError from '@/assets/js/globalError';
import axios from 'axios';
import { api_server } from '@/assets/js/config';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    students: [],
    classes: [],
    parents: [],
    professors: [],
  },
  getters: {
    user(state) {
      return state.user;
    },
    students(state) {
      return state.students;
    },
    parents(state) {
      return state.parents;
    },
    professors(state) {
      return state.professors;
    },
    classes(state) {
      return state.classes;
    },
  },
  mutations: {
    // Sets user from the payload (Loggs him in)
    setUser(state, payload) {
      state.user = Object.assign({}, payload);
    },
    // Logs user out from the vuex session
    LOG_USER_OUT(state) {
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
    // Saves the classes from the passed-in payload into the global storage
    SET_CLASSES(state, payload) {
      state.classes = payload.slice();
    },
  },
  actions: {
    // Logs user out from the server and from the instance
    logUserOut(context) {
      axios({
        url: `${api_server}/user/logout`,
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }).then(context.commit('LOG_USER_OUT'));
    },
    // Fetches students from the server
    fetchStudents(context, payload) {
      let url;

      // This is because first I fetch just a few parents so the loading feels instant and then I fetch the rest
      if (payload !== undefined && 'first' in payload) {
        url = `${api_server}/api/student/all?first=${payload.first}`;
      } else {
        url = `${api_server}/api/student/all`;
      }

      axios.get(url)
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
    async fetchParents(context, payload) {
      let url;

      // This is because first I fetch just a few parents so the loading feels instant and then I fetch the rest
      if (payload !== undefined && 'first' in payload) {
        url = `${api_server}/api/parent/all?first=${payload.first}`;
      } else {
        url = `${api_server}/api/parent/all`;
      }

      await Vue.axios.get(url)
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
        url = `${api_server}/api/professor/all?first=${payload.first}`;
      } else {
        url = `${api_server}/api/professor/all`;
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
    // Fetches all the classes from the API
    fetchClasses(context, payload) {
      let url;

      // This is because first I fetch just a few parents so the loading feels instant and then I fetch the rest
      if (payload !== undefined && 'first' in payload) {
        url = `${api_server}/api/class/all?first=${payload.first}`;
      } else {
        url = `${api_server}/api/class/all`;
      }

      Vue.axios.get(url)
      .then((resp) => {
        if (resp.data.success) {
          context.commit('SET_CLASSES', resp.data.classes);
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
