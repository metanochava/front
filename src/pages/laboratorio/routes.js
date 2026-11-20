import { tdc } from 'quasar_resaas'

// the laboratorio module (back/laboratorio): practical sessions with seats
// and remote access, the student's sessions, schema-driven lists of the rest
const crud = (model, name, title, icon) => ({
  path: `/${name}`,
  name,
  component: () => import('./LaboratorioCrudPage.vue'),
  props: { model },
  meta: { title: tdc(title), requiresAuth: true, icon, requiredRole: name },
})

export const laboratorioRoutes = [
  {
    path: '/list_labsession',
    name: 'list_labsession',
    component: () => import('./sessions/LabSessionsPage.vue'),
    meta: { title: tdc('Lab sessions'), requiresAuth: true, icon: 'co_present', requiredRole: 'list_labsession' },
  },
  {
    path: '/my_lab_sessions',
    name: 'view_own_labsession',
    component: () => import('./portal/MyLabSessionsPage.vue'),
    meta: { title: tdc('My lab sessions'), requiresAuth: true, icon: 'computer', requiredRole: 'view_own_labsession' },
  },
  {
    path: '/list_virtuallab',
    name: 'list_virtuallab',
    component: () => import('./virtual/VirtualLabsPage.vue'),
    meta: { title: tdc('Virtual labs'), requiresAuth: true, icon: 'dns', requiredRole: 'list_virtuallab' },
  },
  {
    path: '/my_virtual_machines',
    name: 'view_own_virtualmachine',
    component: () => import('./virtual/MyVirtualMachinesPage.vue'),
    meta: { title: tdc('My virtual machines'), requiresAuth: true, icon: 'terminal', requiredRole: 'view_own_virtualmachine' },
  },
  crud('Room', 'list_room', 'Rooms', 'meeting_room'),
  crud('Workstation', 'list_workstation', 'Workstations', 'desktop_windows'),
  crud('Equipment', 'list_equipment', 'Equipment', 'precision_manufacturing'),
  crud('Network', 'list_network', 'Networks', 'lan'),
  crud('Environment', 'list_environment', 'Environments', 'layers'),
  crud('RemoteAccessSession', 'list_remoteaccesssession', 'Remote accesses', 'screen_share'),
]
