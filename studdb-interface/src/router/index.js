import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store/store';
import Login from '@/components/Login';
import MainView from '@/components/Main/MainView';
import StudentList from '@/components/Main/Students/StudentList';
import ClassList from '@/components/Main/Classes/ClassList';
import ParentList from '@/components/Main/Parents/ParentList';
import ProfessorList from '@/components/Main/Professors/ProfessorList';
import StudentView from '@/components/Main/Students/StudentView';

Vue.use(Router);

export default new Router({
  routes: [{
      path: '/',
      beforeEnter(to, from, next) {
        next({
          name: 'studentsList',
        });
      },
    },
    {
      path: '/login',
      component: Login,
      name: 'LoginRoute',
      meta: {
        title: 'Login',
      },
      // If the user is logged in redirect him to Homepage
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
      path: '/',
      component: MainView,
      name: 'mainListDisplay',
      children: [
        /* Students List */
        {
          name: 'studentsList',
          path: 'list/students',
          component: StudentList,
          meta: {
            title: 'Students',
          },
        },
        /* Classes List */
        {
          name: 'classesList',
          path: 'list/classes',
          component: ClassList,
          meta: {
            title: 'Classes',
          },
        },
        {
          name: 'parentsList',
          path: 'list/parents',
          component: ParentList,
          meta: {
            title: 'Parents',
          },
        },
        {
          name: 'professorsList',
          path: 'list/professors',
          component: ProfessorList,
          meta: {
            title: 'Professors',
          },
        },
        {
          name: 'studentView',
          path: 'student/view/:id',
          component: StudentView,
        },
        {
          name: 'studentEdit',
          path: 'student/edit/:id',
          component: StudentView,
        },
      ],
    },
  ],
});
