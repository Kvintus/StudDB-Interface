import permissionRequired from '../helpers/permissionRequired';
import ProfessorView from '@/components/Main/Professors/ProfessorView';
import ProfessorEdit from '@/components/Main/Professors/ProfessorEdit';
import ProfessorAdd from '@/components/Main/Professors/ProfessorAdd';

export default [
    /* Professor View */
    {
        name: 'professorView',
        path: 'professor/view/:id',
        component: ProfessorView,
      },
      /* Student Edit */
      {
        name: 'professorEdit',
        path: 'professor/edit/:id',
        component: ProfessorEdit,
        // Check if the user has permissions
        beforeEnter(to, from, next) {
          permissionRequired(3, next);
        },
      },
      /* Professor Add */
      {
        name: 'professorAdd',
        path: 'professor/add',
        component: ProfessorAdd,
        meta: {
          title: 'Add Professor',
        },
        beforeEnter(to, from, next) {
          permissionRequired(3, next);
        },
      },
];
