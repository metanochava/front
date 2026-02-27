<template>
  <q-page class="row bg-grey-2 q-pa-sm">
    <!-- FORM -->
    <div class="col-12 col-md-12">
      <AutoForm :fields="Entidade.campos" :model="Entidade.linha" />
    </div>

    <!-- TABLE -->
    <div class="col-12 col-md-12">
      <AutoTable
        title="Funcionários"
        :rows="Entidade.linhas"
        :columns="Entidade.campos"
        :pagination="Entidade.pagination"
        :loading="Entidade.loading"
        @request="Entidade.load"
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

import { AutoForm, AutoTable, AutoCrud } from '@metano/quasar_rest_auth'
import { EntidadeStore } from './EntidadeStore'

const Entidade = EntidadeStore()

function remove(row) {
  Dialog.create({
    title: 'Confirmar',
    message: `Eliminar ${row.nome}?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    Entidade.linha = row
    Entidade.remove()

    Notify.create({
      type: 'positive',
      message: 'Removido com sucesso',
    })
    Entidade.load()
  })
}

onMounted(async () => {
  await Entidade.load()
})
</script>
