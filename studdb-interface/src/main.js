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


// Returns the inforantion on whether the user is logged in on the server
// When return false there's been an error reaching out to the server\
async function getInformationAboutTheLogin(apiServer) {
  try {
    const info = await Vue.axios({
      url: `${apiServer}/user/logged`,
      method: 'post',
      withCredentials: true, // To make sessions work
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return info;
  } catch (error) {
    return false;
  }
}

router.beforeEach(async (to, from, next) => {
  // Check if the user is logged-in
  if (Object.keys(store.getters.user).length > 0 || to.name === 'LoginRoute') {
    // Setting the meta title
    document.title = to.meta.title;
    next();
  } else {
    // Make sure if the user is logged in on the server, if he is log him in normally else redirect to login page
    // Get the information
    const informationAboutLogin = await getInformationAboutTheLogin(api_server);

    // Checking if the call was successfull
    if (informationAboutLogin) {
      // Checking if the user is loggged in
      if (informationAboutLogin.isLoggedIn) {
        // Storing the user in the state
        store.commit('setUser', informationAboutLogin.user);
        next();
      } else {
        // Redirecting to the login page if the user is not logged in
        next({
          name: 'LoginRoute',
          query: {
            next: to.fullPath,
          },
        });
      }
    } else {
      next({ name: 'errorDisplay', params: { which: 'serverError' } });
    }
  }
});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
});
