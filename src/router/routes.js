import { restRoutes, authRoutes } from '@metano/quasar_rest_auth'
import { rhRoutes } from './../pages/rh/routes'
const routes = [
  ...authRoutes,

  {
    path: '/',
    component: () => import('@metano/quasar_rest_auth/layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/IndexPage.vue'), name: 'home' },
      {
        path: 'authwelcome',
        component: () => import('src/pages/WelcomePage.vue'),
        name: 'authwelcome',
      },
      {
        path: 'crud',
        component: () => import('@metano/quasar_rest_auth/components/auto/CrudPage.vue'),
        name: 'crud_state',
      },

      {
        path: 'crud/:module/:model/go',
        component: () => import('@metano/quasar_rest_auth/components/auto/CrudPage.vue'),
        name: 'crud_route',
      },
      ...restRoutes,
      ...rhRoutes,
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
