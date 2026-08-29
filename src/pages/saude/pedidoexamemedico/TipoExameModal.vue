<template>
  <s-card
    flat
    bordered
    class="dialog-card"
  >

    <!-- HEADER -->
    <q-bar :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-primary text-white'">

      <q-icon
        name="science"
        size="22px"
      />

      <div class="text-subtitle1 text-weight-bold q-ml-sm">
        Novo Tipo de Exame
      </div>

      <q-space />

      <s-btn
        dense
        flat
        round
        icon="close"
        color="white"
        @click="cancel"
      />

    </q-bar>

    <!-- BODY -->
    <div class="q-pa-lg">

      <div class="row q-col-gutter-lg">

        <!-- ESQUERDA -->
        <div class="col-md-8 col-xs-12">

          <s-input
            v-model="Tipoexamemedico.form.nome"
            label="Nome"
            outlined
          />

          <div class="q-mt-md">

            <s-editor
              v-model="Tipoexamemedico.form.descricao"
              label="Descrição"
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
                Configuração
              </div>

              <s-input
                v-model="Tipoexamemedico.form.ordem"
                type="number"
                label="Ordem"
                outlined
              />

              <div class="q-mt-lg">

                <s-switch
                  v-model="Tipoexamemedico.form.ativo"
                  label="Activo"
                />

              </div>

            </q-card-section>

          </q-card>

        </div>

      </div>

    </div>

    <!-- FOOTER -->
    <q-separator />

    <div class="row justify-end q-pa-md q-gutter-sm">

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
        :loading="Tipoexamemedico.saving"
        @click="save"
      />

    </div>

  </s-card>
</template>

<script setup>
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

.dialog-card{

    width:70vw;
    max-width:1000px;
    min-width:700px;

    border-radius:16px;
    overflow:hidden;

}

.q-bar{

    height:52px;

}

:deep(.q-field){

    margin-bottom:12px;

}

</style>
