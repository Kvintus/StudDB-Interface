import Vuex from 'vuex';
import Vue from 'vue';
import * as mutations from './mutations';
import * as actions from './actions';

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
  mutations,
  actions,
});
