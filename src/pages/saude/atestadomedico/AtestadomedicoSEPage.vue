<template>
  <q-page class="q-pa-sm">
    <PacienteHeader />
    <!-- FORM -->
    <div v-if="Atestadomedico.loading" class="flex flex-center q-pa-lg">
      <q-spinner size="40px" color="primary" />
    </div>
    <FormTwo
      v-else
      :store="Atestadomedico"
      :ignore-fields="['id', 'created_at','updated_at', 'created_by', 'updated_by', 'deleted_at']"
      @saved="onSaved"
    />
  </q-page>
</template>


<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAtestadomedicoStore } from './atestadomedicoStore'
import { FormTwo } from 'quasar_resaas'
import PacienteHeader from './../paciente/PacienteHeaderPage.vue'

// ---------------- ROUTE ----------------
const route = useRoute()

// ---------------- STORE ----------------
const Atestadomedico = useAtestadomedicoStore()

// ---------------- STATE ----------------


// ---------------- LOAD DATA ----------------
async function load(id) {

  if (!id) {

    Atestadomedico.resetForm?.()
    return
  }


  // 🔥 evita chamadas duplicadas com comparação segura
  if (String(Atestadomedico.row?.id) === String(id)) {
    Atestadomedico.form = Atestadomedico.row
    return
  }

  Atestadomedico.row =  await Atestadomedico.getById(id)
}

// ---------------- INIT ----------------
async function init() {
  try {
    await Atestadomedico.init()
    const id = route.params.id
    await load(id)
  } catch (err) {
    console.error('Erro ao inicializar página:', err)
  }
}

// ---------------- WATCH ROTA (CORRIGIDO) ----------------
watch(
  () => route.params,
  async (params) => {
    if (!params) return

    const id = params.id

    // 🔥 sempre carrega quando muda rota
    await load(id)
  },
  { immediate: false } // init já trata o primeiro carregamento
)

// ---------------- EVENTS ----------------
function onSaved(res) {
  console.log('Salvo com sucesso', res)
}

// ---------------- LIFECYCLE ----------------
onMounted(init)
</script>
