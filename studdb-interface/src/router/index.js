import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store/store';

import MainViewRoute from './routes/MainRoute';
import LoginRoute from './routes/login';
import NotFound from '@/components/shared/NotFound';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      beforeEnter(to, from, next) {
        next({
          name: 'studentsList',
        });
      },
    },
    LoginRoute,
    MainViewRoute,
    // Error route
    {
      path: '*',
      component: NotFound,
    },
  ],
});
