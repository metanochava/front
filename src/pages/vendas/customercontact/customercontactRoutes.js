import { tdc } from 'quasar_resaas'

export let customercontactRoutes = [
  {
    path: '/list_customercontact',
    name: 'list_customercontact',
    component: () => import('./CustomercontactLPage.vue'),
    meta: {
      title: tdc('View of') + ' ' + tdc('Customer Contacts'),
      requiresAuth: true,
      icon: 'contact_phone',
      requiredRole: 'list_customercontact',
    },
  },
  // one manual page for add_ and change_ (components/record/useRecordForm)
  {
    path: '/add_customercontact',
    name: 'add_customercontact',
    component: () => import('./CustomercontactSEPage.vue'),
    meta: { title: tdc('New customer contact'), requiresAuth: true, icon: 'add', requiredRole: 'add_customercontact' },
  },
  {
    path: '/change_customercontact/:id',
    name: 'change_customercontact',
    component: () => import('./CustomercontactSEPage.vue'),
    meta: { title: tdc('Edit customer contact'), requiresAuth: true, icon: 'edit', requiredRole: 'change_customercontact' },
  },
]
