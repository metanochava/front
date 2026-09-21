<template>
  <s-modal-card title="Novo Exame Médico" icon="biotech" width="min(1000px, 92vw)" @close="cancel">
    <div class="row q-col-gutter-lg">

            <!-- ESQUERDA -->
            <div class="col-md-8 col-xs-12">

              <s-select
                v-model="Examemedico.form.classe_exame_medico"
                label="Classe de Exame"
                :options="classeOptions"
                emit-value
                map-options
                outlined
              />

              <div class="row q-col-gutter-md">

                <div class="col-md-4">
                  <s-input
                    v-model="Examemedico.form.codigo"
                    label="Código"
                    outlined
                  />
                </div>

                <div class="col-md-8">
                  <s-input
                    v-model="Examemedico.form.nome"
                    label="Nome"
                    outlined
                  />
                </div>

              </div>

              <s-editor
                v-model="Examemedico.form.descricao"
                label="Descrição"
                min-height="140px"
              />

              <s-editor
                v-model="Examemedico.form.preparacao"
                label="Preparação do Paciente"
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
                    Configuração
                  </div>

                  <s-input
                    v-model="Examemedico.form.amostra"
                    label="Tipo de Amostra"
                    outlined
                  />

                  <s-input
                    v-model="Examemedico.form.prazo_horas"
                    type="number"
                    label="Prazo (Horas)"
                    outlined
                  />

                  <s-input
                    v-model="Examemedico.form.valor_referencia"
                    label="Valor de Referência"
                    outlined
                  />

                  <div class="q-mt-md">

                    <s-switch
                      v-model="Examemedico.form.ativo"
                      label="Activo"
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
              label="Cancelar"
              @click="cancel"
            />

            <s-btn
              color="primary"
              icon="save"
              label="Gravar"
              :loading="Examemedico.saving"
              @click="save"
            />
    </template>
  </s-modal-card>
</template>

<script setup>
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
