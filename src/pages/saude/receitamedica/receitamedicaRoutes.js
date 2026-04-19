
import { tdc } from 'quasar_resaas'

export let receitamedicaRoutes = [
  {
    path: '/list_receitamedica',
    name: 'list_receitamedica',
    component: () => import('./ReceitamedicaLPage.vue'),
    meta: {
      title: tdc('Vista de') + ' ' + tdc('receitamedica'),
      requiresAuth: true,
      icon: 'list',
      requiredRole: 'list_receitamedica',
    },
  },
  {
    path: '/add_receitamedica',
    name: 'add_receitamedica',
    component: () => import('./ReceitamedicaSEPage.vue'),
    meta: {
      title: tdc('Adicionar') + ' ' + tdc('receitamedica'),
      requiresAuth: true,
      icon: 'add',
      requiredRole: 'add_receitamedica',
    },
  },
  {
    path: '/change_receitamedica/:id',
    name: 'change_receitamedica',
    component: () => import('./ReceitamedicaSEPage.vue'),
    meta: {
      title: tdc('Editar') + ' ' + tdc('receitamedica'),
      requiresAuth: true,
      icon: 'edit',
      requiredRole: 'change_receitamedica',
    },
  },
  {
    path: '/view_receitamedica/:id',
    name: 'view_receitamedica',
    component: () => import('./ReceitamedicaVPage.vue'),
    meta: {
      title: tdc('Visualizar') + ' ' + tdc('receitamedica'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_receitamedica',
    },
  }
]

