import { tdc } from 'quasar_resaas'

import { warehouseRoutes } from './warehouse/warehouseRoutes'
import { productcategoryRoutes } from './productcategory/productcategoryRoutes'
import { productRoutes } from './product/productRoutes'
import { productmediaRoutes } from './productmedia/productmediaRoutes'
import { stockitemRoutes } from './stockitem/stockitemRoutes'
import { stockmovementRoutes } from './stockmovement/stockmovementRoutes'
import { inventorycountRoutes } from './inventorycount/inventorycountRoutes'
import { inventorysettingRoutes } from './inventorysetting/inventorysettingRoutes'

export let stockRoutes = [
  {
    path: '/view_inventory_dashboard',
    name: 'view_inventory_dashboard',
    component: () => import('./StockDashboard.vue'),
    meta: {
      title: tdc('Dashboard') + ' ' + tdc('Stock'),
      requiresAuth: true,
      icon: 'dashboard',
      requiredRole: 'view_dashboard_inventory',
    },
  },
  ...warehouseRoutes,
  ...productcategoryRoutes,
  ...productRoutes,
  ...productmediaRoutes,
  ...stockitemRoutes,
  ...stockmovementRoutes,
  ...inventorycountRoutes,
  ...inventorysettingRoutes,
]
