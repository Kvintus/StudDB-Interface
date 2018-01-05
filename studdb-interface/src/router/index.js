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
      // If the user is logged in redirect him to Homepag
      beforeEnter(to, from, next) {
        console.log(Object.keys(store.state.user).length);
        if (!(Object.keys(store.state.user).length === 0)) {
          next({ name: 'mainDisplay' });
        } else {
          next();
        }
      },
    },
    {
      path: '/',
      component: MainList,
      name: 'mainDisplay',
    },
  ],
});
