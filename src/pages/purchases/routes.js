import { tdc } from 'quasar_resaas'

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
]
