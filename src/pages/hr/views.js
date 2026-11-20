import { labelOf as label } from 'src/components/record/viewRoutes'

// The record pages (view_<model>, components/record/RecordViewPage) of the hr models
// that have no view page of their own: the header and the tabs after "Details" - the related
// models' records that point at the record (model + its field, fk). A custom view_ page keeps
// its own route, so its model is not listed here. A tab shows only with list_<model>.

export const hrViews = {
  EmployeeRating: {
    label: 'Employee rating',
    icon: 'description',
    title: (r) => label(r.employee),
    statusField: null,
    defaultTab: 'personal',
    tabs: [
      { name: 'personal', label: 'Personal', icon: 'person', person: 'rated_by', permission: 'view_person' }
    ]
  },
  LeaveRequest: {
    label: 'Leave request',
    icon: 'description',
    title: (r) => label(r.employee),
    tabs: [
      { name: 'leavebalanceentry', label: 'Leave balance entries', icon: 'list', model: 'LeaveBalanceEntry', fk: 'reference' }
    ]
  },
  EmployeeOnboarding: {
    label: 'Employee onboarding',
    icon: 'assignment_turned_in',
    title: (r) => label(r.employee),
    tabs: [
      { name: 'employeeonboardingtask', label: 'Employee onboarding tasks', icon: 'list', model: 'EmployeeOnboardingTask', fk: 'onboarding' }
    ]
  },
  EmployeeOnboardingTask: {
    label: 'Employee onboarding task',
    icon: 'description',
    title: (r) => label(r.title),
    statusField: null
  },
  ReviewCompetencyRating: {
    label: 'Review competency rating',
    icon: 'description',
    title: (r) => label(r.review),
    statusField: null
  },
  EmployeeTraining: {
    label: 'Employee training',
    icon: 'description',
    title: (r) => label(r.employee),
    tabs: [
      { name: 'certification', label: 'Certifications', icon: 'list', model: 'Certification', fk: 'training' }
    ]
  },
  Certification: {
    label: 'Certification',
    icon: 'description',
    title: (r) => label(r.name),
    statusField: null
  },
  Promotion: {
    label: 'Promotion',
    icon: 'trending_up',
    title: (r) => label(r.employee),
    statusField: null
  },
  Transfer: {
    label: 'Transfer',
    icon: 'compare_arrows',
    title: (r) => label(r.employee),
    statusField: null
  },
  DisciplinaryAction: {
    label: 'Disciplinary action',
    icon: 'description',
    title: (r) => label(r.case),
    statusField: null
  },
  Termination: {
    label: 'Termination',
    icon: 'person_off',
    title: (r) => label(r.employee),
    statusField: null
  },
  EmployeeOffboarding: {
    label: 'Employee offboarding',
    icon: 'assignment_late',
    title: (r) => label(r.employee),
    tabs: [
      { name: 'employeeoffboardingtask', label: 'Employee offboarding tasks', icon: 'list', model: 'EmployeeOffboardingTask', fk: 'offboarding' }
    ]
  },
  EmployeeOffboardingTask: {
    label: 'Employee offboarding task',
    icon: 'description',
    title: (r) => label(r.title),
    statusField: null
  }
}
