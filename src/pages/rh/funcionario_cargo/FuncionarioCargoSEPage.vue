<template>
  <q-page class="q-pa-sm">
    <div v-if="FuncionarioCargo.loading" class="flex flex-center q-pa-lg">
      <q-spinner size="40px" color="primary" />
    </div>
    <s-form-two
      v-else
      :store="FuncionarioCargo"
      :ignore-fields="['created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at']"
      @saved="onSaved"
    />
  </q-page>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useFuncionarioCargoStore } from './funcionario_cargoStore'

// ----------------------------------
// ROUTE
// ----------------------------------
const route = useRoute()

// ----------------------------------
// STORE
// ----------------------------------
const FuncionarioCargo = useFuncionarioCargoStore()

// ----------------------------------
// LOAD DATA (EDIT)
// ----------------------------------
async function load(id) {
  if (!id) {
    FuncionarioCargo.resetForm?.()
    return
  }

  if (String(FuncionarioCargo.row?.id) === String(id)) {
    FuncionarioCargo.form = FuncionarioCargo.row
    return
  }

  FuncionarioCargo.row = await FuncionarioCargo.getById(id)
}

// ----------------------------------
// INIT
// ----------------------------------
async function init() {
  try {
    await FuncionarioCargo.init()
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
