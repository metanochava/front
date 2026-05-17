<template>
  <s-card flat bordered class="q-pa-sm q-mb-sm">
    <div class="row q-col-gutter-sm">

      <!-- FOTO -->



      <!-- INFO -->
      <div class="col-3 q-ml-md">
        <q-toolbar-title class="row items-center">
        <q-avatar size="40px" class="q-mr-sm">
          <img :src="Paciente?.person?.profile?.url || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'"  />
        </q-avatar>
        <span class="text-weight-bold">{{Paciente?.person?.full_name}}</span>
      </q-toolbar-title>

      </div>

      <div class="col items-center text-center q-gutter-sm" v-show="Paciente">
        <s-btn flat  icon="health_and_safety"
          :to="{ name: 'add_consulta', params: { id: Paciente?.id } }">
          <q-tooltip :class="$q.dark.isActive ? 'bg-dark text-white text-13' : 'bg-primary text-white text-13'">
            {{ tdc('Consulta')}}
          </q-tooltip>
        </s-btn>

        <s-btn flat  icon="medication"
          :to="{ name: 'add_receitamedica', params: { id: Paciente?.id } }">
          <q-tooltip :class="$q.dark.isActive ? 'bg-dark text-white text-13' : 'bg-primary text-white text-13'">
            {{ tdc('Receita')}}
          </q-tooltip>
        </s-btn>

        <s-btn flat  icon="assignment"
          :to="{ name: 'add_atestadomedico', params: { id: Paciente?.id } }">
          <q-tooltip :class="$q.dark.isActive ? 'bg-dark text-white text-13' : 'bg-primary text-white text-13'">
            {{ tdc('Atestado')}}
          </q-tooltip>
        </s-btn>

        <s-btn flat  icon="swap_horiz"
          :to="{ name: 'add_guiatransferencia', params: { id: Paciente?.id } }">
          <q-tooltip :class="$q.dark.isActive ? 'bg-dark text-white text-13' : 'bg-primary text-white text-13'">
            {{ tdc('Guia de Transferência')}}
          </q-tooltip>
        </s-btn>

        <s-btn flat  icon="science"
          :to="{ name: 'add_pedidoexamemedico', params: { id: Paciente?.id } }">
          <q-tooltip :class="$q.dark.isActive ? 'bg-dark text-white text-13' : 'bg-primary text-white text-13'">
            {{ tdc('Pedido de Exames')}}
          </q-tooltip>
        </s-btn>

        <s-btn flat  icon="bar_chart"
          :to="{ name: 'add_resultadopedidoexamemedico', params: { id: Paciente?.id } }">
          <q-tooltip :class="$q.dark.isActive ? 'bg-dark text-white text-13' : 'bg-primary text-white text-13'">
            {{ tdc('Resultados')}}
          </q-tooltip>
        </s-btn>

        <s-btn flat  icon="description"
          :to="{ name: 'add_relatoriomedico', params: { id: Paciente?.id } }">
          <q-tooltip :class="$q.dark.isActive ? 'bg-dark text-white text-13' : 'bg-primary text-white text-13'">
            {{ tdc('Relatorio') }}
          </q-tooltip>
        </s-btn>
      </div>


      <div class="col-3 text-right">
        <s-btn flat round icon="arrow_back"  @click="router.back()" />

        <s-btn flat round icon="event" class="q-mr-sm">
          <q-tooltip>{{ tdc('Agenda')}}</q-tooltip>
        </s-btn>
        <s-btn color="primary" icon="more_vert">
          <q-menu persistent auto-close>
            <q-list style="min-width: 100px">
              <q-item clickable>
                <q-item-section>New tab</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable>
                <q-item-section>Settings</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable>
                <q-item-section>Help &amp; Feedback</q-item-section>
              </q-item>
            </q-list>

            <q-list style="min-width: 150px">
              <q-item clickable v-close-popup>
                <q-item-section>Editar</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>Eliminar</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </s-btn>
      </div>

    </div>

  </s-card>
</template>

<style >
  .text-13 {
    font-weight: bold;
    font-size: 16px;
  }
</style>


<script setup>
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePacienteStore } from './pacienteStore'

import { tdc } from 'quasar_resaas'

const route = useRoute()
const router = useRouter()

const Paciente = usePacienteStore()

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

  Paciente.row =  await Paciente.getById(id)
}

// ---------------- INIT ----------------
async function init() {

  await Paciente.init()

  const id = route.params.id
  await load(id)
  await Paciente.getPerson()
}

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
