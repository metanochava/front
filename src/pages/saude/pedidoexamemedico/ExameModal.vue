<template>
  <s-card
    flat
    bordered
    class="dialog-card"
  >
    <!-- HEADER -->
    <q-bar :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-primary text-white'">

      <q-icon
        name="biotech"
        size="22px"
      />

      <div class="text-subtitle1 text-weight-bold q-ml-sm">
        Novo Exame Médico
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
        :loading="Examemedico.saving"
        @click="save"
      />

    </div>

  </s-card>
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

.dialog-card{

    width:75vw;
    max-width:1200px;
    min-width:850px;

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
