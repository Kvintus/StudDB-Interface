import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store/store';
// eslint-disable-next-line
import Login from '@/components/Login.vue';
// eslint-disable-next-line
import MainList from '@/components/MainList.vue';
import StudentList from '@/components/Students/StudentList';


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/login',
      component: Login,
      name: 'LoginRoute',
      // If the user is logged in redirect him to Homepag
      beforeEnter(to, from, next) {
        if (!(Object.keys(store.state.user).length === 0)) {
          next({ name: 'mainDisplay' });
        } else {
          next();
        }
      },
    },
    {
      path: '/list',
      component: MainList,
      name: 'mainListDisplay',
      children: [
        {
          name: 'studentsList',
          path: 'students',
          component: StudentList,
        },
      ],
    },
  ],
});
