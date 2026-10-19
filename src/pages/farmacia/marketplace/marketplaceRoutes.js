import { tdc } from 'quasar_resaas'

const crud = (model, title, icon) => ({
  path: `/list_${model.toLowerCase()}`,
  name: `list_${model.toLowerCase()}`,
  component: () => import('./MarketplaceCrudPage.vue'),
  props: { model },
  meta: { title: tdc(title), requiresAuth: true, icon, requiredRole: `list_${model.toLowerCase()}` },
})

export let marketplaceRoutes = [
  {
    // no permission: any signed-in user can search (backend: IsAuthenticated)
    path: '/farmacia_online',
    name: 'farmacia_marketplace',
    component: () => import('./MarketplacePage.vue'),
    meta: { title: tdc('Online pharmacy'), requiresAuth: true, icon: 'travel_explore' },
  },
  crud('PharmacyListing', 'Marketplace listing', 'storefront'),
  crud('PharmacyOffer', 'Marketplace offers', 'sell'),
  crud('MedicineCatalogItem', 'Medicine catalogue', 'menu_book'),
  {
    path: '/view_medicine_media/:id',
    name: 'view_medicine_media',
    component: () => import('./MedicineMediaPage.vue'),
    meta: { title: tdc('Photos and videos'), requiresAuth: true, icon: 'photo_library', requiredRole: 'list_medicinecatalogmedia' },
  },
]
