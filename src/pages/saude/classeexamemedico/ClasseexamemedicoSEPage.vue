<template>
  <q-page class="q-pa-sm">
    <div v-if="Classeexamemedico.loading" class="flex flex-center q-pa-lg">
      <q-spinner size="40px" color="primary" />
    </div>
    <s-form-two
      v-else
      :store="Classeexamemedico"
      :ignore-fields="['created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at']"
      @saved="onSaved"
    />
  </q-page>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useClasseexamemedicoStore } from './classeexamemedicoStore'

// ----------------------------------
// ROUTE
// ----------------------------------
const route = useRoute()

// ----------------------------------
// STORE
// ----------------------------------
const Classeexamemedico = useClasseexamemedicoStore()

// ----------------------------------
// LOAD DATA (EDIT)
// ----------------------------------
async function load(id) {
  if (!id) {
    Classeexamemedico.resetForm?.()
    return
  }

  if (String(Classeexamemedico.row?.id) === String(id)) {
    Classeexamemedico.form = Classeexamemedico.row
    return
  }

  Classeexamemedico.row = await Classeexamemedico.getById(id)
}

// ----------------------------------
// INIT
// ----------------------------------
async function init() {
  try {
    await Classeexamemedico.init()
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
