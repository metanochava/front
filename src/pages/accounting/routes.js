import { tdc } from 'quasar_resaas'

const crud = (name, model, icon, title) => ({
  path: `/${name}`,
  name,
  component: () => import('./AccountingCrudPage.vue'),
  props: { model },
  meta: { title: tdc(title), requiresAuth: true, icon, requiredRole: name },
})

export let accountingRoutes = [
  crud('list_account', 'Account', 'account_tree', 'Chart of accounts'),
  crud('list_journal', 'Journal', 'book', 'Journals'),
  crud('list_fiscalperiod', 'FiscalPeriod', 'event', 'Fiscal periods'),
  crud('list_postingrule', 'PostingRule', 'rule', 'Posting rules'),
  {
    path: '/list_journalentry',
    name: 'list_journalentry',
    component: () => import('./JournalEntryLPage.vue'),
    meta: { title: tdc('Journal entries'), requiresAuth: true, icon: 'menu_book', requiredRole: 'list_journalentry' },
  },
  {
    path: '/view_journalentry/:id',
    name: 'view_journalentry',
    component: () => import('./JournalEntryVPage.vue'),
    meta: { title: tdc('Journal entry'), requiresAuth: true, icon: 'menu_book', requiredRole: 'view_journalentry' },
  },
  {
    path: '/view_trial_balance',
    name: 'view_trial_balance',
    component: () => import('./TrialBalancePage.vue'),
    meta: { title: tdc('Trial balance'), requiresAuth: true, icon: 'balance', requiredRole: 'trial_balance_account' },
  },
]
