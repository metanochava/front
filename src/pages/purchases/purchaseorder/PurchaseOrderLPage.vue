<template>
  <q-page class="q-pa-sm">
    <div class="text-h6 q-mb-sm row items-center q-gutter-sm">
      <q-icon name="receipt_long" />
      <span>{{ tdc('Purchase orders') }}</span>
      <q-space />
      <s-input
        v-model="search" debounce="400" style="width: 220px"
        :placeholder="tdc('Search')"
        data-test="po-search"
        @update:model-value="onSearch"
      >
        <template #prepend><q-icon name="search" /></template>
      </s-input>
      <s-btn
        v-if="User.can('add_purchaseorder')"
        color="primary" icon="add" :label="tdc('New purchase order')"
        data-test="po-new"
        @click="openCreate"
      />
    </div>

    <q-table
      flat bordered
      :rows="PurchaseOrder.rows"
      :columns="columns"
      row-key="id"
      :loading="PurchaseOrder.loading"
      v-model:pagination="pagination"
      data-test="po-table"
      @request="onRequest"
      @row-click="(evt, row) => router.push({ name: 'view_purchaseorder', params: { id: row.id } })"
    >
      <template #body-cell-status="props">
        <q-td :props="props">
          <q-badge :color="statusColor(statusOf(props.row))">{{ props.row.status?.label || props.row.status }}</q-badge>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="showCreate" persistent>
      <s-modal-card :title="tdc('New purchase order')" icon="receipt_long" width="460px" form @close="showCreate = false" @submit="create">
        <div class="column q-gutter-sm">
          <s-select
            v-model="form.supplier" :api="supplierSelectUrl"
            option-label="label" option-value="value" emit-value map-options
            :label="tdc('Supplier')" :error="!!errors.supplier" :error-message="errors.supplier"
            data-test="po-supplier"
          />
          <s-select
            v-if="User.can('list_warehouse')"
            v-model="form.warehouse_id" :api="warehouseSelectUrl"
            option-label="label" option-value="value" emit-value map-options clearable
            :label="tdc('Warehouse')" :error="!!errors.warehouse_id" :error-message="errors.warehouse_id"
          />
          <s-date v-model="form.expected_date" :label="tdc('Expected date')" />
          <s-input v-model="form.supplier_reference" :label="tdc('Supplier reference')" />
          <s-input v-model="form.notes" type="textarea" autogrow :label="tdc('Notes')" />
        </div>

        <template #footer>
          <s-btn flat :label="tdc('Cancel')" @click="showCreate = false" />
          <s-btn color="primary" type="submit" :label="tdc('Create')" :loading="saving" data-test="po-create" />
        </template>
      </s-modal-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { tdc, url, useUserStore } from 'quasar_resaas'
import { usePurchaseOrderStore } from './purchaseOrderStore'
import { statusColor, statusOf } from './status'

const PurchaseOrder = usePurchaseOrderStore()
const User = useUserStore()
const router = useRouter()
const search = ref('')

const supplierSelectUrl = url({ type: 'u', url: 'purchases/suppliers', params: { select: 'true' } })
const warehouseSelectUrl = url({ type: 'u', url: 'inventory/warehouses', params: { select: 'true' } })

const columns = [
  { name: 'number', label: tdc('Number'), field: 'number', align: 'left' },
  { name: 'supplier', label: tdc('Supplier'), field: row => row.supplier_label || row.supplier?.label, align: 'left' },
  { name: 'order_date', label: tdc('Order date'), field: 'order_date', align: 'left' },
  { name: 'expected_date', label: tdc('Expected date'), field: 'expected_date', align: 'left' },
  { name: 'status', label: tdc('Status'), field: 'status', align: 'left' },
  { name: 'total', label: tdc('Total'), field: 'total', align: 'right' },
]

const pagination = ref({ page: 1, rowsPerPage: 10, rowsNumber: 0 })

async function fetch() {
  await PurchaseOrder.loadData({ page: pagination.value.page, page_size: pagination.value.rowsPerPage })
  pagination.value.rowsNumber = PurchaseOrder.pagination.rowsNumber
}

function onRequest(props) {
  pagination.value.page = props.pagination.page
  pagination.value.rowsPerPage = props.pagination.rowsPerPage
  fetch()
}

function onSearch(value) {
  PurchaseOrder.setSearch(value)
  pagination.value.page = 1
  fetch()
}

// ---------------- CREATE ----------------
const showCreate = ref(false)
const saving = ref(false)
const errors = computed(() => PurchaseOrder.errors || {})
const form = reactive({ supplier: null, warehouse_id: null, expected_date: null, supplier_reference: '', notes: '' })

function openCreate() {
  Object.assign(form, { supplier: null, warehouse_id: null, expected_date: null, supplier_reference: '', notes: '' })
  PurchaseOrder.errors = {}
  showCreate.value = true
}

async function create() {
  saving.value = true
  try {
    PurchaseOrder.form = { ...form }
    const created = await PurchaseOrder.create()
    showCreate.value = false
    const id = created?.id || PurchaseOrder.row?.id
    if (id) router.push({ name: 'view_purchaseorder', params: { id } })
    else fetch()
  } catch {
    // field messages stay in PurchaseOrder.errors (BaseStore), shown at each field
  } finally {
    saving.value = false
  }
}

onMounted(fetch)
</script>
