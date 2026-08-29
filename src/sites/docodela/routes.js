import { tdc } from 'quasar_resaas'

export let docodelaSiteRoutes = [
  {
    path: '/',
    component: () => import('./layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('./pages/HomePage.vue'),
        name: 'home',
        meta: {
          title: tdc('Bem vindo a clinica docodela'),
          icon: 'inventory_2',
        },
      },
      {
        path:"/utentes",
        component:()=>import("./pages/UtentesPage.vue"),
        name:"utentes",
        meta: {
          title: tdc('Utentes'),
          icon: 'inventory_2',
        },
      },
      {
        path:"/sobrenos",
        component:()=>import("./pages/SobreNosPage.vue"),
        name:"sobrenos",
        meta: {
          title: tdc('Sobre nos'),
          icon: 'inventory_2',
        },
      },
      {
        path:"/parceiros",
        component:()=>import("./pages/ParceirosPage.vue"),
        name:"parceiros",
        meta: {
          title: tdc('ParceirosPage'),
          icon: 'inventory_2',
        },
      },
    ],
  }
]

