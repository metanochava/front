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
]
