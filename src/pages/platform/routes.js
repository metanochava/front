import { tdc } from 'quasar_resaas'

// Menu Manager (platform administration; the backend allows it to Root only)
export const platformRoutes = [
  {
    path: '/menu_manager',
    name: 'menu_manager',
    component: () => import('./MenuManagerPage.vue'),
    meta: { title: tdc('Menu manager'), requiresAuth: true, icon: 'menu', requiredRole: 'list_menu' },
  },
]
