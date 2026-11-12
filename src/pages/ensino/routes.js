import { tdc } from 'quasar_resaas'

// the ensino module (back/ensino): generic schema-driven lists / forms with
// the models' own actions, and the student registration page
const crud = (model, name, title, icon) => ({
  path: `/${name}`,
  name,
  component: () => import('./EnsinoCrudPage.vue'),
  props: { model },
  meta: { title: tdc(title), requiresAuth: true, icon, requiredRole: name }
})

export let ensinoRoutes = [
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
  crud('TuitionRule', 'list_tuitionrule', 'Tuition rules', 'rule'),
  crud('TuitionCharge', 'list_tuitioncharge', 'Tuition charges', 'receipt_long')
]
