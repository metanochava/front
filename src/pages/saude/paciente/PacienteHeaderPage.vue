<template>
  <q-card flat bordered class="q-pa-md q-mb-md">

    <!-- 🔝 TOP: FOTO + INFO -->
    <div class="row items-center q-col-gutter-md">

      <!-- FOTO -->
      <q-avatar size="80px">
        <img :src="perfilFoto" />
      </q-avatar>

      <!-- INFO -->
      <div class="col">
        <div class="text-h6 text-weight-bold">
          {{ pacienteNome }}
        </div>

        <div class="text-caption text-grey-7">
          {{ pacienteEmail }}
        </div>

        <div class="text-caption text-grey">
          ID: {{ Paciente.form.id }}
        </div>
      </div>

      <!-- AÇÕES -->
      <div>
        <q-btn flat icon="edit" label="Editar" />
        <q-btn flat icon="print" label="Imprimir" />
      </div>

    </div>

    <q-separator class="q-my-md" />

    <!-- 🔥 MENU HORIZONTAL -->
    <q-tabs
      v-model="tab"
      dense
      align="left"
      class="text-primary"
      active-color="primary"
      indicator-color="primary"
    >

      <q-tab name="resumo" icon="dashboard" label="Resumo" />
      <q-tab name="consultas" icon="event" label="Consultas" />
      <q-tab name="exames" icon="science" label="Exames" />
      <q-tab name="prescricoes" icon="medication" label="Prescrições" />
      <q-tab name="historico" icon="history" label="Histórico" />
      <q-tab name="financeiro" icon="payments" label="Financeiro" />

    </q-tabs>

  </q-card>
</template>

<script setup>
import {  onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { usePacienteStore } from './pacienteStore'
// import { FormTwo } from 'quasar_resaas'




import { ref, computed } from 'vue'

const tab = ref('resumo')

// 🔥 dados do paciente
const pacienteNome = computed(() =>
  Paciente.person?.name || 'Paciente'
)

const pacienteEmail = computed(() =>
  Paciente.person?.user_data?.email || '-'
)

// 🔥 foto (fallback inteligente)
const perfilFoto = computed(() =>
  Paciente.person?.user_data?.photo ||
  'https://cdn.quasar.dev/img/avatar.png'
)









// ---------------- ROUTE ----------------
const route = useRoute()

// ---------------- STORE ----------------
const Paciente = usePacienteStore()

// ---------------- STATE ----------------

// ---------------- LOAD DATA ----------------
async function load(id) {

  if (!id) {

    Paciente.resetForm?.()
    return
  }


  // 🔥 evita chamadas duplicadas com comparação segura
  if (String(Paciente.row?.id) === String(id)) {
    Paciente.form = Paciente.row
    return
  }

  await Paciente.getById(id)
}

// ---------------- INIT ----------------
async function init() {
  try {

    await Paciente.init()

    const id = route.params.id
    await load(id)

    await Paciente.getPessoa()



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


// ---------------- LIFECYCLE ----------------
onMounted(init)
</script>
