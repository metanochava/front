<template>
  <q-page class="row bg-grey-2 q-pa-sm">
    <!-- FORM -->
    <div class="col-12 col-md-12">
      <AutoForm :fields="Entity.campos" :model="Entity.linha" />
    </div>

    <!-- TABLE -->
    <div class="col-12 col-md-12">
      <AutoTable
        title="Funcionários"
        :rows="Entity.linhas"
        :columns="Entity.campos"
        :pagination="Entity.pagination"
        :loading="Entity.loading"
        @request="Entity.load"
        @create="openCreate"
        @edit="openEdit"
        @delete="remove"
      />

      <AutoCrud />
    </div>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import { Notify, Dialog } from 'quasar'

import { AutoForm, AutoTable, AutoCrud } from 'quasar_resaas'
import { EntityStore } from './ConsultaStore'

const Entity = EntityStore()

function remove(row) {
  Dialog.create({
    title: 'Confirmar',
    message: `Eliminar ${row.nome}?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    Entity.linha = row
    Entity.remove()

    Notify.create({
      type: 'positive',
      message: 'Removido com sucesso',
    })
    Entity.load()
  })
}

onMounted(async () => {
  await Entity.load()
})
</script>
