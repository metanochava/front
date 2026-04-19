<template>
  <div class="col-12" style="border-bottom: solid #cdcdcd 1px;">

    <!-- DIALOG -->
    <q-dialog
      v-model="modal_add_marcacao"
      persistent
      transition-show="flip-left"
      transition-hide="flip-up"
    >
      <MarcarConsulta
        :pacienteId="paciente.id"
        @success="onSuccess"
      />
    </q-dialog>

    <!-- TOOLBAR -->
    <q-toolbar class="bg-transparent text-grey-9">

      <div class="text-h5">
        {{ paciente?.pessoa?.nome }}
        {{ paciente?.pessoa?.nome_meio }}
        {{ paciente?.pessoa?.apelido }}
        de
      </div>

      <div class="text-h5 q-ml-sm">
        {{ relativeDate(paciente?.pessoa?.data_nascimento) }} de Idade
      </div>

      <q-separator vertical inset />
      <q-space />

      <!-- MARCAR CONSULTA -->
      <q-btn
        v-if="User.can('marcar_consulta')"
        @click="modal_add_marcacao = true"
        color="green"
        icon="fas fa-book"
      >
        <q-tooltip>
          {{ tdc('Marcar Consulta') }}<br>
          {{ paciente?.pessoa?.nome }}
        </q-tooltip>
      </q-btn>

      <!-- INTERNAR -->
      <q-btn
        v-if="!paciente?.is_internmet && route.name !== 'add_internamento'"
        color="primary"
        label="Internar"
        :to="{
          name: 'add_internamento',
          params: { paciente_id: route.params.paciente_id }
        }"
      />

      <!-- INTERNADO -->
      <q-btn
        v-if="paciente?.is_internmet"
        label="Internado"
        color="red"
        @click="setInternamento(paciente?.is_internmet)"
        :to="{
          name: 'view_internamento',
          params: {
            paciente_id: route.params.paciente_id,
            internamento_id: paciente?.is_internmet
          }
        }"
      />

    </q-toolbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { PacienteStore } from './pacienteStore'
// import { useInternamentoStore } from 'src/stores/internamento'

import {  tdc,useUserStore} from 'quasar_resaas'
import { formatDistance } from 'date-fns'

import MarcarConsulta from './MarcarConsulta.vue'

// ROUTE
const route = useRoute()
const User =useUserStore()


// STORES
const pacienteStore = PacienteStore()
// const internamentoStore = useInternamentoStore()

// STATE
const modal_add_marcacao = ref(false)

// COMPUTED
const paciente = computed(() => pacienteStore.actual)

// MOCK permissões (substituir depois)
// const UserPermicoes = ref([])

// METHODS
function relativeDate(dateString) {
  try {
    const dateObject = new Date(dateString)
    return formatDistance(dateObject, new Date())
  } catch {
    return '-'
  }
}

const onSuccess = () => {
  modal_add_marcacao.value = false

  // 🔥 reload dashboard
  this.paciente.getById(this.id)
}

// ACTIONS
// const { setInternamento } = internamentoStore

// INIT
onMounted(async () => {
  const id = route.params.paciente_id
  await pacienteStore.getPaciente(id)
})
</script>
