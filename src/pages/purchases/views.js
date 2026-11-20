import { labelOf as label } from 'src/components/record/viewRoutes'

// The record pages (view_<model>, components/record/RecordViewPage) of the purchases models
// that have no view page of their own: the header and the tabs after "Details" - the related
// models' records that point at the record (model + its field, fk). A custom view_ page keeps
// its own route, so its model is not listed here. A tab shows only with list_<model>.

export const purchasesViews = {
  GoodsReceipt: {
    label: 'Goods receipt',
    icon: 'move_to_inbox',
    title: (r) => label(r.order),
    statusField: null,
    tabs: [
      { name: 'goodsreceiptline', label: 'Goods receipt lines', icon: 'list', model: 'GoodsReceiptLine', fk: 'receipt' }
    ]
  },
  GoodsReceiptLine: {
    label: 'Goods receipt line',
    icon: 'description',
    title: (r) => label(r.receipt),
    statusField: null
  },
  PurchaseOrderLine: {
    label: 'Purchase order line',
    icon: 'description',
    title: (r) => label(r.description),
    statusField: null,
    tabs: [
      { name: 'goodsreceiptline', label: 'Goods receipt lines', icon: 'list', model: 'GoodsReceiptLine', fk: 'order_line' }
    ]
  },
  Supplier: {
    label: 'Supplier',
    icon: 'local_shipping',
    title: (r) => label(r.company_name),
    statusField: null,
    defaultTab: 'personal',
    tabs: [
      { name: 'personal', label: 'Personal', icon: 'person', person: 'person', permission: 'view_person' },
      { name: 'purchaseorder', label: 'Purchase orders', icon: 'receipt_long', model: 'PurchaseOrder', fk: 'supplier' }
    ]
  }
}
