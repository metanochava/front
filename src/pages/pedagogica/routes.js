import { tdc } from 'quasar_resaas'

// the pedagogica module (back/pedagogica): the digital board, the student's
// lessons, and schema-driven lists of the rest
const crud = (model, name, title, icon) => ({
  path: `/${name}`,
  name,
  component: () => import('./PedagogicaCrudPage.vue'),
  props: { model },
  meta: { title: tdc(title), requiresAuth: true, icon, requiredRole: name },
})

export const pedagogicaRoutes = [
  {
    path: '/list_lesson',
    name: 'list_lesson',
    component: () => import('./board/DigitalBoardPage.vue'),
    meta: { title: tdc('Digital board'), requiresAuth: true, icon: 'draw', requiredRole: 'list_lesson' },
  },
  {
    path: '/my_lessons',
    name: 'view_own_lesson',
    component: () => import('./portal/MyLessonsPage.vue'),
    meta: { title: tdc('My lessons'), requiresAuth: true, icon: 'history_edu', requiredRole: 'view_own_lesson' },
  },
  crud('LessonPlan', 'list_lessonplan', 'Lesson plans', 'event_note'),
  crud('Material', 'list_material', 'Materials', 'folder_open'),
  crud('Assignment', 'list_assignment', 'Assignments', 'assignment'),
  crud('Submission', 'list_submission', 'Submissions', 'inbox'),
  crud('CalendarEvent', 'list_calendarevent', 'Pedagogical calendar', 'event'),
  crud('ProgressNote', 'list_progressnote', 'Progress notes', 'insights'),
  crud('ClassMessage', 'list_classmessage', 'Class messages', 'campaign'),
]
