import permissionRequired from '../helpers/permissionRequired';
import ProfessorView from '@/components/Main/Professors/ProfessorView';

export default [
    /* Professor View */
    {
        name: 'professorView',
        path: 'professor/view/:id',
        component: ProfessorView,
      },
      /* Student Edit */
/*       {
        name: 'professorEdit',
        path: 'professor/edit/:id',
        component: ProfessorEdit,
        // Check if the user has permissions
        beforeEnter(to, from, next) {
          permissionRequired(3, next);
        },
      }, */
      /* Professor Add */
/*       {
        name: 'professorAdd',
        path: 'professor/add',
        component: ProfessorAdd,
        beforeEnter(to, from, next) {
          permissionRequired(3, next);
        },
      }, */
];
