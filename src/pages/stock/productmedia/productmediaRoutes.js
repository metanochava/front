import { tdc } from 'quasar_resaas'

export let productmediaRoutes = [
  {
    path: '/view_product_gallery/:id',
    name: 'view_product_gallery',
    component: () => import('./ProductGalleryPage.vue'),
    meta: {
      title: tdc('Galeria') + ' ' + tdc('do Produto'),
      requiresAuth: true,
      icon: 'photo_library',
      requiredRole: 'list_productmedia',
    },
  },
]
