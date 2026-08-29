
<template>
  <q-page class="q-pa-sm">
    <s-pdf-render
      v-model="ReceitamedicaStore.showPdf"
      :src="ReceitamedicaStore.pdf"
      title="Receita Medica"
    />
    <PacienteHeader />
    <div class="prescription-banner">
        <table width="100%">
          <tr>
            <td width="80" align="center">
              <span class="rx-symbol"> ℞ </span>
            </td>

            <td align="center">
              <div class="banner-title">
                RECEITA MÉDICA
              </div>

              <div class="banner-subtitle">
                Prescrição emitida por profissional de saúde habilitado
              </div>
            </td>

            <td width="80"></td>
          </tr>
        </table>
      </div>

    <div class="row q-col-gutter-md">

      <!-- ESQUERDA -->
      <div class="col-md-5 col-sm-12 col-xs-12">

        <s-card flat class="q-pa-md">

          <div class="row items-center q-mb-md">
            <div class="text-h6">
              Medicamento
            </div>

            <q-space />

            <s-btn
              color="primary"
              icon="add"
              label="Novo Medicamento"
              @click="showMedicamentoDialog = true"
            />
          </div>

          <s-select
            v-model="item.medicamento"
            label="Medicamento"
            relation="saude.Medicamento"
            use-input
            emit-value
            map-options
            :options="medicamentoOptions"
            @filter="filterMedicamentos"
          />

          <s-input
            v-model="item.quantidade"
            label="Quantidade"
            class="q-mt-sm"
          />

          <s-input
            v-model="item.dosagem"
            label="Dosagem"
            class="q-mt-sm"
          />

          <s-editor
            v-model="item.observacao"
            label="Observação"
            class="q-mt-sm"
            min-height="100px"
          />

          <div class="row justify-end q-mt-md">
            <s-btn
              color="primary"
              icon="add"
              label="Adicionar"
              @click="addItem"
            />
          </div>

        </s-card>

      </div>

      <!-- DIREITA -->
      <div class="col-md-7 col-sm-12 col-xs-12">

        <s-card flat class="q-pa-md">

          <div class="text-h6 q-mb-md">
            Medicamentos da Receita
          </div>

          <q-list bordered separator v-if="items.length">

            <q-item
              v-for="(row, index) in items"
              :key="index"
            >
              <q-item-section>

                <q-item-label class="text-weight-bold">
                  {{ row.medicamento_label }}
                </q-item-label>

                <q-item-label caption>
                  Quantidade: {{ row.quantidade || '-' }}
                </q-item-label>

                <q-item-label caption>
                  Dosagem: {{ row.dosagem || '-' }}
                </q-item-label>

                <q-item-label
                  v-if="row.observacao"
                  caption
                >
                  Observação:
                  <span v-html="row.observacao"></span>
                </q-item-label>

              </q-item-section>

              <q-item-section side>
                <s-btn
                  flat
                  round
                  color="negative"
                  icon="delete"
                  @click="removeItem(index)"
                />
              </q-item-section>

            </q-item>

          </q-list>

          <div
            v-else
            class="text-grey text-center q-pa-lg"
          >
            Nenhum medicamento adicionado.
          </div>

          <div class="row justify-end q-mt-md">

            <s-btn
              flat
              color="grey"
              label="Cancelar"
              @click="router.back()"
            />

            <s-btn
              color="primary"
              icon="save"
              label="Gravar Receita"
              :loading="saving"
              :disable="!items.length"
              @click="saveReceita"
            />

          </div>

        </s-card>

      </div>

    </div>

    <!-- MODAL NOVO MEDICAMENTO -->
    <q-dialog v-model="showMedicamentoDialog" persistent>
      <s-card style="width: 600px; max-width: 95vw;" class="q-pa-md">

        <div class="text-h6 q-mb-md">
          Novo Medicamento
        </div>

        <s-input
          v-model="medicamento.codigo"
          label="Código"
        />

        <s-input
          v-model="medicamento.descricao"
          label="Descrição"
          class="q-mt-sm"
        />

        <s-input
          v-model="medicamento.principio_ativo"
          label="Princípio Activo"
          class="q-mt-sm"
        />

        <s-input
          v-model="medicamento.forma_farmaceutica"
          label="Forma Farmacêutica"
          class="q-mt-sm"
        />

        <s-input
          v-model="medicamento.dosagem"
          label="Dosagem"
          class="q-mt-sm"
        />

        <s-editor
          v-model="medicamento.observacao"
          label="Observação"
          class="q-mt-sm"
          min-height="100px"
        />

        <div class="row justify-end q-mt-md">
          <s-btn
            flat
            label="Cancelar"
            color="grey"
            @click="showMedicamentoDialog = false"
          />

          <s-btn
            color="primary"
            icon="save"
            label="Gravar"
            :loading="savingMedicamento"
            @click="saveMedicamento"
          />
        </div>

      </s-card>
    </q-dialog>

  </q-page>
</template>

<style >
  .prescription-banner {
  background: #f8fbff;
  border: 2px solid #2563eb;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 20px;
}

.rx-symbol {
  font-size: 48px;
  color: #2563eb;
  font-weight: bold;
}

.banner-title {
  font-size: 26px;
  font-weight: bold;
  color: #2563eb;
  letter-spacing: 2px;
}

.banner-subtitle {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}
</style>



<script setup>


import { useReceitamedicaStore } from './receitamedicaStore'


const ReceitamedicaStore = useReceitamedicaStore()

function afterSave(item) {
  ReceitamedicaStore.getPdf(item.id)
  ReceitamedicaStore.showPdf = true
  ReceitamedicaStore.loadData()
}
import { ref, onMounted } from 'vue'
// import { useRoute, useRouter } from 'vue-router'
import { useRouter } from 'vue-router'
import { HTTPAuth, url } from 'quasar_resaas'
import PacienteHeader from './../paciente/PacienteHeaderPage.vue'
import { usePacienteStore } from './../paciente/pacienteStore'


const Paciente = usePacienteStore()

// const route = useRoute()
const router = useRouter()

const saving = ref(false)
const savingMedicamento = ref(false)



const items = ref([])

const medicamentoOptions = ref([])

const showMedicamentoDialog = ref(false)

const item = ref({
  medicamento: null,
  medicamento_label: '',
  quantidade: '',
  dosagem: '',
  observacao: ''
})

const medicamento = ref({
  codigo: '',
  descricao: '',
  principio_ativo: '',
  forma_farmaceutica: '',
  dosagem: '',
  observacao: ''
})

onMounted(() => {
  loadMedicamentos()
})

async function loadMedicamentos(search = '') {
  const { data } = await HTTPAuth.get(
    url({
      type: 'u',
      url: 'django_resaas/relations/',
      params: {
        model: 'saude.Medicamento',
        search
      }
    })
  )

  medicamentoOptions.value = data.map(row => ({
    label: row.label,
    value: row.value || row.id
  }))
}

function filterMedicamentos(val, update) {
  update(async () => {
    await loadMedicamentos(val)
  })
}

function addItem() {
  if (!item.value.medicamento) return

  const selected = medicamentoOptions.value.find(
    x => String(x.value) === String(item.value.medicamento)
  )

  items.value.push({
    medicamento: item.value.medicamento,
    medicamento_label: selected?.label || 'Medicamento',
    quantidade: item.value.quantidade,
    dosagem: item.value.dosagem,
    observacao: item.value.observacao
  })


  item.value = {
    medicamento: null,
    medicamento_label: '',
    quantidade: '',
    dosagem: '',
    observacao: ''
  }
}

function removeItem(index) {
  items.value.splice(index, 1)
}

async function saveMedicamento() {
  savingMedicamento.value = true

  try {
    const { data } = await HTTPAuth.post(
      url({
        type: 'u',
        url: 'saude/medicamentos/'
      }),
      medicamento.value
    )

    showMedicamentoDialog.value = false

    medicamentoOptions.value.push({
      label: data.descricao,
      value: data.id
    })

    item.value.medicamento = data.id

    medicamento.value = {
      codigo: '',
      descricao: '',
      principio_ativo: '',
      forma_farmaceutica: '',
      dosagem: '',
      observacao: ''
    }

  } finally {
    savingMedicamento.value = false
  }
}

async function saveReceita() {


  saving.value = true

  try {
    const receitaRes = await HTTPAuth.post(
      url({
        type: 'u',
        url: 'saude/receitamedicas/'
      }),
      {
        paciente: Paciente.row.id
      }
    )

    const receita = receitaRes.data

    for (const row of items.value) {
      await HTTPAuth.post(
        url({
          type: 'u',
          url: 'saude/itemreceitas/'
        }),
        {
          receita: receita.data.id,
          medicamento: row.medicamento,
          quantidade: row.quantidade,
          dosagem: row.dosagem,
          observacao: row.observacao
        }
      )
    }

    afterSave(receita.data)

  } finally {
    saving.value = false
  }
}
</script>

