import "./dashboard/dashboard.js"
import { tdc } from 'quasar_resaas'

import { customerRoutes } from './customer/customerRoutes'
import { customercontactRoutes } from './customercontact/customercontactRoutes'
import { saleRoutes } from './sale/saleRoutes'
import { paymentRoutes } from './payment/paymentRoutes'

export let vendasRoutes = [
  {
    path: '/view_sales_dashboard',
    name: 'view_sales_dashboard',
    component: () => import('./VendasDashboard.vue'),
    meta: {
      title: tdc('Dashboard') + ' ' + tdc('Vendas'),
      requiresAuth: true,
      icon: 'dashboard',
      requiredRole: 'view_dashboard_sales',
    },
  },
  ...customerRoutes,
  ...customercontactRoutes,
  ...saleRoutes,
  ...paymentRoutes,
]
