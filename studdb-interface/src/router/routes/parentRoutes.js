import permissionRequired from '../helpers/permissionRequired';
import ParentView from '@/components/Main/Parents/ParentView';
import ParentEdit from '@/components/Main/Parents/ParentEdit';

export default [
    /* Parent View */
    {
        name: 'parentView',
        path: 'parent/view/:id',
        component: ParentView,
    },
    /* Parent Edit */
    {
        name: 'parentEdit',
        path: 'parent/edit/:id',
        component: ParentEdit,
        beforeEnter(to, from, next) {
            permissionRequired(3, next);
        },
    },
];
