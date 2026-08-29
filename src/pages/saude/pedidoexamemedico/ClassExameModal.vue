<template>
  <s-card
    flat
    bordered
    class="dialog-card"
  >
    <!-- HEADER -->
    <q-bar :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-primary text-white'">
      <q-icon
        name="folder"
        size="22px"
      />

      <div class="text-subtitle1 text-weight-bold q-ml-sm">
        Nova Classe de Exame
      </div>

      <q-space />

      <s-btn
        dense
        flat
        round
        icon="close"
        color="white"
        @click="cancel"
        v-clo
      />
    </q-bar>

    <!-- BODY -->
    <div class="q-pa-lg">
      <div class="row q-col-gutter-lg">
        <!-- ESQUERDA -->
        <div class="col-md-8 col-xs-12">
          <s-select
            v-model="Classeexamemedico.form.tipo_exame_medico"
            label="Tipo de Exame"
            :options="tipoOptions"
            emit-value
            map-options
            outlined
          />

          <s-input
            v-model="Classeexamemedico.form.nome"
            label="Nome"
            outlined
          />

          <s-editor
            v-model="Classeexamemedico.form.descricao"
            label="Descrição"
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
                Configuração
              </div>

              <s-input
                v-model="Classeexamemedico.form.ordem"
                type="number"
                label="Ordem"
                outlined
              />

              <div class="q-mt-lg">
                <s-switch
                  v-model="Classeexamemedico.form.ativo"
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
        :loading="Classeexamemedico.saving"
        @click="save"
      />
    </div>
  </s-card>
</template>

<script setup>
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
