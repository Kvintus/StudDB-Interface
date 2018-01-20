import StudentList from '@/components/Main/Students/StudentList';
import ClassList from '@/components/Main/Classes/ClassList';
import ParentList from '@/components/Main/Parents/ParentList';
import ProfessorList from '@/components/Main/Professors/ProfessorList';

export default [
    /* Students List */
    {
        name: 'studentsList',
        path: 'list/students',
        component: StudentList,
        meta: {
          title: 'Students',
        },
      },
      /* Classes List */
      {
        name: 'classesList',
        path: 'list/classes',
        component: ClassList,
        meta: {
          title: 'Classes',
        },
      },
      /* Parents List */
      {
        name: 'parentsList',
        path: 'list/parents',
        component: ParentList,
        meta: {
          title: 'Parents',
        },
      },
      /* Professors List */
      {
        name: 'professorsList',
        path: 'list/professors',
        component: ProfessorList,
        meta: {
          title: 'Professors',
        },
      },
];
