import { tdc } from 'quasar_resaas'

export let amalSiteRoutes = [
  {
    path: '/',
    component: () => import('./layouts/MainLayoutt.vue'),
    children: [
      {
        path: '/home',
        component: () => import('./pages/HomePage.vue'),
        name: 'home',
        meta: {
          title: tdc('Welcome'),
          icon: 'inventory_2',
        },
      },

      // {
      //   path:"/especialidades",
      //   name:"especialidades",
      //   component:()=>import("./pages/EspecialidadesPage.vue")
      // },
    ],
  }
]

