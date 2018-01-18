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
    next({
      name: 'LoginRoute',
      query: {
        next: to.fullPath,
      },
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
