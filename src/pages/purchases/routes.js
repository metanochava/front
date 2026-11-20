import { tdc } from 'quasar_resaas'
import { viewRoutes } from 'src/components/record/viewRoutes'
import { purchasesViews } from './views'

export let purchasesRoutes = [
  {
    path: '/list_supplier',
    name: 'list_supplier',
    component: () => import('./supplier/SupplierLPage.vue'),
    meta: {
      title: tdc('Suppliers'),
      requiresAuth: true,
      icon: 'local_shipping',
      requiredRole: 'list_supplier',
    },
  },
  // one manual page for add_ and change_ (components/record/useRecordForm)
  {
    path: '/add_supplier',
    name: 'add_supplier',
    component: () => import('./supplier/SupplierSEPage.vue'),
    meta: { title: tdc('New supplier'), requiresAuth: true, icon: 'add', requiredRole: 'add_supplier' },
  },
  {
    path: '/change_supplier/:id',
    name: 'change_supplier',
    component: () => import('./supplier/SupplierSEPage.vue'),
    meta: { title: tdc('Edit supplier'), requiresAuth: true, icon: 'edit', requiredRole: 'change_supplier' },
  },
  {
    path: '/list_purchaseorder',
    name: 'list_purchaseorder',
    component: () => import('./purchaseorder/PurchaseOrderLPage.vue'),
    meta: {
      title: tdc('Purchase orders'),
      requiresAuth: true,
      icon: 'receipt_long',
      requiredRole: 'list_purchaseorder',
    },
  },
  {
    path: '/view_purchaseorder/:id',
    name: 'view_purchaseorder',
    component: () => import('./purchaseorder/PurchaseOrderVPage.vue'),
    meta: {
      title: tdc('Purchase order'),
      requiresAuth: true,
      icon: 'receipt_long',
      requiredRole: 'view_purchaseorder',
    },
  },
  {
    path: '/list_goodsreceipt',
    name: 'list_goodsreceipt',
    component: () => import('./goodsreceipt/GoodsReceiptLPage.vue'),
    meta: {
      title: tdc('Goods receipts'),
      requiresAuth: true,
      icon: 'move_to_inbox',
      requiredRole: 'list_goodsreceipt',
    },
  },
  // record pages of the models without a view page of their own (views.js)
  ...viewRoutes('purchases', purchasesViews),
]
