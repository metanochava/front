<template>
  <q-page class="q-pa-sm">
    <div v-if="Medicacaocorrente.loading" class="flex flex-center q-pa-lg">
      <q-spinner size="40px" color="primary" />
    </div>
    <s-form-two
      v-else
      :store="Medicacaocorrente"
      :ignore-fields="['created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at']"
      @saved="onSaved"
    />
  </q-page>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMedicacaocorrenteStore } from './medicacaocorrenteStore'

// ----------------------------------
// ROUTE
// ----------------------------------
const route = useRoute()

// ----------------------------------
// STORE
// ----------------------------------
const Medicacaocorrente = useMedicacaocorrenteStore()

// ----------------------------------
// LOAD DATA (EDIT)
// ----------------------------------
async function load(id) {
  if (!id) {
    Medicacaocorrente.resetForm?.()
    return
  }

  if (String(Medicacaocorrente.row?.id) === String(id)) {
    Medicacaocorrente.form = Medicacaocorrente.row
    return
  }

  Medicacaocorrente.row = await Medicacaocorrente.getById(id)
}

// ----------------------------------
// INIT
// ----------------------------------
async function init() {
  try {
    await Medicacaocorrente.init()
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
