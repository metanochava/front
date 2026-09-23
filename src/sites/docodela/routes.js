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
      {
        path:"/blog",
        component:()=>import("./pages/BlogPage.vue"),
        name:"blog",
        meta: {
          title: tdc('Health blog'),
          icon: 'article',
        },
      },
      {
        path:"/faqs",
        component:()=>import("./pages/FAQsPage.vue"),
        name:"faqs",
        meta: {
          title: tdc('FAQs'),
          icon: 'quiz',
        },
      },
      {
        path:"/contacto",
        component:()=>import("./pages/ContactPage.vue"),
        name:"contacto",
        meta: {
          title: tdc('Get in touch'),
          icon: 'chat',
        },
      },
      {
        path:"/financiamento/:categoria",
        component:()=>import("./pages/CategoryFinancePage.vue"),
        name:"categoria-financiamento",
        meta: {
          title: tdc('Finance for your treatment'),
          icon: 'calculate',
        },
      },
      {
        path:"/guia/:slug",
        component:()=>import("./pages/GuidePage.vue"),
        name:"guia",
        meta: {
          title: tdc('Popular finance guides'),
          icon: 'menu_book',
        },
      },
    ],
  }
]

