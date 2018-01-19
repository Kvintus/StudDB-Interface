import StudentView from '@/components/Main/Students/StudentView';
import StudentEdit from '@/components/Main/Students/StudentEdit';
import store from '@/store/store';

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
          if (store.getters.user.privilege >= 3) {
            // Proceed
            next();
          } else {
            // Redirect to the error page
            next({ name: 'errorDisplay', params: { which: 'noPermissionToEdit' } });
          }
        },
      },
];
