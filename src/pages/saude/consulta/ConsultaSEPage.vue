<template>
  <q-page class="q-pa-sm">
  <s-pdf-render
      v-model="Consulta.showPdf"
      :src="Consulta.pdf"
      title="Consulta Medica"
    />
    <PacienteHeader />
    <!-- FORM -->
    <div v-if="Consulta.loading" class="flex flex-center q-pa-lg">
      <q-spinner size="40px" color="primary" />
    </div>
    <s-form-two
      v-else
      :store="Consulta"
      :ignore-fields="['id', 'entidade', 'branch', 'state', 'created_at','updated_at', 'created_by', 'updated_by', 'deleted_at']"
      @saved="onSaved"
    />
  </q-page>
</template>


<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useConsultaStore } from './consultaStore'

import PacienteHeader from './../paciente/PacienteHeaderPage.vue'

// ---------------- ROUTE ----------------
const route = useRoute()

// ---------------- STORE ----------------
const Consulta = useConsultaStore()

// ---------------- STATE ----------------

function afterSave(item) {
  Consulta.getPdf(item.id)
  Consulta.showPdf = true
  Consulta.loadData()
}


// ---------------- LOAD DATA ----------------
async function load(id) {

  if (!id) {

    Consulta.resetForm?.()
    return
  }


  // 🔥 evita chamadas duplicadas com comparação segura
  if (String(Consulta.row?.id) === String(id)) {
    Consulta.form = Consulta.row
    return
  }

  Consulta.row =  await Consulta.getById(id)
}

// ---------------- INIT ----------------
async function init() {
  try {
    await Consulta.init()
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
  afterSave(res)
}

// ---------------- LIFECYCLE ----------------
onMounted(init)
</script>
