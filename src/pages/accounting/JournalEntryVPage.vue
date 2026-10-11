<template>
  <q-page class="q-pa-sm" v-if="entry">
    <div class="text-h6 q-mb-sm row items-center q-gutter-sm">
      <q-icon name="menu_book" />
      <span data-test="je-title">{{ entry.number || tdc('Draft') }} — {{ entry.description }}</span>
      <q-badge :color="statusColor(status)" data-test="je-status">{{ entry.status?.label || status }}</q-badge>
      <q-space />
      <s-btn
        v-if="status === 'draft' && User.can('post_entry_journalentry')"
        color="positive" icon="task_alt" :label="tdc('Post')"
        :disable="!balanced" :loading="acting" data-test="je-post" @click="post"
      />
      <s-btn
        v-if="status === 'posted' && !entry.reversal_of && User.can('reverse_journalentry')"
        flat color="negative" icon="undo" :label="tdc('Reverse')" :loading="acting" data-test="je-reverse" @click="reverse"
      />
    </div>

    <div class="row q-col-gutter-sm q-mb-sm">
      <div class="col-6 col-sm-3" v-for="card in cards" :key="card.label">
        <s-card flat bordered><q-card-section>
          <div class="text-caption text-grey-7">{{ card.label }}</div>
          <div class="text-subtitle1" :class="card.class">{{ card.value }}</div>
        </q-card-section></s-card>
      </div>
    </div>

    <q-banner v-if="entry.source_event" dense class="q-mb-sm" :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'">
      {{ tdc('Automatic entry') }}: {{ entry.source_event }}
    </q-banner>

    <s-card flat bordered>
      <q-card-section>
        <div class="text-subtitle1 text-weight-medium q-mb-sm">{{ tdc('Lines') }}</div>
        <q-table
          flat dense :rows="Line.rows" :columns="columns" row-key="id"
          hide-pagination :rows-per-page-options="[0]" :no-data-label="tdc('No data')" data-test="je-lines"
        >
          <template #body-cell-actions="props">
            <q-td :props="props">
              <s-btn
                v-if="status === 'draft' && User.can('delete_journalentryline')"
                flat dense round icon="delete" color="negative" @click="removeLine(props.row)"
              />
            </q-td>
          </template>
        </q-table>

        <div v-if="status === 'draft' && User.can('add_journalentryline')" class="row q-col-gutter-sm items-start q-mt-sm">
          <div class="col-12 col-sm-4">
            <s-select
              v-model="newLine.account" :api="accountSelectUrl"
              option-label="label" option-value="value" emit-value map-options
              :label="tdc('Account')" :error="!!lineErrors.account" :error-message="lineErrors.account"
            />
          </div>
          <div class="col-12 col-sm">
            <s-input v-model="newLine.description" :label="tdc('Description')" />
          </div>
          <div class="col-6 col-sm-2">
            <s-input v-model.number="newLine.debit" type="number" step="0.01" min="0" :label="tdc('Debit')"
              :error="!!lineErrors.debit" :error-message="lineErrors.debit" />
          </div>
          <div class="col-6 col-sm-2">
            <s-input v-model.number="newLine.credit" type="number" step="0.01" min="0" :label="tdc('Credit')" />
          </div>
          <div class="col-12 col-sm-auto">
            <s-btn color="primary" icon="add" :label="tdc('Add line')" :loading="adding" data-test="je-add-line" @click="addLine" />
          </div>
        </div>
      </q-card-section>
    </s-card>
  </q-page>

  <q-page v-else class="flex flex-center">
    <q-spinner color="primary" size="48px" />
  </q-page>
</template>

<script setup>
import { reactive, ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { tdc, url, useUserStore, sDialog } from 'quasar_resaas'
import { useJournalEntryStore, useJournalEntryLineStore } from './journalEntryStore'
import { statusColor } from './status'

const route = useRoute()
const router = useRouter()
const User = useUserStore()
const Entry = useJournalEntryStore()
const Line = useJournalEntryLineStore()

const id = computed(() => route.params.id)
const entry = computed(() => (Entry.row?.id === id.value ? Entry.row : null))
const status = computed(() => entry.value?.status?.value ?? entry.value?.status)

const accountSelectUrl = url({ type: 'u', url: 'accounting/accounts', params: { select: 'true', allow_posting: 'true' } })

const totalDebit = computed(() => Line.rows.reduce((sum, line) => sum + Number(line.debit || 0), 0))
const totalCredit = computed(() => Line.rows.reduce((sum, line) => sum + Number(line.credit || 0), 0))
// UX only: the backend validates the balance when posting
const balanced = computed(() => Line.rows.length >= 2 && totalDebit.value > 0 && totalDebit.value.toFixed(2) === totalCredit.value.toFixed(2))

const cards = computed(() => [
  { label: tdc('Date'), value: entry.value.date },
  { label: tdc('Journal'), value: entry.value.journal?.label || '—' },
  { label: tdc('Debit'), value: totalDebit.value.toFixed(2) },
  {
    label: tdc('Credit'),
    value: totalCredit.value.toFixed(2),
    class: balanced.value || status.value !== 'draft' ? '' : 'text-negative',
  },
])

const columns = [
  { name: 'account', label: tdc('Account'), field: row => row.label || row.account?.label, align: 'left' },
  { name: 'description', label: tdc('Description'), field: 'description', align: 'left' },
  { name: 'debit', label: tdc('Debit'), field: 'debit', align: 'right' },
  { name: 'credit', label: tdc('Credit'), field: 'credit', align: 'right' },
  { name: 'actions', label: '', field: 'actions', align: 'center' },
]

async function refresh() {
  await Entry.getById(id.value)
  await Line.loadData({ entry: id.value, page_size: 500 })
}

const acting = ref(false)

async function post() {
  acting.value = true
  try {
    await Entry.post(id.value)
  } catch {
    // shown by the alert funnel
  } finally {
    await refresh()
    acting.value = false
  }
}

function reverse() {
  sDialog({
    title: tdc('Reverse'),
    message: tdc('Post an opposite entry that cancels this one?'),
    cancel: true,
  }).onOk(async () => {
    acting.value = true
    try {
      const reversal = await Entry.reverse(id.value)
      router.push({ name: 'view_journalentry', params: { id: reversal.id } })
    } catch {
      await refresh()
    } finally {
      acting.value = false
    }
  })
}

const newLine = reactive({ account: null, description: '', debit: null, credit: null })
const adding = ref(false)
const lineErrors = computed(() => Line.errors || {})

async function addLine() {
  adding.value = true
  try {
    Line.form = { entry: id.value, ...newLine, debit: newLine.debit || 0, credit: newLine.credit || 0 }
    await Line.create()
    Object.assign(newLine, { account: null, description: '', debit: null, credit: null })
    await refresh()
  } catch {
    // field messages are in Line.errors
  } finally {
    adding.value = false
  }
}

function removeLine(line) {
  sDialog({ title: tdc('Remove line'), message: tdc('Remove this line?'), cancel: true }).onOk(async () => {
    Line.form = { id: line.id }
    await Line.remove()
    await refresh()
  })
}

watch(id, refresh)
onMounted(refresh)
</script>
