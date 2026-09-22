<template>
  <s-modal-card :title="tdc('New exam class')" icon="folder" width="min(1000px, 92vw)" @close="cancel">
    <div class="row q-col-gutter-lg">
            <!-- ESQUERDA -->
            <div class="col-md-8 col-xs-12">
              <s-select
                v-model="Classeexamemedico.form.tipo_exame_medico"
                :label="tdc('Exam type')"
                :options="tipoOptions"
                emit-value
                map-options
                outlined
              />

              <s-input
                v-model="Classeexamemedico.form.nome"
                :label="tdc('Name')"
                outlined
              />

              <s-editor
                v-model="Classeexamemedico.form.descricao"
                :label="tdc('Description')"
                min-height="180px"
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
                    v-model="Classeexamemedico.form.ordem"
                    type="number"
                    :label="tdc('Order')"
                    outlined
                  />

                  <div class="q-mt-lg">
                    <s-switch
                      v-model="Classeexamemedico.form.ativo"
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
              :loading="Classeexamemedico.saving"
              @click="save"
            />
    </template>
  </s-modal-card>
</template>

<script setup>
import { tdc } from 'quasar_resaas'
import { computed, onMounted } from 'vue'
import { useClasseexamemedicoStore } from '../classeexamemedico/classeexamemedicoStore'
import { useTipoexamemedicoStore } from '../tipoexamemedico/tipoexamemedicoStore'

const props = defineProps({
  tipoId: {
    type: [String, Number],
    default: null
  }
})

const emit = defineEmits([
  'saved',
  'cancel'
])

const Classeexamemedico = useClasseexamemedicoStore()
const Tipoexamemedico = useTipoexamemedicoStore()

const tipoOptions = computed(() =>
  (Tipoexamemedico.rows || []).map(item => ({
    label: item.nome,
    value: item.id
  }))
)

onMounted(async () => {
  await Promise.all([
    Classeexamemedico.loadSchemaOnce(),
    Tipoexamemedico.loadSchemaOnce(),
    Tipoexamemedico.loadData()
  ])

  Classeexamemedico.resetForm()

  Classeexamemedico.form.tipo_exame_medico = props.tipoId
  Classeexamemedico.form.ativo = true
})

async function save() {
  Classeexamemedico.form.state = 'Active'

  const data = await Classeexamemedico.save()

  emit('saved', data)
}

function cancel() {
  emit('cancel')
}
</script>

<style scoped>
.dialog-card {
  width: 70vw;
  max-width: 1000px;
  min-width: 700px;
  border-radius: 16px;
  overflow: hidden;
}

.q-bar {
  height: 52px;
}

:deep(.q-field) {
  margin-bottom: 12px;
}
</style>
