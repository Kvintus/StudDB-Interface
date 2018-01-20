import permissionRequired from '../helpers/permissionRequired';
import ParentView from '@/components/Main/Parents/ParentView';

export default [
    /* Parent View */
    {
        name: 'parentView',
        path: 'parent/view/:id',
        component: ParentView,
    },
];
