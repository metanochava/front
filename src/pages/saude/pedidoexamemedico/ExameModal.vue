<template>
  <s-modal-card :title="tdc('New medical exam')" icon="biotech" width="min(1000px, 92vw)" @close="cancel">
    <div class="row q-col-gutter-lg">

            <!-- ESQUERDA -->
            <div class="col-md-8 col-xs-12">

              <s-select
                v-model="Examemedico.form.classe_exame_medico"
                :label="tdc('Exam class')"
                :options="classeOptions"
                emit-value
                map-options
                outlined
              />

              <div class="row q-col-gutter-md">

                <div class="col-md-4">
                  <s-input
                    v-model="Examemedico.form.codigo"
                    :label="tdc('Code')"
                    outlined
                  />
                </div>

                <div class="col-md-8">
                  <s-input
                    v-model="Examemedico.form.nome"
                    :label="tdc('Name')"
                    outlined
                  />
                </div>

              </div>

              <s-editor
                v-model="Examemedico.form.descricao"
                :label="tdc('Description')"
                min-height="140px"
              />

              <s-editor
                v-model="Examemedico.form.preparacao"
                :label="tdc('Patient preparation')"
                min-height="120px"
              />

            </div>

            <!-- DIREITA -->
            <div class="col-md-4 col-xs-12">

              <q-card
                flat
                bordered
                class="bg-grey-1"
              >
                <q-card-section>

                  <div class="text-subtitle2 text-weight-bold q-mb-md">
                    {{ tdc('Configuration') }}
                  </div>

                  <s-input
                    v-model="Examemedico.form.amostra"
                    :label="tdc('Sample type')"
                    outlined
                  />

                  <s-input
                    v-model="Examemedico.form.prazo_horas"
                    type="number"
                    :label="tdc('Deadline (hours)')"
                    outlined
                  />

                  <s-input
                    v-model="Examemedico.form.valor_referencia"
                    :label="tdc('Reference value')"
                    outlined
                  />

                  <div class="q-mt-md">

                    <s-switch
                      v-model="Examemedico.form.ativo"
                      :label="tdc('Active')"
                    />

                  </div>

                </q-card-section>
              </q-card>

            </div>

          </div>



    <template #footer>
      <s-btn
              flat
              color="grey-8"
              icon="close"
              :label="tdc('Cancel')"
              @click="cancel"
            />

            <s-btn
              color="primary"
              icon="save"
              :label="tdc('Save')"
              :loading="Examemedico.saving"
              @click="save"
            />
    </template>
  </s-modal-card>
</template>

<script setup>
import { tdc } from 'quasar_resaas'
import { computed, onMounted } from 'vue'

import { useExamemedicoStore } from '../examemedico/examemedicoStore'
import { useClasseexamemedicoStore } from '../classeexamemedico/classeexamemedicoStore'

const props = defineProps({
  classeId: {
    type: [String, Number],
    default: null
  }
})

const emit = defineEmits([
  'saved',
  'cancel'
])

const Examemedico = useExamemedicoStore()
const Classeexamemedico = useClasseexamemedicoStore()

const classeOptions = computed(() =>
  (Classeexamemedico.rows || []).map(item => ({
    label: item.nome,
    value: item.id
  }))
)

onMounted(async () => {

  await Promise.all([
    Examemedico.loadSchemaOnce(),
    Classeexamemedico.loadSchemaOnce(),
    Classeexamemedico.loadData()
  ])

  Examemedico.resetForm()

  Examemedico.form.classe_exame_medico = props.classeId

  Examemedico.form.ativo = true

})

async function save() {

  Examemedico.form.state = 'Active'

  const data = await Examemedico.save()

  emit('saved', data)

}

function cancel() {

  emit('cancel')

}
</script>

<style scoped>



:deep(.q-field){

    margin-bottom:12px;

}

</style>
