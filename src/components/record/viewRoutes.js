import { tdc } from 'quasar_resaas'

// The view_<model>/:id routes of a module's record pages (the schema's
// routes.view), from its views.js: {Model: {label, icon, title, subtitle,
// tabs, defaultTab, statusField}} - see RecordViewPage. A module only lists
// the models whose view_ is not a page of its own (a custom page keeps its
// route; the names must stay unique - router/routes.spec.js).
export function viewRoutes (app, views) {
  return Object.entries(views).map(([model, view]) => {
    const name = `view_${model.toLowerCase()}`
    return {
      path: `/${name}/:id`,
      name,
      component: () => import('./RecordViewPage.vue'),
      props: (route) => ({
        app: view.app || app,
        model,
        id: String(route.params.id),
        tabs: view.tabs || [],
        defaultTab: view.defaultTab || null,
        title: view.title || null,
        subtitle: view.subtitle || null,
        icon: view.icon || null,
        statusField: view.statusField === undefined ? 'status' : view.statusField
      }),
      meta: { title: tdc(view.label || model), requiresAuth: true, icon: view.icon || 'visibility', requiredRole: name }
    }
  })
}

// The add_<model> and change_<model>/:id routes of models with no form page
// of their own (RecordFormPage: the schema's form as a page). `models`: the
// model names, or a views.js object - a model whose view sets `form: false`
// keeps its own pages (names must stay unique - views.spec.js).
export function formRoutes (app, models) {
  const entries = Array.isArray(models)
    ? models.map(model => [model, {}])
    : Object.entries(models).filter(([, view]) => view.form !== false)
  return entries.flatMap(([model, view]) => {
    const name = model.toLowerCase()
    const props = (route) => ({
      app: view.app || app, model, label: view.label || '', icon: view.icon || null,
      id: route.params.id ? String(route.params.id) : null
    })
    return [
      { path: `/add_${name}`, name: `add_${name}`, component: () => import('./RecordFormPage.vue'), props,
        meta: { title: `${tdc('New')} ${tdc(view.label || model)}`, requiresAuth: true, icon: 'add', requiredRole: `add_${name}` } },
      { path: `/change_${name}/:id`, name: `change_${name}`, component: () => import('./RecordFormPage.vue'), props,
        meta: { title: `${tdc('Edit')} ${tdc(view.label || model)}`, requiresAuth: true, icon: 'edit', requiredRole: `change_${name}` } }
    ]
  })
}

// The form routes still missing among `routes` (and their children): every
// add_/change_ of `sources` ([[app, views or model names], ...]) whose name
// is not already a route - a module's own page always wins.
// Models that get no add_/change_ page at all: lines and child records are
// created inside their parent document; the others are written by the system
// or by their own flow (a sale's pagar, a purchase order's reception, the
// table's QR, the tuition rules...), never typed in by hand.
export const NO_FORM_PAGE = new Set([
  // lines / children of a document
  'saleitem', 'purchaseorderline', 'goodsreceiptline', 'journalentryline', 'inventorycountline',
  'employeeonboardingtask', 'employeeoffboardingtask', 'reviewcompetencyrating', 'itemdispensa',
  // written by the system or by their own flow
  'stockitem', 'batchstock', 'stockmovement', 'stockreservation', 'tablerequest', 'tableorder',
  'remoteaccesssession', 'tuitioncharge', 'submission', 'onlineorder', 'countersale',
  'payment', 'goodsreceipt',
  // managed in their parent's page: the product gallery, the price list
  'productmedia', 'pricelistitem',
])

export function missingFormRoutes (routes, sources) {
  const names = new Set()
  const walk = (list) => (list || []).forEach(r => { if (r.name) names.add(r.name); walk(r.children) })
  walk(routes)
  return sources.flatMap(([app, models]) => formRoutes(app, models)).filter(r => {
    if (names.has(r.name)) return false
    if (NO_FORM_PAGE.has(r.name.replace(/^(add|change)_/, ''))) return false
    names.add(r.name)
    return true
  })
}

// the label of a value as the API reads it: a relation {id, value, label}, a choice, or plain
export const labelOf = (value) => (value && typeof value === 'object') ? (value.label ?? value.value ?? '') : (value ?? '')
export const joinLabels = (...parts) => parts.map(labelOf).filter(Boolean).join(' · ')
