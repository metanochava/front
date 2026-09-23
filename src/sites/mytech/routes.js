// meta.title/meta.description are raw English canonical keys, translated at
// render time by shared/useSeo.js (not here) - tdc() needs the live
// translation map, which isn't loaded yet when this file is first imported.
export let mytechSiteRoutes = [
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
          title: 'Technology built for real business.',
          description: 'MyTech builds management systems, provides digital forensic services, delivers technology training and supplies IT equipment.',
        },
      },
      {
        path: '/solutions/:slug',
        component: () => import('./pages/SolutionPage.vue'),
        name: 'solution',
        meta: {
          title: 'Solutions',
          description: 'Management systems, digital forensics and web and software development - built and supported by the same MyTech team.',
        },
      },
      {
        path: '/training',
        component: () => import('./pages/TrainingPage.vue'),
        name: 'training',
        meta: {
          title: 'Training',
          description: 'Practical MyTech training in management systems, digital forensics, software development and IT infrastructure.',
        },
      },
      {
        path: '/equipment',
        component: () => import('./pages/EquipmentPage.vue'),
        name: 'equipment',
        meta: {
          title: 'Equipment',
          description: 'MyTech supplies IT equipment - desktops, laptops, monitors, storage and networking - by quotation.',
        },
      },
      {
        path: '/company',
        component: () => import('./pages/CompanyPage.vue'),
        name: 'company',
        meta: {
          title: 'About MyTech',
          description: 'MyTech is a technology company operating across management systems, digital forensics, development and IT equipment.',
        },
      },
      {
        path: '/contact',
        component: () => import('./pages/ContactPage.vue'),
        name: 'contact',
        meta: {
          title: 'Contact',
          description: 'Get in touch with MyTech about a management system, a forensic case, a website or IT equipment.',
        },
      },
      {
        path: '/:catchAll(.*)*',
        component: () => import('./pages/ErrorNotFoundPage.vue'),
        name: 'mytech-404',
        meta: {
          title: 'Page not found',
          description: '',
        },
      },
    ],
  }
]
