import { tdc } from 'quasar_resaas'

export let pricelistRoutes = [
  {
    path: '/list_pricelist',
    name: 'list_pricelist',
    component: () => import('./PriceListCrudPage.vue'),
    props: { model: 'PriceList' },
    meta: { title: tdc('Price lists'), requiresAuth: true, icon: 'sell', requiredRole: 'list_pricelist' },
  },
  {
    path: '/list_pricelistitem',
    name: 'list_pricelistitem',
    component: () => import('./PriceListCrudPage.vue'),
    props: { model: 'PriceListItem' },
    meta: { title: tdc('Prices'), requiresAuth: true, icon: 'price_change', requiredRole: 'list_pricelistitem' },
  },
  // one manual page for add_ and change_ (components/record/useRecordForm)
  {
    path: '/add_pricelist',
    name: 'add_pricelist',
    component: () => import('./PricelistSEPage.vue'),
    meta: { title: tdc('New price list'), requiresAuth: true, icon: 'add', requiredRole: 'add_pricelist' },
  },
  {
    path: '/change_pricelist/:id',
    name: 'change_pricelist',
    component: () => import('./PricelistSEPage.vue'),
    meta: { title: tdc('Edit price list'), requiresAuth: true, icon: 'edit', requiredRole: 'change_pricelist' },
  },
]
