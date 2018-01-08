import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store/store';
import Login from '@/components/Login';
import MainList from '@/components/MainList';
import StudentList from '@/components/Students/StudentList';
import ClassList from '@/components/Classes/ClassList';


Vue.use(Router);

export default new Router({
  routes: [
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
          // Fetches all the students and stores them in the central store
          beforeEnter(to, from, next) {
            Vue.axios.get(`${store.state.server}/api/student/all`)
              .then((resp) => {
                if (resp.data.success) {
                  store.state.students = resp.data.students.slice();
                  next();
                } else {
                  // TODO: Display error
                  console.log(resp.message);
                  next();
                }
              })
              .catch((error) => {
                // TODO: Display the error somehow
                console.log(error);
              });
          },


          // Deletes all the studetns from the central state
          beforeRouteLeave: (to, from, next) => {
            store.commit('clearList', 'students');
            next();
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
          // Fetches all the classes and stores them in the central store
          beforeEnter(to, from, next) {
            Vue.axios.get(`${store.state.server}/api/classes/all`)
              .then((resp) => {
                if (resp.data.success) {
                  store.state.classes = resp.data.classes.slice();
                 next();
                } else {
                  // TODO: Display error
                  console.log(resp.message);
                  next();
                }
              })
              .catch((error) => {
                // TODO: Display the error somehow
                console.log(error);
              });
          },

          // Deletes all the classes from the central state
          beforeLeave: (to, from, next) => {
            store.commit('clearList', 'classes');
            next();
          },
        },
      ],
    },
  ],
});
