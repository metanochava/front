import { labelOf as label } from 'src/components/record/viewRoutes'

// The record pages (view_<model>, components/record/RecordViewPage) of the catalog, inventory models
// that have no view page of their own: the header and the tabs after "Details" - the related
// models' records that point at the record (model + its field, fk). A custom view_ page keeps
// its own route, so its model is not listed here. A tab shows only with list_<model>.

export const catalogViews = {
  PriceListItem: {
    label: 'Price list item',
    icon: 'price_change',
    title: (r) => label(r.price_list),
    statusField: null
  },
  PriceList: {
    label: 'Price list',
    icon: 'sell',
    title: (r) => label(r.name),
    subtitle: (r) => label(r.code),
    statusField: null,
    tabs: [
      { name: 'pricelistitem', label: 'Price list items', icon: 'price_change', model: 'PriceListItem', fk: 'price_list' }
    ]
  },
  Product: {
    label: 'Product',
    icon: 'inventory_2',
    title: (r) => label(r.nome),
    subtitle: (r) => label(r.codigo),
    statusField: null,
    tabs: [
      { name: 'pricelistitem', label: 'Price list items', icon: 'price_change', model: 'PriceListItem', fk: 'product' },
      { name: 'productmedia', label: 'Product media', icon: 'list', model: 'ProductMedia', fk: 'product' },
      { name: 'batch', label: 'Batches', icon: 'qr_code_2', model: 'Batch', fk: 'product', app: 'inventory' },
      { name: 'inventorycountline', label: 'Inventory count lines', icon: 'list', model: 'InventoryCountLine', fk: 'product', app: 'inventory' },
      { name: 'stockreservation', label: 'Stock reservations', icon: 'lock', model: 'StockReservation', fk: 'product', app: 'inventory' },
      { name: 'stockitem', label: 'Stock items', icon: 'inventory', model: 'StockItem', fk: 'product', app: 'inventory' },
      { name: 'stockmovement', label: 'Stock movements', icon: 'receipt_long', model: 'StockMovement', fk: 'product', app: 'inventory' }
    ]
  },
  ProductCategory: {
    label: 'Product category',
    icon: 'category',
    title: (r) => label(r.nome),
    statusField: null,
    tabs: [
      { name: 'product', label: 'Products', icon: 'inventory_2', model: 'Product', fk: 'categoria' }
    ]
  },
  ProductMedia: {
    label: 'Product media',
    icon: 'description',
    title: (r) => label(r.product),
    statusField: null
  }
}

export const inventoryViews = {
  Batch: {
    label: 'Batch',
    icon: 'qr_code_2',
    title: (r) => label(r.product),
    statusField: null,
    tabs: [
      { name: 'batchstock', label: 'Batch stocks', icon: 'list', model: 'BatchStock', fk: 'batch' },
      { name: 'inventorycountline', label: 'Inventory count lines', icon: 'list', model: 'InventoryCountLine', fk: 'batch' },
      { name: 'stockmovement', label: 'Stock movements', icon: 'receipt_long', model: 'StockMovement', fk: 'batch' }
    ]
  },
  BatchStock: {
    label: 'Batch stock',
    icon: 'description',
    title: (r) => label(r.batch),
    statusField: null
  },
  InventoryCountLine: {
    label: 'Inventory count line',
    icon: 'description',
    title: (r) => label(r.inventory_count),
    statusField: null
  },
  InventorySetting: {
    label: 'Inventory setting',
    icon: 'settings',
    statusField: null
  },
  StockReservation: {
    label: 'Stock reservation',
    icon: 'lock',
    title: (r) => label(r.product)
  },
  StockItem: {
    label: 'Stock item',
    icon: 'inventory',
    title: (r) => label(r.product),
    statusField: null
  },
  StockMovement: {
    label: 'Stock movement',
    icon: 'receipt_long',
    title: (r) => label(r.product),
    statusField: null
  },
  Warehouse: {
    label: 'Warehouse',
    icon: 'warehouse',
    title: (r) => label(r.nome),
    subtitle: (r) => label(r.codigo),
    statusField: null,
    tabs: [
      { name: 'batchstock', label: 'Batch stocks', icon: 'list', model: 'BatchStock', fk: 'warehouse' },
      { name: 'inventorycount', label: 'Inventory counts', icon: 'fact_check', model: 'InventoryCount', fk: 'warehouse' },
      { name: 'stockreservation', label: 'Stock reservations', icon: 'lock', model: 'StockReservation', fk: 'warehouse' },
      { name: 'stockitem', label: 'Stock items', icon: 'inventory', model: 'StockItem', fk: 'warehouse' },
      { name: 'stockmovement', label: 'Stock movements', icon: 'receipt_long', model: 'StockMovement', fk: 'warehouse' }
    ]
  }
}
