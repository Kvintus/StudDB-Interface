import permissionRequired from '../helpers/permissionRequired';
import ClassView from '@/components/Main/Classes/ClassView';
import ClassEdit from '@/components/Main/Classes/ClassEdit';
/* import ClassAdd from '@/components/Main/Classes/ClassAdd'; */

export default [
    /* Class View */
    {
        name: 'classView',
        path: 'class/view/:id',
        component: ClassView,
      },
      /* Class Edit */
      {
        name: 'classEdit',
        path: 'class/edit/:id',
        component: ClassEdit,
        // Check if the user has permissions
        beforeEnter(to, from, next) {
          permissionRequired(3, next);
        },
      },
      /* Class Add */
/*       {
        name: 'classAdd',
        path: 'class/add',
        component: ClassAdd,
        meta: {
          title: 'Add Class',
        },
        beforeEnter(to, from, next) {
          permissionRequired(3, next);
        },
      }, */
];
