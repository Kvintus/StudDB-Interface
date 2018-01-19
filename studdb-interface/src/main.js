import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import App from './App';
import router from './router';
import store from './store/store';
import {
  api_server,
} from '@/assets/js/config';

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);

// Filter to reverse an array
Vue.filter('reverse', value => value.slice().reverse());

router.beforeEach((to, from, next) => {
  // Check if the user is logged-in
  if (Object.keys(store.getters.user).length > 0 || to.name === 'LoginRoute') {
    // Setting the meta title
    document.title = to.meta.title;
    next();
  } else {
    // Make sure if the user is logged in on the server, if he is log him in normally else redirect to login page
    Vue.axios({
      url: `${api_server}/user/logged`,
      method: 'post',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((resp) => {
      console.log(resp.data);
      // If the user is logged in on the server
      if (resp.data.isLoggedIn) {
        store.commit('setUser', resp.data.user);
        next();
      } else {
        next({
          name: 'LoginRoute',
          query: {
            next: to.fullPath,
          },
        });
      }
    }).catch((err) => {
      next({ name: 'errorDisplay', params: { which: err } });
    });
  }
});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
});
