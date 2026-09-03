<template>
  <q-page class="q-pa-sm" v-if="Inventorycount.row">
    <div class="text-h6 q-mb-sm row items-center">
      <q-icon name="fact_check" class="q-mr-sm" />
      {{ tdc('Contagem') }} — {{ Inventorycount.row.warehouse?.label }}
      <q-badge class="q-ml-sm" :color="estado === 'concluido' ? 'positive' : 'warning'">
        {{ Inventorycount.row.estado?.label || estado }}
      </q-badge>
      <q-space />
      <q-btn
        v-if="estado !== 'concluido'"
        color="positive" icon="fact_check" :label="tdc('Finalizar Contagem')"
        :loading="finalizando"
        @click="finalizar"
      />
    </div>

    <s-card flat bordered class="q-mb-md" v-if="estado !== 'concluido'">
      <q-card-section>
        <div class="text-subtitle2 q-mb-sm">{{ tdc('Adicionar Linha') }}</div>
        <div class="row q-col-gutter-sm items-end">
          <div class="col-12 col-sm-6">
            <s-select
              v-model="newLine.product"
              :api="productSelectUrl"
              option-label="label" option-value="value"
              emit-value map-options
              :label="tdc('Produto')"
            />
          </div>
          <div class="col-8 col-sm-4">
            <q-input
              v-model.number="newLine.quantidade_contada"
              type="number" step="0.001"
              :label="tdc('Quantidade Contada')"
            />
          </div>
          <div class="col-4 col-sm-2">
            <q-btn color="primary" icon="add" :label="tdc('Adicionar')" :loading="addingLine" @click="addLine" />
          </div>
        </div>
      </q-card-section>
    </s-card>

    <q-table
      flat bordered
      :rows="Inventorycountline.rows"
      :columns="columns"
      row-key="id"
      :loading="Inventorycountline.loading"
      hide-pagination
      :rows-per-page-options="[0]"
    >
      <template #body-cell-diferenca="props">
        <q-td :props="props">
          <span
            v-if="props.value !== null && props.value !== undefined"
            :class="Number(props.value) === 0 ? '' : Number(props.value) < 0 ? 'text-negative' : 'text-positive'"
          >
            {{ Number(props.value) > 0 ? '+' : '' }}{{ props.value }}
          </span>
          <span v-else class="text-grey-6">—</span>
        </q-td>
      </template>
    </q-table>
  </q-page>

  <q-page v-else class="flex flex-center">
    <q-spinner color="primary" size="40px" />
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { tdc, url } from 'quasar_resaas'
import { useInventorycountStore } from './inventorycountStore'
import { useInventorycountlineStore } from './inventorycountlineStore'

const route = useRoute()
const Inventorycount = useInventorycountStore()
const Inventorycountline = useInventorycountlineStore()

const productSelectUrl = url({ type: 'u', url: 'inventory/products', params: { select: 'true' } })

const estado = computed(() => Inventorycount.row?.estado?.value || Inventorycount.row?.estado)

const columns = [
  { name: 'product', label: tdc('Produto'), field: row => row.product?.label, align: 'left' },
  { name: 'quantidade_contada', label: tdc('Quantidade Contada'), field: 'quantidade_contada', align: 'right' },
  { name: 'quantidade_sistema', label: tdc('Quantidade Sistema'), field: 'quantidade_sistema', align: 'right' },
  { name: 'diferenca', label: tdc('Diferença'), field: 'diferenca', align: 'right' },
]

const newLine = reactive({ product: null, quantidade_contada: null })
const addingLine = ref(false)
const finalizando = ref(false)

async function fetchLines() {
  await Inventorycountline.loadData({
    inventory_count: route.params.id,
    page_size: 500,
  })
}

async function addLine() {
  if (!newLine.product || newLine.quantidade_contada === null) return

  addingLine.value = true
  try {
    Inventorycountline.form = {
      inventory_count: route.params.id,
      product: newLine.product,
      quantidade_contada: newLine.quantidade_contada,
    }
    await Inventorycountline.create()
    newLine.product = null
    newLine.quantidade_contada = null
    await fetchLines()
  } finally {
    addingLine.value = false
  }
}

async function finalizar() {
  finalizando.value = true
  try {
    await Inventorycount.finalizar(route.params.id)
    await fetchLines()
  } finally {
    finalizando.value = false
  }
}

onMounted(async () => {
  await Inventorycount.getById(route.params.id)
  await fetchLines()
})
</script>
