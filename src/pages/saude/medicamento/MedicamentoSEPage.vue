<template>
  <q-page class="q-pa-sm">
    <div v-if="Medicamento.loading" class="flex flex-center q-pa-lg">
      <q-spinner size="40px" color="primary" />
    </div>
    <s-form-two
      v-else
      :store="Medicamento"
      :ignore-fields="['created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at']"
      @saved="onSaved"
    />
  </q-page>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMedicamentoStore } from './medicamentoStore'

// ----------------------------------
// ROUTE
// ----------------------------------
const route = useRoute()

// ----------------------------------
// STORE
// ----------------------------------
const Medicamento = useMedicamentoStore()

// ----------------------------------
// LOAD DATA (EDIT)
// ----------------------------------
async function load(id) {
  if (!id) {
    Medicamento.resetForm?.()
    return
  }

  if (String(Medicamento.row?.id) === String(id)) {
    Medicamento.form = Medicamento.row
    return
  }

  Medicamento.row = await Medicamento.getById(id)
}

// ----------------------------------
// INIT
// ----------------------------------
async function init() {
  try {
    await Medicamento.init()
    const id = route.params.id
    await load(id)
  } catch (err) {
    console.error('Erro ao inicializar página:', err)
  }
}

// ----------------------------------
// WATCH (se mudar rota)
// ----------------------------------
watch(
  () => route.params,
  async (params) => {
    if (!params) return
    await load(params.id)
  }
)

// ----------------------------------
// EVENTS
// ----------------------------------
function onSaved(res) {
  console.log('Salvo com sucesso', res)
}

// ----------------------------------
// LIFECYCLE
// ----------------------------------
onMounted(init)
</script>
