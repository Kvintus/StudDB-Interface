import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import App from './App';
import router from './router';
import store from './store/store';

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);

// Filter to reverse an array
Vue.filter('reverse', value => value.slice().reverse());

// To set the titles on the routes
router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next();
});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
});
