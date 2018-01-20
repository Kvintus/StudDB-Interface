import MainView from '@/components/Main/MainView';
import Lists from './listRoutes';
import StudentRoutes from './studentRoutes';
import MainViewRoute from './MainRoute';
import ErrorComp from '@/components/Error/Error';


export default {
  path: '/', // Only works when children routes are after this
  component: MainView,
  name: 'mainListDisplay',
  children: [
    // Unpacks all the routes
    ...Lists,
    ...StudentRoutes,
    /* Error Display */
    {
      name: 'errorDisplay',
      path: 'error/:which',
      component: ErrorComp,
    },
  ],
};
