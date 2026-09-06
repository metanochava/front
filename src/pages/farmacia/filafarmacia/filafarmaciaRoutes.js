
import { tdc } from 'quasar_resaas'

export let filafarmaciaRoutes = [
  {
    path: '/list_filafarmacia',
    name: 'list_filafarmacia',
    component: () => import('./FilafarmaciaLPage.vue'),
    meta: {
      title: tdc('Vista de') + ' ' + tdc('Fila de Farmácia'),
      requiresAuth: true,
      icon: 'list',
      requiredRole: 'list_filafarmacia',
    },
  },
  {
    path: '/add_filafarmacia',
    name: 'add_filafarmacia',
    component: () => import('./FilafarmaciaSEPage.vue'),
    meta: {
      title: tdc('Adicionar') + ' ' + tdc('Fila de Farmácia'),
      requiresAuth: true,
      icon: 'add',
      requiredRole: 'add_filafarmacia',
    },
  },
  {
    path: '/change_filafarmacia/:id',
    name: 'change_filafarmacia',
    component: () => import('./FilafarmaciaSEPage.vue'),
    meta: {
      title: tdc('Editar') + ' ' + tdc('Fila de Farmácia'),
      requiresAuth: true,
      icon: 'edit',
      requiredRole: 'change_filafarmacia',
    },
  },
  {
    path: '/view_filafarmacia/:id',
    name: 'view_filafarmacia',
    component: () => import('./FilafarmaciaVPage.vue'),
    meta: {
      title: tdc('Visualizar') + ' ' + tdc('Fila de Farmácia'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_filafarmacia',
    },
  }
]
