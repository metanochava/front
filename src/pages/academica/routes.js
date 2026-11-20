import { tdc } from 'quasar_resaas'
import { viewRoutes } from 'src/components/record/viewRoutes'
import { academicaViews } from './views'

// the academica module (back/academica, the former ensino): generic schema-driven lists / forms with
// the models' own actions, and the student registration page
const crud = (model, name, title, icon) => ({
  path: `/${name}`,
  name,
  component: () => import('./AcademicaCrudPage.vue'),
  props: { model },
  meta: { title: tdc(title), requiresAuth: true, icon, requiredRole: name }
})

export let academicaRoutes = [
  {
    // the student / guardian portal: their own records only (back portal_service)
    path: '/my_school',
    name: 'view_own_enrolment',
    component: () => import('./portal/MySchoolPage.vue'),
    meta: { title: tdc('My school life'), requiresAuth: true, icon: 'backpack', requiredRole: 'view_own_enrolment' }
  },
  {
    path: '/add_student',
    name: 'add_student',
    component: () => import('./student/StudentRegisterPage.vue'),
    meta: { title: tdc('Register student'), requiresAuth: true, icon: 'person_add', requiredRole: 'add_student' }
  },
  crud('Student', 'list_student', 'Students', 'badge'),
  crud('Enrolment', 'list_enrolment', 'Enrolments', 'how_to_reg'),
  crud('ClassGroup', 'list_classgroup', 'Classes', 'groups'),
  { ...crud('ClassGroup', 'add_classgroup', 'Classes', 'groups'), path: '/add_classgroup' },
  crud('AcademicYear', 'list_academicyear', 'Academic years', 'event'),
  crud('AcademicPeriod', 'list_academicperiod', 'Academic periods', 'date_range'),
  crud('EducationLevel', 'list_educationlevel', 'Education levels', 'stairs'),
  crud('Programme', 'list_programme', 'Programmes', 'menu_book'),
  crud('GradeLevel', 'list_gradelevel', 'Grade levels', 'format_list_numbered'),
  crud('Subject', 'list_subject', 'Subjects', 'subject'),
  crud('CurriculumItem', 'list_curriculumitem', 'Curriculum', 'checklist'),
  crud('GradingScale', 'list_gradingscale', 'Grading scales', 'grade'),
  crud('Assessment', 'list_assessment', 'Assessments', 'assignment'),
  crud('Grade', 'list_grade', 'Grades', 'grading'),
  crud('StudentAttendance', 'list_studentattendance', 'Attendance', 'fact_check'),
  crud('TeachingAssignment', 'list_teachingassignment', 'Teaching assignments', 'co_present'),
  {
    // a class's week above the slots' list (overlaps refused by the backend)
    path: '/list_timetableslot',
    name: 'list_timetableslot',
    component: () => import('./timetable/TimetablePage.vue'),
    meta: { title: tdc('Timetable'), requiresAuth: true, icon: 'calendar_view_week', requiredRole: 'list_timetableslot' }
  },
  crud('PriorSchooling', 'list_priorschooling', 'Prior schooling', 'history_edu'),
  crud('TuitionRule', 'list_tuitionrule', 'Tuition rules', 'rule'),
  crud('TuitionCharge', 'list_tuitioncharge', 'Tuition charges', 'receipt_long'),
  // a record's page: view_<model>/:id (the schema's routes.view), tabs per model in views.js
  ...viewRoutes('academica', academicaViews)
]
