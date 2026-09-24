<template>
  <q-dialog v-model="dialog" full-width full-height>
    <s-modal-card :title="tdc('Results')" icon="fact_check" fullscreen @close="dialog = false">
      <q-card
          v-for="item in Pedidoexamemedico.items"
          :key="item"
          class="q-mb-lg"
          flat
          bordered
      >

          <q-bar class="bg-grey-2">

              <div class="text-subtitle2 text-weight-bold">
                  {{ item?.exame?.label }}
              </div>

              <q-space/>

              <q-badge
                  :color="item.estado_exame?.id=='pendente'
                      ? 'orange'
                      : 'positive'"
              >
                  {{ item.estado_exame?.label }}
              </q-badge>

          </q-bar>

          <q-card-section>

            {{ item }}

              <!-- <s-input
                  v-model="item.resultado.valor_resultado"
                  :label="tdc('Result value')"
              />

              <div class="row q-col-gutter-md">

                  <div class="col">

                      <s-date-time
                          v-model="item.resultado.data_colheita"
                          :label="tdc('Collection date')"
                      />

                  </div>

                  <div class="col">

                      <s-date-time
                          v-model="item.resultado.data_resultado"
                          :label="tdc('Result date')"
                      />

                  </div>

              </div>

              <s-editor
                  v-model="item.resultado.laudo"
                  :label="tdc('Findings')"
                  min-height="120px"
              />

              <s-editor
                  v-model="item.resultado.observacao"
                  :label="tdc('Observation')"
                  min-height="100px"
              />

              <s-file
                  v-model="item.resultado.ficheiro"
                  :label="tdc('File')"
              />

              <div class="row q-col-gutter-md">

                  <div class="col">

                      <s-switch
                          v-model="item.resultado.validado"
                          :label="tdc('Validated')"
                      />

                  </div>

                  <div class="col">

                      <s-switch
                          v-model="item.resultado.assinado_digitalmente"
                          :label="tdc('Digitally signed')"
                      />

                  </div>

              </div> -->

          </q-card-section>

          <q-separator/>

          <q-card-actions align="right">

              <s-btn
                  flat
                  color="primary"
                  icon="edit_note"
                  :label="tdc('Record result')"
                  data-test="open-structured-result"
                  @click="openStructured(item)"
              />

              <s-btn
                  color="primary"
                  icon="save"
                  :label="tdc('Save result')"
                  @click="saveResultado(item)"
              />

          </q-card-actions>

      </q-card>
    </s-modal-card>
  </q-dialog>

  <ExamResultDialog v-model="structuredOpen" :item-id="structuredItemId" />
</template>

<script setup>
import { tdc } from 'quasar_resaas'
import { computed, ref, watch } from 'vue'
import { usePedidoexamemedicoStore } from './../pedidoexamemedico/pedidoexamemedicoStore.js'
import ExamResultDialog from '../components/ExamResultDialog.vue'

// structured result of one exam item (form built from the exam's parameters)
const structuredOpen = ref(false)
const structuredItemId = ref(null)
function openStructured (item) {
  structuredItemId.value = item?.id
  structuredOpen.value = true
}

// import { usePacienteStore } from './../paciente/pacienteStore'


// const Paciente = usePacienteStore()

const Pedidoexamemedico = usePedidoexamemedicoStore()



// props
const props = defineProps({
  modelValue: Boolean,
})

// emit
const emit = defineEmits(['update:modelValue'])

// ✅ v-model proxy (CORRETO)
const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})



// limpar memória (blob)
watch(() => props.modelValue, (val) => {
  if (!val && props.src?.startsWith('blob:')) {
    URL.revokeObjectURL(props.src)
  }
})
</script>

<style scoped>
/* opcional: scroll suave */
iframe {
  background: #fff;
}

body.body--dark iframe {
  background: #1e1e1e;
}
</style>
