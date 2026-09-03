<template>
  <q-page class="q-pa-sm">
    <div class="text-h6 q-mb-sm row items-center">
      <q-icon name="fact_check" class="q-mr-sm" />
      {{ tdc('Contagens Físicas') }}
      <q-space />
      <q-btn color="primary" icon="add" :label="tdc('Nova Contagem')" @click="openForm" />
    </div>

    <q-table
      flat bordered
      :rows="Inventorycount.rows"
      :columns="columns"
      row-key="id"
      :loading="Inventorycount.loading"
      v-model:pagination="pagination"
      @request="onRequest"
      @row-click="(evt, row) => router.push({ name: 'view_inventorycount', params: { id: row.id } })"
    >
      <template #body-cell-estado="props">
        <q-td :props="props">
          <q-badge :color="(props.row.estado?.value || props.row.estado) === 'concluido' ? 'positive' : 'warning'">
            {{ props.row.estado?.label || props.row.estado }}
          </q-badge>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="showForm">
      <q-card style="min-width: 380px">
        <q-card-section class="text-h6">{{ tdc('Nova Contagem Física') }}</q-card-section>
        <q-card-section class="q-gutter-md">
          <s-select
            v-model="warehouse"
            :api="warehouseSelectUrl"
            option-label="label" option-value="value"
            emit-value map-options
            :label="tdc('Armazém')"
          />
          <q-input v-model="observacao" type="textarea" :label="tdc('Observação')" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="tdc('Cancelar')" v-close-popup />
          <q-btn color="primary" :label="tdc('Criar')" :loading="saving" @click="createCount" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { tdc, url } from 'quasar_resaas'
import { useInventorycountStore } from './inventorycountStore'

const Inventorycount = useInventorycountStore()
const router = useRouter()

const warehouseSelectUrl = url({ type: 'u', url: 'inventory/warehouses', params: { select: 'true' } })

const columns = [
  { name: 'data', label: tdc('Data'), field: 'data', align: 'left' },
  { name: 'warehouse', label: tdc('Armazém'), field: row => row.warehouse?.label, align: 'left' },
  { name: 'estado', label: tdc('Estado'), field: 'estado', align: 'left' },
  { name: 'observacao', label: tdc('Observação'), field: 'observacao', align: 'left' },
]

const pagination = reactive({ page: 1, rowsPerPage: 10, rowsNumber: 0 })

async function fetch() {
  await Inventorycount.loadData({ page: pagination.page, page_size: pagination.rowsPerPage })
  pagination.rowsNumber = Inventorycount.pagination.rowsNumber
}

function onRequest(props) {
  pagination.page = props.pagination.page
  pagination.rowsPerPage = props.pagination.rowsPerPage
  fetch()
}

const showForm = ref(false)
const saving = ref(false)
const warehouse = ref(null)
const observacao = ref('')

function openForm() {
  warehouse.value = null
  observacao.value = ''
  showForm.value = true
}

async function createCount() {
  if (!warehouse.value) return

  saving.value = true
  try {
    Inventorycount.form = { warehouse: warehouse.value, observacao: observacao.value || null }
    const created = await Inventorycount.create()
    showForm.value = false
    router.push({ name: 'view_inventorycount', params: { id: created.id } })
  } finally {
    saving.value = false
  }
}

onMounted(fetch)
</script>
