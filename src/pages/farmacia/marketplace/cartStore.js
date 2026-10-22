import { createBaseStore } from 'quasar_resaas'

// The reservation cart as a Pinia store, so it survives a reload (F5): the
// RESAAS persistence (createBaseStore's `persist`, quasar_resaas
// base/persistence.js) keeps `lines` in localStorage per user, for one day,
// and removes it at logout. There is no API resource behind it: the CRUD
// actions BaseStore adds are never used - the reservation itself is
// POST farmacia/marketplace/orders/ (placeOrders), where the backend
// revalidates prices and stock.
// A line keeps only what the cart shows and sends (cartRow): never the
// medicine's photos/videos (signed URLs) or anything else of the search row.
export const useMarketplaceCartStore = createBaseStore(
  'marketplacecart',
  { app: 'farmacia', model: 'MarketplaceCart' },
  {
    persist: {
      include: ['lines'],
      scope: 'user',
      ttl: 24 * 60 * 60 * 1000,
    },
    state: () => ({
      lines: [], // [{ row: cartRow(searchRow), quantity }]
    }),
  },
)

// the part of a search row (GET farmacia/marketplace/medicines/) a cart line needs
export function cartRow (row) {
  const medicine = row.medicine || {}
  const pharmacy = row.pharmacy || {}
  return {
    offer_id: row.offer_id,
    price: row.price,
    currency: row.currency,
    available_quantity: row.available_quantity ?? null,
    medicine: {
      name: medicine.name,
      strength: medicine.strength,
      presentation: medicine.presentation,
      prescription_required: Boolean(medicine.prescription_required),
    },
    pharmacy: { id: pharmacy.id, name: pharmacy.name },
  }
}
