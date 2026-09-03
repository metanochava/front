import { tdc } from 'quasar_resaas'

export let saleRoutes = [
  {
    path: '/list_sale',
    name: 'list_sale',
    component: () => import('./SaleLPage.vue'),
    meta: {
      title: tdc('Vista de') + ' ' + tdc('Vendas'),
      requiresAuth: true,
      icon: 'point_of_sale',
      requiredRole: 'list_sale',
    },
  },
  {
    path: '/add_sale',
    name: 'add_sale',
    component: () => import('./SaleSEPage.vue'),
    meta: {
      title: tdc('Ponto de Venda'),
      requiresAuth: true,
      icon: 'qr_code_scanner',
      requiredRole: 'add_sale',
    },
  },
  {
    path: '/view_sale/:id',
    name: 'view_sale',
    component: () => import('./SaleVPage.vue'),
    meta: {
      title: tdc('Visualizar') + ' ' + tdc('Venda'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_sale',
    },
  },
]
