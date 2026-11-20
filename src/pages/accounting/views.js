import { labelOf as label } from 'src/components/record/viewRoutes'

// The record pages (view_<model>, components/record/RecordViewPage) of the accounting models
// that have no view page of their own: the header and the tabs after "Details" - the related
// models' records that point at the record (model + its field, fk). A custom view_ page keeps
// its own route, so its model is not listed here. A tab shows only with list_<model>.

export const accountingViews = {
  Account: {
    label: 'Account',
    icon: 'description',
    title: (r) => label(r.name),
    subtitle: (r) => label(r.code),
    statusField: null,
    tabs: [
      { name: 'journalentryline', label: 'Journal entry lines', icon: 'list', model: 'JournalEntryLine', fk: 'account' },
      { name: 'postingrule', label: 'Posting rules (debit account)', icon: 'list', model: 'PostingRule', fk: 'debit_account' },
      { name: 'postingrule_credit_account', label: 'Posting rules (credit account)', icon: 'list', model: 'PostingRule', fk: 'credit_account' }
    ]
  },
  FiscalPeriod: {
    label: 'Fiscal period',
    icon: 'description',
    title: (r) => label(r.name)
  },
  Journal: {
    label: 'Journal',
    icon: 'description',
    title: (r) => label(r.name),
    subtitle: (r) => label(r.code),
    statusField: null,
    tabs: [
      { name: 'journalentry', label: 'Journal entries', icon: 'menu_book', model: 'JournalEntry', fk: 'journal' },
      { name: 'postingrule', label: 'Posting rules', icon: 'list', model: 'PostingRule', fk: 'journal' }
    ]
  },
  JournalEntryLine: {
    label: 'Journal entry line',
    icon: 'description',
    title: (r) => label(r.description),
    statusField: null
  },
  PostingRule: {
    label: 'Posting rule',
    icon: 'description',
    title: (r) => label(r.journal),
    statusField: null
  }
}
