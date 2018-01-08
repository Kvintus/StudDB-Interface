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
      meta: {
        title: 'Login',
      },
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
          meta: {
            title: 'Students',
          },
          // Fetches all the students and stores them in the central store
          beforeEnter(to, from, next) {
            Vue.axios.get(`${store.state.server}/api/student/all`)
            .then((resp) => {
              if (resp.data.success) {
                store.state.students = Object.assign({}, resp.data.students);
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
            store.commit('clearStudents');
          },
        },
      ],
    },
  ],
});
