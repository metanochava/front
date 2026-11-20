import { tdc } from 'quasar_resaas'

const crud = (name, model, icon, title) => ({
  path: `/${name}`,
  name,
  component: () => import('./HospitalityCrudPage.vue'),
  props: { model },
  meta: { title: tdc(title), requiresAuth: true, icon, requiredRole: name },
})

// the staff's pages (inside the main layout)
export let hospitalityRoutes = [
  {
    path: '/list_diningtable',
    name: 'list_diningtable',
    component: () => import('./TablesPage.vue'),
    meta: { title: tdc('Tables'), requiresAuth: true, icon: 'table_restaurant', requiredRole: 'list_diningtable' },
  },
  crud('list_diningarea', 'DiningArea', 'chair', 'Dining areas'),
  crud('list_tablerequest', 'TableRequest', 'notifications_active', 'Table requests'),
  crud('list_tableorder', 'TableOrder', 'receipt', 'Table orders'),
  {
    path: '/list_prepstation',
    name: 'list_prepstation',
    component: () => import('./PrepStationsPage.vue'),
    meta: { title: tdc('Preparation stations'), requiresAuth: true, icon: 'outdoor_grill', requiredRole: 'list_prepstation' },
  },
  {
    // the kitchen / bar screen (a tablet on the wall)
    path: '/view_kitchen',
    name: 'view_kitchen',
    component: () => import('./KitchenPage.vue'),
    meta: { title: tdc('Kitchen and bar'), requiresAuth: true, icon: 'soup_kitchen', requiredRole: 'kitchen_prepticket' },
  },
]

// the page a table's QR code opens: public, no session, no main layout
export const hospitalityPublicRoutes = [
  {
    path: '/mesa/:token',
    name: 'table_qr',
    component: () => import('./qr/TableQrPage.vue'),
    meta: { title: tdc('Menu') },
  },
]
