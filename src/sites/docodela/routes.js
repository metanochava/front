import { tdc } from 'quasar_resaas'

export let docodelaSiteRoutes = [
  {
    path: '/',
    component: () => import('./layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/home'
      },
      {
        path: '/home',
        component: () => import('./pages/HomePage.vue'),
        name: 'home',
        meta: {
          title: tdc('Welcome to Docodela clinic'),
          icon: 'inventory_2',
        },
      },
      {
        path:"/utentes",
        component:()=>import("./pages/UtentesPage.vue"),
        name:"utentes",
        meta: {
          title: tdc('Patients'),
          icon: 'inventory_2',
        },
      },
      {
        path:"/sobrenos",
        component:()=>import("./pages/SobreNosPage.vue"),
        name:"sobrenos",
        meta: {
          title: tdc('About us'),
          icon: 'inventory_2',
        },
      },
      {
        path:"/parceiros",
        component:()=>import("./pages/ParceirosPage.vue"),
        name:"parceiros",
        meta: {
          title: tdc('Partners'),
          icon: 'inventory_2',
        },
      },
      {
        path:"/calculadora",
        component:()=>import("./pages/LoanCalculatorPage.vue"),
        name:"calculadora",
        meta: {
          title: tdc('Loan calculator'),
          icon: 'calculate',
        },
      },
    ],
  }
]

