import MainView from '@/components/Main/MainView';
import Lists from './listRoutes';
import StudentRoutes from './studentRoutes';
import ParentRoutes from './parentRoutes';
import ProfessorRoutes from './professorRoutes';
import ClassRoutes from './classRoutes';
import MainViewRoute from './MainRoute';
import ErrorComp from '@/components/Error/Error';
import classRoutes from './classRoutes';


export default {
  path: '/', // Only works when children routes are after this
  component: MainView,
  name: 'mainListDisplay',
  children: [
    // Unpacks all the routes
    ...Lists,
    ...StudentRoutes,
    ...ParentRoutes,
    ...ProfessorRoutes,
    ...ClassRoutes,
    /* Error Display */
    {
      name: 'errorDisplay',
      path: 'error/:which',
      component: ErrorComp,
    },
  ],
};
