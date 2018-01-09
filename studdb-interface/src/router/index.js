import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store/store';
import Login from '@/components/Login';
import MainList from '@/components/MainList';
import StudentList from '@/components/Students/StudentList';
import ClassList from '@/components/Classes/ClassList';
import Peter from '@/components/peter';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      beforeEnter(to, from, next) {
        next({ name: 'studentsList' });
      },
    },
    {
      path: '/login',
      component: Login,
      name: 'LoginRoute',
      meta: {
        title: 'Login',
      },
      // If the user is logged in redirect him to Homepag
      beforeEnter(to, from, next) {
        if (!(Object.keys(store.state.user).length === 0)) {
          next({
            name: 'mainDisplay',
          });
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
        /* Students List */
        {
          name: 'studentsList',
          path: 'students',
          component: StudentList,
          meta: {
            title: 'Students',
          },
        },
        /* Classes List */
        {
          name: 'classesList',
          path: 'classes',
          component: ClassList,
          meta: {
            title: 'Classes',
          },
        },
      ],
    },
  ],
});
