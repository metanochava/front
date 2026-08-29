<template>
  <q-page class="q-pa-sm">
    <div v-if="Doencacorrente.loading" class="flex flex-center q-pa-lg">
      <q-spinner size="40px" color="primary" />
    </div>
    <s-form-two
      v-else
      :store="Doencacorrente"
      :ignore-fields="['created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at']"
      @saved="onSaved"
    />
  </q-page>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useDoencacorrenteStore } from './doencacorrenteStore'

// ----------------------------------
// ROUTE
// ----------------------------------
const route = useRoute()

// ----------------------------------
// STORE
// ----------------------------------
const Doencacorrente = useDoencacorrenteStore()

// ----------------------------------
// LOAD DATA (EDIT)
// ----------------------------------
async function load(id) {
  if (!id) {
    Doencacorrente.resetForm?.()
    return
  }

  if (String(Doencacorrente.row?.id) === String(id)) {
    Doencacorrente.form = Doencacorrente.row
    return
  }

  Doencacorrente.row = await Doencacorrente.getById(id)
}

// ----------------------------------
// INIT
// ----------------------------------
async function init() {
  try {
    await Doencacorrente.init()
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
