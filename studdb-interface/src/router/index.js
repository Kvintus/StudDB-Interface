import Vue from 'vue';
import Router from 'vue-router';
// eslint-disable-next-line
import Login from '@/components/Login.vue';


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/login',
      component: Login,
      name: 'LoginRoute',
    },
  ],
});
