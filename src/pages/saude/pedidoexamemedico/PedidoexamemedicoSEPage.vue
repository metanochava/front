<template>
  <q-page class="q-pa-sm">
    <s-pdf-render
      v-model="Pedidoexamemedico.showPdf"
      :src="Pedidoexamemedico.pdf"
      title="Pedido de Exames Medicos"
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
                PEDIDO DE EXAMES MÉDICOS
              </div>

              <div class="banner-subtitle">
                Requisição emitida por profissional de saúde habilitado
              </div>
            </td>

            <td width="80"></td>
          </tr>
        </table>
      </div>

    <div class="row q-col-gutter-md">
      <!-- ESQUERDA -->
      <div class="col-md-7 col-sm-12 col-xs-12">
        <div class="q-pa-md col-12">

          <s-btn
            class="full-width q-mb-sm"
            color="primary"
            icon="add"
            label="Add Tipo Exame"
            @click="dialogs.tipo = true"
          />

          <s-input
            v-model="search"
            type="search"
            label="Pesquisar exame"
            clearable
            dense
            class="q-mb-sm"
          />

          <div v-if="loadingCatalogo" class="flex flex-center q-pa-xl">
            <q-spinner size="40px" color="primary" />
          </div>

          <q-list v-else bordered class="rounded-borders">
            <q-expansion-item
              v-for="tipo in filteredCatalogo"
              :key="tipo.id"
              group="tipo-exame"
              icon="science"
              :label="tipo.nome"
              header-class="text-primary text-weight-bold"
              expand-separator
            >
              <template #header>
                <q-item-section avatar>
                  <s-btn
                    dense
                    flat
                    round
                    color="primary"
                    icon="add"
                    @click="openClasseModal(tipo)"
                  />
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-weight-bold">
                    {{ tipo.nome }}
                  </q-item-label>
                </q-item-section>


              </template>

              <q-card flat>
                <q-card-section>
                  <div class="row q-col-gutter-md">
                    <div
                      v-for="classe in tipo.classes"
                      :key="classe.id"
                      class="col-md-6 col-sm-12 col-xs-12"
                    >
                      <q-expansion-item
                        dense
                        expand-separator
                        class="classe-box"
                      >
                        <template #header>
                          <q-item-section avatar>
                            <s-btn
                              dense
                              flat
                              round
                              color="primary"
                              icon="add"
                              @click="openExameModal(classe)"
                            />
                          </q-item-section>

                          <q-item-section>
                            <q-item-label class="text-weight-medium">
                              {{ classe.nome }}
                            </q-item-label>
                          </q-item-section>
                        </template>

                        <div class="q-pa-sm">
                          <div class="row q-col-gutter-sm">
                            <div
                              v-for="exame in classe.exames"
                              :key="exame.id"
                              class="col-md-6 col-sm-6 col-xs-12"
                            >
                              <q-card
                                flat
                                bordered
                                class="exame-card cursor-pointer"
                                @click="selectExame(tipo, classe, exame)"
                              >
                                <q-card-section class="q-pa-sm">
                                  <div class="text-body2 text-weight-medium ellipsis">
                                    {{ exame.nome }}
                                  </div>

                                  <div
                                    v-if="exame.codigo"
                                    class="text-caption text-grey-7"
                                  >
                                    {{ exame.codigo }}
                                  </div>

                                  <div class="row justify-end q-mt-xs">
                                    <s-btn
                                      dense
                                      flat
                                      round
                                      color="primary"
                                      icon="add"
                                      @click="selectAndAdd(tipo, classe, exame)"
                                    />
                                  </div>
                                </q-card-section>
                              </q-card>
                            </div>
                          </div>
                        </div>
                      </q-expansion-item>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
        </div>
      </div>

      <!-- DIREITA mantém igual -->
      <div class="col-md-5 col-sm-12 col-xs-12">
        <s-card flat bordered class="q-pa-md">
          <div class="row items-center q-mb-md">
            <div class="text-h6 text-weight-bold">
              Exames Adicionados
            </div>

            <q-space />

            <q-badge color="primary">
              {{ items.length }}
            </q-badge>
          </div>

           <s-editor
            v-model="Pedidoexamemedico.form.informacao_clinica"
            label="Informação Clínica"
            min-height="120px"
            class="q-mb-sm"
          />

          <q-list v-if="items.length" bordered separator>
            <q-item
              v-for="(item, index) in items"
              :key="index"
            >
              <q-item-section>
                <q-item-label class="text-weight-bold">
                  {{ item.exame_label }}
                </q-item-label>

                <q-item-label caption>
                  Tipo: {{ item.tipo_label }}
                </q-item-label>

                <q-item-label caption>
                  Classe: {{ item.classe_label }}
                </q-item-label>

                <q-item-label caption>
                  Prioridade: {{ item.prioridade_label }}
                </q-item-label>

                <q-item-label v-if="item.instrucoes" caption>
                  <span v-html="item.instrucoes"></span>
                </q-item-label>

                <q-item-label v-if="item.observacao" caption>
                  <span v-html="item.observacao"></span>
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <s-btn
                  flat
                  round
                  color="negative"
                  icon="delete"
                  @click="removeExame(index)"
                />
              </q-item-section>
            </q-item>
          </q-list>

          <div v-else class="text-center text-grey q-pa-xl">
            Nenhum exame adicionado.
          </div>

          <q-separator class="q-my-md" />



          <s-editor
            v-model="Pedidoexamemedico.form.outros_exames"
            label="Outros Exames"
            min-height="100px"
            class="q-mb-sm"
          />

          <div class="row justify-end q-gutter-sm q-mt-md">
            <s-btn
              flat
              color="grey"
              label="Cancelar"
              @click="router.back()"
            />

            <s-btn
              color="primary"
              icon="save"
              label="Gravar Pedido"
              :loading="saving"
              :disable="!items.length"
              @click="savePedido"
            />
          </div>
        </s-card>
      </div>
    </div>

    <q-dialog v-model="dialogs.tipo" persistent>
      <TipoExameModal @saved="onCatalogoChanged"
        @cancel="dialogs.tipo=false"
      />
    </q-dialog>

    <q-dialog v-model="dialogs.classe" persistent>
      <ClassExameModal
        :tipo-id="selectedTipo?.id"
        @saved="onCatalogoChanged"
         @cancel="dialogs.classe=false"
      />
    </q-dialog>

    <q-dialog v-model="dialogs.exame" persistent>
      <ExameModal
        :classe-id="selectedClasse?.id"
        @saved="onCatalogoChanged"
        @cancel="dialogs.exame=false"
      />
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

import { ref, computed, onMounted } from 'vue'
import { HTTPAuth, url } from 'quasar_resaas'
import PacienteHeader from './../paciente/PacienteHeaderPage.vue'
import TipoExameModal from './TipoExameModal.vue'
import ExameModal from './ExameModal.vue'
import ClassExameModal from './ClassExameModal.vue'
import { usePedidoexamemedicoStore } from './pedidoexamemedicoStore.js'

import { usePacienteStore } from './../paciente/pacienteStore'


const Paciente = usePacienteStore()

const Pedidoexamemedico = usePedidoexamemedicoStore()

const items = ref([])
const catalogo = ref([])
const search = ref('')
const loadingCatalogo = ref(false)

const selectedTipo = ref(null)
const selectedClasse = ref(null)
const selectedExame = ref(null)

const dialogs = ref({
  tipo: false,
  classe: false,
  exame: false
})


const form = ref({
  prioridade: 'normal',
  instrucoes: '',
  observacao: ''
})

const prioridadeOptions = [
  { label: 'Normal', value: 'normal' },
  { label: 'Urgente', value: 'urgente' },
  { label: 'Muito Urgente', value: 'muito_urgente' }
]

const filteredCatalogo = computed(() => {
  const q = normalize(search.value)

  if (!q) return catalogo.value

  return catalogo.value
    .map(tipo => {
      const classes = tipo.classes
        .map(classe => {
          const exames = classe.exames.filter(exame =>
            normalize(exame.nome).includes(q) ||
            normalize(exame.codigo).includes(q) ||
            normalize(exame.descricao).includes(q)
          )

          const classeMatch = normalize(classe.nome).includes(q)

          return {
            ...classe,
            exames: classeMatch ? classe.exames : exames
          }
        })
        .filter(classe =>
          classe.exames.length ||
          normalize(classe.nome).includes(q)
        )

      const tipoMatch = normalize(tipo.nome).includes(q)

      return {
        ...tipo,
        classes: tipoMatch ? tipo.classes : classes
      }
    })
    .filter(tipo =>
      tipo.classes.length ||
      normalize(tipo.nome).includes(q)
    )
})

onMounted(async () => {
  await loadCatalogo()
})

async function savePedido () {
  if (!Paciente.row?.id) return
  if (!items.value.length) return

  Pedidoexamemedico.saving = true

  try {
    Pedidoexamemedico.form.paciente = Paciente.row.id

    const pedidoexame = await Pedidoexamemedico.save()

    const pedidoId = pedidoexame?.id || pedidoexame?.data?.id

    for (const row of items.value) {
      await HTTPAuth.post(
        url({
          type: 'u',
          url: 'saude/itempedidoexamemedicos/'
        }),
        {
          pedido: pedidoId,
          exame: row.exame,
          prioridade: row.prioridade,
          instrucoes: row.instrucoes,
          observacao: row.observacao
        }
      )
    }

    afterSave(pedidoexame.data)
  } finally {
    Pedidoexamemedico.saving = false
  }
}

async function loadCatalogo() {
  loadingCatalogo.value = true

  try {
    const { data } = await HTTPAuth.get(
      url({
        type: 'u',
        url: 'saude/catalogoexames/'
      })
    )

    catalogo.value = Array.isArray(data) ? data : []
  } finally {
    loadingCatalogo.value = false
  }
}

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function openClasseModal(tipo) {
  selectedTipo.value = tipo
  dialogs.value.classe = true
}

function openExameModal(classe) {
  selectedClasse.value = classe
  dialogs.value.exame = true
}

function onCatalogoChanged() {
  dialogs.value.tipo = false
  dialogs.value.classe = false
  dialogs.value.exame = false
  loadCatalogo()
}

function selectExame(tipo, classe, exame) {
  selectedTipo.value = tipo
  selectedClasse.value = classe
  selectedExame.value = exame
}

function selectAndAdd(tipo, classe, exame) {
  selectExame(tipo, classe, exame)
  addExame()
}

function afterSave(item) {
  Pedidoexamemedico.getPdf(item.id)
  Pedidoexamemedico.showPdf = true
  Pedidoexamemedico.loadData()
}

function addExame() {
  if (!selectedExame.value) return

  const exists = items.value.some(
    item => String(item.exame) === String(selectedExame.value.id)
  )

  if (exists) return

  items.value.push({
    tipo_exame_medico: selectedTipo.value.id,
    tipo_label: selectedTipo.value.nome,

    classe_exame_medico: selectedClasse.value.id,
    classe_label: selectedClasse.value.nome,

    exame: selectedExame.value.id,
    exame_label: selectedExame.value.codigo
      ? `${selectedExame.value.codigo} - ${selectedExame.value.nome}`
      : selectedExame.value.nome,

    prioridade: form.value.prioridade,
    prioridade_label:
      prioridadeOptions.find(x => x.value === form.value.prioridade)?.label ||
      'Normal',

    instrucoes: form.value.instrucoes,
    observacao: form.value.observacao
  })

  selectedTipo.value = null
  selectedClasse.value = null
  selectedExame.value = null

  form.value = {
    prioridade: 'normal',
    instrucoes: '',
    observacao: ''
  }
}

function removeExame(index) {
  items.value.splice(index, 1)
}
</script>

<style scoped>
.classe-box {
  border: 1px solid rgba(0, 0, 0, .08);
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
}

.exame-card {
  border-radius: 10px;
  transition: .15s;
}

.exame-card:hover {
  border-color: var(--q-primary);
  transform: translateY(-1px);
}
</style>
