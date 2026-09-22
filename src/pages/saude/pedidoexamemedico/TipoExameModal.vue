<template>
  <s-modal-card :title="tdc('New exam type')" icon="science" width="min(1000px, 92vw)" @close="cancel">
    <div class="row q-col-gutter-lg">

            <!-- ESQUERDA -->
            <div class="col-md-8 col-xs-12">

              <s-input
                v-model="Tipoexamemedico.form.nome"
                :label="tdc('Name')"
                outlined
              />

              <div class="q-mt-md">

                <s-editor
                  v-model="Tipoexamemedico.form.descricao"
                  :label="tdc('Description')"
                  min-height="180px"
                />

              </div>

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
                    v-model="Tipoexamemedico.form.ordem"
                    type="number"
                    :label="tdc('Order')"
                    outlined
                  />

                  <div class="q-mt-lg">

                    <s-switch
                      v-model="Tipoexamemedico.form.ativo"
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
              :loading="Tipoexamemedico.saving"
              @click="save"
            />
    </template>
  </s-modal-card>
</template>

<script setup>
import { tdc } from 'quasar_resaas'
import { onMounted } from 'vue'
import { useTipoexamemedicoStore } from '../tipoexamemedico/tipoexamemedicoStore'

const emit = defineEmits([
  'saved',
  'cancel'
])

const Tipoexamemedico = useTipoexamemedicoStore()

onMounted(async () => {

  await Tipoexamemedico.loadSchemaOnce()

  Tipoexamemedico.resetForm()

  Tipoexamemedico.form.ativo = true

})

async function save() {

  Tipoexamemedico.form.state = 'Active'

  const data = await Tipoexamemedico.save()

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
