import permissionRequired from '../helpers/permissionRequired';
import ParentView from '@/components/Main/Parents/ParentView';
import ParentEdit from '@/components/Main/Parents/ParentEdit';
import ParentAdd from '@/components/Main/Parents/ParentAdd';

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
    /* Parent Add */
    {
        name: 'parentAdd',
        path: 'parent/add',
        component: ParentAdd,
        beforeEnter(to, from, next) {
            permissionRequired(3, next);
        },
    },
];
