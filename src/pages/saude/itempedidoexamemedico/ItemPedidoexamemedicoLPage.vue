
<template>
  <q-page class="q-pa-sm">
    <s-auto-crud
      ref="crud"
      :app="app" :model="model"
      :ignoreFields="['created_at','updated_at', 'created_by', 'updated_by', 'deleted_at']"
      @runaction="onRunAction"
    />

    <ExamResultDialog v-model="resultOpen" :item-id="resultItemId" @saved="reload" @changed="reload" />
  </q-page>
</template>

<script setup>
// The laboratory actions of an exam item come from the schema (backend
// @resaas_action). "Collect" runs by itself (autorequest); the ones that need
// input are handled here: the result dialog and the rejection reason. The
// backend checks each action's permission and the item's state.
import { ref } from 'vue'
import { HTTPAuth, url, tdc, sDialog } from 'quasar_resaas'
import ExamResultDialog from '../components/ExamResultDialog.vue'

const app = ref('saude')
const model = ref('Itempedidoexamemedico')
const crud = ref(null)

const resultOpen = ref(false)
const resultItemId = ref(null)

function reload () {
  crud.value?.reload?.()
}

function onRunAction (action, row) {
  if (action.action === 'record_result') {
    resultItemId.value = row.id
    resultOpen.value = true
  }

  if (action.action === 'reject_sample') {
    sDialog({
      title: tdc('Reject sample'),
      icon: 'block',
      cancel: true,
      prompt: { model: '', type: 'textarea', label: tdc('Reason'), isValid: (v) => !!v?.trim() }
    }).onOk(async (reason) => {
      await HTTPAuth.post(url({ type: 'u', url: `saude/itempedidoexamemedicos/${row.id}/reject_sample/` }), { reason })
      reload()
    })
  }
}
</script>
