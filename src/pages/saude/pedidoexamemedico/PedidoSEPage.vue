<template>
  <q-page class="q-pa-sm">
    <div class="row q-col-gutter-md">
      <div class="col-md-5 col-xs-12">
        <s-card flat bordered class="q-pa-md">
          <ExameCollapse
            v-model="selectedExame"
            :tipos="tipos"
            :classes="classes"
            :exames="exames"
            @add="prepareAdd"
            @novo-tipo="showTipo = true"
            @nova-classe="openClasse"
            @novo-exame="openExame"
          />
        </s-card>
      </div>

      <div class="col-md-7 col-xs-12">
        <s-card flat bordered class="q-pa-md">
          <PedidoResumo :items="items" class="q-mb-md" />
          <ExameCard
            v-for="(item, index) in items"
            :key="index"
            :item="item"
            @remove="items.splice(index, 1)"
          />
        </s-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import ExameCollapse from '../components/parapedifoexame/ExameCollapse.vue'
import ExameCard from '../components/parapedifoexame/ExameCard.vue'
import  PedidoResumo from '../components/parapedifoexame/PedidoResumo.vue'


const tipos = ref([])
const classes = ref([])
const exames = ref([])
const selectedExame = ref(null)
const items = ref([])

function prepareAdd(payload) {
  items.value.push({
    exame: payload.exame_id,
    tipo_label: payload.tipo_label,
    classe_label: payload.classe_label,
    exame_label: payload.exame_label,
    prioridade: 'normal',
    prioridade_label: 'Normal'
  })
}

function openClasse(tipo) {
  console.log('nova classe', tipo)
}

function openExame(classe) {
  console.log('novo exame', classe)
}
</script>
