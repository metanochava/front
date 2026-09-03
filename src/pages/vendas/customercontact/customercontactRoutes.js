import { tdc } from 'quasar_resaas'

export let customercontactRoutes = [
  {
    path: '/list_customercontact',
    name: 'list_customercontact',
    component: () => import('./CustomercontactLPage.vue'),
    meta: {
      title: tdc('Vista de') + ' ' + tdc('Contactos de Cliente'),
      requiresAuth: true,
      icon: 'contact_phone',
      requiredRole: 'list_customercontact',
    },
  },
]
