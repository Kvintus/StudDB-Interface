import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store/store';
// eslint-disable-next-line
import Login from '@/components/Login.vue';
// eslint-disable-next-line
import MainList from '@/components/MainList.vue';


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/login',
      component: Login,
      name: 'LoginRoute',
      beforeEnter(to, from, next) {
        store.commit('logUserOut');
        next();
      },
    },
    {
      path: '/',
      component: MainList,
      name: 'mainDisplay',
    },
  ],
});
