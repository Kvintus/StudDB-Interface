import store from '@/store/store';
import Login from '@/components/Login';

export default
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
};
