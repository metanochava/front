import "./dashboard/dashboard.js"
import { tdc } from 'quasar_resaas'

import { customerRoutes } from './customer/customerRoutes'
import { customercontactRoutes } from './customercontact/customercontactRoutes'
import { saleRoutes } from './sale/saleRoutes'
import { paymentRoutes } from './payment/paymentRoutes'
import { taxRoutes } from './tax/taxRoutes'

export let vendasRoutes = [
  {
    path: '/view_sales_dashboard',
    name: 'view_sales_dashboard',
    component: () => import('./VendasDashboard.vue'),
    meta: {
      title: tdc('Dashboard') + ' ' + tdc('Sales'),
      requiresAuth: true,
      icon: 'dashboard',
      requiredRole: 'view_dashboard_sales',
    },
  },
  ...customerRoutes,
  ...customercontactRoutes,
  ...saleRoutes,
  ...paymentRoutes,
  ...taxRoutes,
]
