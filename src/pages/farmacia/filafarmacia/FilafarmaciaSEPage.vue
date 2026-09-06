
<template>
  <q-page class="q-pa-sm">
    <div v-if="Filafarmacia.loading" class="flex flex-center q-pa-lg">
      <q-spinner size="40px" color="primary" />
    </div>
    <s-form-two
      v-else
      :store="Filafarmacia"
      :ignore-fields="['created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at']"
      @saved="onSaved"
    />
  </q-page>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useFilafarmaciaStore } from './filafarmaciaStore'

const route = useRoute()
const Filafarmacia = useFilafarmaciaStore()

async function load(id) {
  if (!id) {
    Filafarmacia.resetForm?.()
    return
  }

  if (String(Filafarmacia.row?.id) === String(id)) {
    Filafarmacia.form = Filafarmacia.row
    return
  }

  Filafarmacia.row = await Filafarmacia.getById(id)
}

async function init() {
  try {
    await Filafarmacia.init()
    await load(route.params.id)
  } catch (err) {
    console.error('Erro ao inicializar página:', err)
  }
}

watch(
  () => route.params,
  async (params) => {
    if (!params) return
    await load(params.id)
  }
)

function onSaved(res) {
  console.log('Salvo com sucesso', res)
}

onMounted(init)
</script>
