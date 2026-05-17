<template>
  <q-page class="q-pa-sm">
    <PacienteHeader />
    <!-- FORM -->
    <div v-if="Receitamedica.loading" class="flex flex-center q-pa-lg">
      <q-spinner size="40px" color="primary" />
    </div>
    <FormTwo
      v-else
      :store="Receitamedica"
      :ignore-fields="['id', 'created_at','updated_at', 'created_by', 'updated_by', 'deleted_at']"
      @saved="onSaved"
    />
  </q-page>
</template>


<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useReceitamedicaStore } from './receitamedicaStore'
import { FormTwo } from 'quasar_resaas'
import PacienteHeader from './../paciente/PacienteHeaderPage.vue'

// ---------------- ROUTE ----------------
const route = useRoute()

// ---------------- STORE ----------------
const Receitamedica = useReceitamedicaStore()

// ---------------- STATE ----------------


// ---------------- LOAD DATA ----------------
async function load(id) {

  if (!id) {

    Receitamedica.resetForm?.()
    return
  }


  // 🔥 evita chamadas duplicadas com comparação segura
  if (String(Receitamedica.row?.id) === String(id)) {
    Receitamedica.form = Receitamedica.row
    return
  }

  Receitamedica.row =  await Receitamedica.getById(id)
}

// ---------------- INIT ----------------
async function init() {
  try {
    await Receitamedica.init()
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
