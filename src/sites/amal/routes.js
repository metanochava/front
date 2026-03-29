import { tdc } from 'quasar_resaas'

export let amalSiteRoutes = [
  {
    path: '/',
    component: () => import('./layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('./pages/HomePage.vue'),
        name: 'home',
        meta: {
          title: tdc('Bem vindo a clinica amal'),
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

