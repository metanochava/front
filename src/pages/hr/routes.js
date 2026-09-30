// The HR module's routes (was part of quasar_resaas's restRoutes; HR is this
// application's own module now - backend: back/hr, frontend: this folder).
import { tdc } from 'quasar_resaas'

import { employeeRoutes } from './employee/employeeRoute'
import { departmentRoutes } from './department/departmentRoute'
import { job_positionRoutes } from './job_position/job_positionRoute'
import { job_gradeRoutes } from './job_grade/job_gradeRoute'
import { contractRoutes } from './contract/contractRoute.js'
import { specialtyRoutes } from './specialty/specialtyRoute'
import { employee_specialtyRoutes } from './employee_specialty/employee_specialtyRoute'
import { shiftRoutes } from './shift/shiftRoute'
import { employee_shiftRoutes } from './employee_shift/employee_shiftRoute'
import { shift_scheduleRoutes } from './shift_schedule/shift_scheduleRoute'
import { attendanceRoutes } from './attendance/attendanceRoute'
import { holidayRoutes } from './holiday/holidayRoute'
import { salary_componentRoutes } from './salary_component/salary_componentRoute'
import { employee_salaryRoutes } from './employee_salary/employee_salaryRoute'
import { employee_salary_componentRoutes } from './employee_salary_component/employee_salary_componentRoute'
import { payroll_periodRoutes } from './payroll_period/payroll_periodRoute'
import { payrollRoutes } from './payroll/payrollRoute'
import { payroll_itemRoutes } from './payroll_item/payroll_itemRoute'
import { payslipRoutes } from './payslip/payslipRoute'
import { leave_typeRoutes } from './leave_type/leave_typeRoute'
import { leave_requestRoutes } from './leave_request/leave_requestRoute'
import { leave_balance_entryRoutes } from './leave_balance_entry/leave_balance_entryRoute'
import { job_openingRoutes } from './job_opening/job_openingRoute'
import { candidateRoutes } from './candidate/candidateRoute'
import { applicationRoutes } from './application/applicationRoute'
import { interviewRoutes } from './interview/interviewRoute'
import { onboarding_templateRoutes } from './onboarding_template/onboarding_templateRoute'
import { onboarding_template_taskRoutes } from './onboarding_template_task/onboarding_template_taskRoute'
import { employee_onboardingRoutes } from './employee_onboarding/employee_onboardingRoute'
import { performance_cycleRoutes } from './performance_cycle/performance_cycleRoute'
import { competencyRoutes } from './competency/competencyRoute'
import { employee_goalRoutes } from './employee_goal/employee_goalRoute'
import { performance_reviewRoutes } from './performance_review/performance_reviewRoute'
import { courseRoutes } from './course/courseRoute'
import { training_sessionRoutes } from './training_session/training_sessionRoute'
import { promotionRoutes } from './promotion/promotionRoute'
import { transferRoutes } from './transfer/transferRoute'
import { disciplinary_caseRoutes } from './disciplinary_case/disciplinary_caseRoute'
import { resignationRoutes } from './resignation/resignationRoute'
import { terminationRoutes } from './termination/terminationRoute'
import { employee_offboardingRoutes } from './employee_offboarding/employee_offboardingRoute'

export const hrRoutes = [
  {
    path: '/view_hr_dashboard',
    name: 'view_hr_dashboard',
    component: () => import('./DashBoard.vue'),
    meta: {
      title: tdc('View') + ' ' + tdc('Dashboard'),
      requiresAuth: true,
      icon: 'inventory_2',
      requiredRole: 'view_hr_dashboard'
    }
  },
  {
    path: '/view_dashboard_hr_organizacao',
    name: 'view_dashboard_hr_organizacao',
    component: () => import('./dashboards/OrganizacaoDashboardPage.vue'),
    meta: {
      title: tdc('Dashboard') + ' ' + tdc('Organização'),
      requiresAuth: true,
      icon: 'corporate_fare',
      requiredRole: 'view_dashboard_hr_organizacao'
    }
  },
  {
    path: '/view_dashboard_hr_tempo_presenca',
    name: 'view_dashboard_hr_tempo_presenca',
    component: () => import('./dashboards/TempoPresencaDashboardPage.vue'),
    meta: {
      title: tdc('Dashboard') + ' ' + tdc('Tempo & Presença'),
      requiresAuth: true,
      icon: 'schedule',
      requiredRole: 'view_dashboard_hr_tempo_presenca'
    }
  },
  {
    path: '/view_dashboard_hr_salario_folha',
    name: 'view_dashboard_hr_salario_folha',
    component: () => import('./dashboards/SalarioFolhaDashboardPage.vue'),
    meta: {
      title: tdc('Dashboard') + ' ' + tdc('Salário & Folha de Pagamento'),
      requiresAuth: true,
      icon: 'payments',
      requiredRole: 'view_dashboard_hr_salario_folha'
    }
  },
  {
    path: '/view_dashboard_hr_ausencias',
    name: 'view_dashboard_hr_ausencias',
    component: () => import('./dashboards/AusenciasDashboardPage.vue'),
    meta: {
      title: tdc('Dashboard') + ' ' + tdc('Ausências'),
      requiresAuth: true,
      icon: 'beach_access',
      requiredRole: 'view_dashboard_hr_ausencias'
    }
  },
  {
    path: '/view_dashboard_hr_recrutamento',
    name: 'view_dashboard_hr_recrutamento',
    component: () => import('./dashboards/RecrutamentoDashboardPage.vue'),
    meta: {
      title: tdc('Dashboard') + ' ' + tdc('Recrutamento'),
      requiresAuth: true,
      icon: 'work',
      requiredRole: 'view_dashboard_hr_recrutamento'
    }
  },
  {
    path: '/view_dashboard_hr_onboarding',
    name: 'view_dashboard_hr_onboarding',
    component: () => import('./dashboards/OnboardingDashboardPage.vue'),
    meta: {
      title: tdc('Dashboard') + ' ' + tdc('Onboarding'),
      requiresAuth: true,
      icon: 'checklist',
      requiredRole: 'view_dashboard_hr_onboarding'
    }
  },
  {
    path: '/view_dashboard_hr_desempenho',
    name: 'view_dashboard_hr_desempenho',
    component: () => import('./dashboards/DesempenhoDashboardPage.vue'),
    meta: {
      title: tdc('Dashboard') + ' ' + tdc('Desempenho'),
      requiresAuth: true,
      icon: 'trending_up',
      requiredRole: 'view_dashboard_hr_desempenho'
    }
  },
  {
    path: '/view_dashboard_hr_formacao',
    name: 'view_dashboard_hr_formacao',
    component: () => import('./dashboards/FormacaoDashboardPage.vue'),
    meta: {
      title: tdc('Dashboard') + ' ' + tdc('Formação'),
      requiresAuth: true,
      icon: 'school',
      requiredRole: 'view_dashboard_hr_formacao'
    }
  },
  {
    path: '/view_dashboard_hr_ciclo_vida',
    name: 'view_dashboard_hr_ciclo_vida',
    component: () => import('./dashboards/CicloVidaDashboardPage.vue'),
    meta: {
      title: tdc('Dashboard') + ' ' + tdc('Ciclo de Vida do Colaborador'),
      requiresAuth: true,
      icon: 'compare_arrows',
      requiredRole: 'view_dashboard_hr_ciclo_vida'
    }
  },
  ...employeeRoutes,
  ...departmentRoutes,
  ...job_positionRoutes,
  ...job_gradeRoutes,
  ...contractRoutes,
  ...specialtyRoutes,
  ...employee_specialtyRoutes,
  ...shiftRoutes,
  ...employee_shiftRoutes,
  ...shift_scheduleRoutes,
  ...attendanceRoutes,
  ...holidayRoutes,
  ...salary_componentRoutes,
  ...employee_salaryRoutes,
  ...employee_salary_componentRoutes,
  ...payroll_periodRoutes,
  ...payrollRoutes,
  ...payroll_itemRoutes,
  ...payslipRoutes,
  ...leave_typeRoutes,
  ...leave_requestRoutes,
  ...leave_balance_entryRoutes,
  ...job_openingRoutes,
  ...candidateRoutes,
  ...applicationRoutes,
  ...interviewRoutes,
  ...onboarding_templateRoutes,
  ...onboarding_template_taskRoutes,
  ...employee_onboardingRoutes,
  ...performance_cycleRoutes,
  ...competencyRoutes,
  ...employee_goalRoutes,
  ...performance_reviewRoutes,
  ...courseRoutes,
  ...training_sessionRoutes,
  ...promotionRoutes,
  ...transferRoutes,
  ...disciplinary_caseRoutes,
  ...resignationRoutes,
  ...terminationRoutes,
  ...employee_offboardingRoutes,
]
