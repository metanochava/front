<template>
  <q-page class="q-pa-sm">
    <div class="text-h6 q-mb-sm row items-center q-gutter-sm">
      <q-icon name="menu_book" />
      <span>{{ tdc('Journal entries') }}</span>
      <q-space />
      <s-input v-model="search" debounce="400" style="width: 220px" :placeholder="tdc('Search')" @update:model-value="onSearch">
        <template #prepend><q-icon name="search" /></template>
      </s-input>
      <s-btn
        v-if="User.can('add_journalentry')"
        color="primary" icon="add" :label="tdc('New journal entry')" data-test="je-new" @click="openCreate"
      />
    </div>

    <q-table
      flat bordered
      :rows="Entry.rows" :columns="columns" row-key="id"
      :loading="Entry.loading" v-model:pagination="pagination"
      data-test="je-table"
      @request="onRequest"
      @row-click="(evt, row) => router.push({ name: 'view_journalentry', params: { id: row.id } })"
    >
      <template #body-cell-status="props">
        <q-td :props="props">
          <q-badge :color="statusColor(props.row.status?.value ?? props.row.status)">
            {{ props.row.status?.label || props.row.status }}
          </q-badge>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="showCreate" persistent>
      <s-modal-card :title="tdc('New journal entry')" icon="menu_book" width="460px" form @close="showCreate = false" @submit="create">
        <div class="column q-gutter-sm">
          <s-select
            v-model="form.journal" :api="journalSelectUrl"
            option-label="label" option-value="value" emit-value map-options
            :label="tdc('Journal')" :error="!!errors.journal" :error-message="errors.journal"
          />
          <s-date v-model="form.date" :label="tdc('Date')" :error="!!errors.date" :error-message="errors.date" />
          <s-input v-model="form.description" :label="tdc('Description')" :error="!!errors.description" :error-message="errors.description" />
          <s-input v-model="form.reference" :label="tdc('Reference')" />
        </div>
        <template #footer>
          <s-btn flat :label="tdc('Cancel')" @click="showCreate = false" />
          <s-btn color="primary" type="submit" :label="tdc('Create')" :loading="saving" />
        </template>
      </s-modal-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { tdc, url, useUserStore } from 'quasar_resaas'
import { useJournalEntryStore } from './journalEntryStore'
import { statusColor } from './status'

const Entry = useJournalEntryStore()
const User = useUserStore()
const router = useRouter()
const search = ref('')

const journalSelectUrl = url({ type: 'u', url: 'accounting/journals', params: { select: 'true' } })

const columns = [
  { name: 'date', label: tdc('Date'), field: 'date', align: 'left' },
  { name: 'number', label: tdc('Number'), field: row => row.number || '—', align: 'left' },
  { name: 'journal', label: tdc('Journal'), field: row => row.journal?.label, align: 'left' },
  { name: 'description', label: tdc('Description'), field: 'description', align: 'left' },
  { name: 'status', label: tdc('Status'), field: 'status', align: 'left' },
  { name: 'total_debit', label: tdc('Debit'), field: 'total_debit', align: 'right' },
]

const pagination = ref({ page: 1, rowsPerPage: 10, rowsNumber: 0 })

async function fetch() {
  await Entry.loadData({ page: pagination.value.page, page_size: pagination.value.rowsPerPage })
  pagination.value.rowsNumber = Entry.pagination.rowsNumber
}

function onRequest(props) {
  pagination.value.page = props.pagination.page
  pagination.value.rowsPerPage = props.pagination.rowsPerPage
  fetch()
}

function onSearch(value) {
  Entry.setSearch(value)
  pagination.value.page = 1
  fetch()
}

const showCreate = ref(false)
const saving = ref(false)
const errors = computed(() => Entry.errors || {})
const form = reactive({ journal: null, date: null, description: '', reference: '' })

function openCreate() {
  Object.assign(form, { journal: null, date: new Date().toISOString().slice(0, 10), description: '', reference: '' })
  Entry.errors = {}
  showCreate.value = true
}

async function create() {
  saving.value = true
  try {
    Entry.form = { ...form }
    const created = await Entry.create()
    showCreate.value = false
    if (created?.id) router.push({ name: 'view_journalentry', params: { id: created.id } })
  } catch {
    // field messages are in Entry.errors
  } finally {
    saving.value = false
  }
}

onMounted(fetch)
</script>
