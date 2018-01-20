import StudentView from '@/components/Main/Students/StudentView';
import StudentEdit from '@/components/Main/Students/StudentEdit';
import StudentAdd from '@/components/Main/Students/StudentAdd';
import permissionRequired from '../helpers/permissionRequired';

export default [
    /* Student View */
    {
        name: 'studentView',
        path: 'student/view/:id',
        component: StudentView,
      },
      /* Student Edit */
      {
        name: 'studentEdit',
        path: 'student/edit/:id',
        component: StudentEdit,
        // Check if the user has permissions
        beforeEnter(to, from, next) {
          permissionRequired(3, next);
        },
      },
      /* Student Add */
      {
        name: 'studentAdd',
        path: 'student/add',
        component: StudentAdd,
        beforeEnter(to, from, next) {
          permissionRequired(3, next);
        },
      },
];
