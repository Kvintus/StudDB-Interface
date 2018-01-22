import store from '@/store/store';
import { noPermissionRedirect } from '@/assets/js/errors';


export default (permission, next) => {
    if (store.getters.user.privilege >= permission) {
        // Proceed
        next();
      } else {
        // Redirect to the error page
        noPermissionRedirect();
      }
};
