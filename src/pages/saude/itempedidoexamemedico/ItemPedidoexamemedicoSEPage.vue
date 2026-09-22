<template>
  <q-page class="q-pa-sm">
    <PacienteHeader />

    <div class="row q-col-gutter-md">
      <div class="col-md-5 col-sm-12 col-xs-12">
        <s-card flat bordered class="q-pa-md">
          <div class="row items-center q-mb-md">
            <div class="text-h6 text-weight-bold">
              {{ tdc('Exam request') }}
            </div>
            <q-space />
          </div>

          <div class="row q-col-gutter-sm q-mb-sm">
            <div class="col">
              <s-select
                v-model="form.tipo_exame_medico"
                :label="tdc('Exam type')"
                :options="tipoOptions"
                emit-value
                map-options
                clearable
              />
            </div>

            <div class="col-auto">
              <s-btn
                color="primary"
                icon="add"
                round
                @click="openTipoDialog"
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm q-mb-sm">
            <div class="col">
              <s-select
                v-model="form.classe_exame_medico"
                :label="tdc('Exam class')"
                :options="classeOptions"
                emit-value
                map-options
                clearable
                :disable="!form.tipo_exame_medico"
              />
            </div>

            <div class="col-auto">
              <s-btn
                color="primary"
                icon="add"
                round
                :disable="!form.tipo_exame_medico"
                @click="openClasseDialog"
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm q-mb-sm">
            <div class="col">
              <s-select
                v-model="form.exame"
                :label="tdc('Medical exam')"
                :options="exameOptions"
                emit-value
                map-options
                clearable
                :disable="!form.classe_exame_medico"
              />
            </div>

            <div class="col-auto">
              <s-btn
                color="primary"
                icon="add"
                round
                :disable="!form.classe_exame_medico"
                @click="openExameDialog"
              />
            </div>
          </div>

          <s-select
            v-model="form.prioridade"
            :label="tdc('Priority')"
            :options="prioridadeOptions"
            emit-value
            map-options
            class="q-mb-sm"
          />

          <s-editor
            v-model="form.instrucoes"
            :label="tdc('Instructions')"
            min-height="100px"
            class="q-mb-sm"
          />

          <s-editor
            v-model="form.observacao"
            :label="tdc('Observation')"
            min-height="100px"
            class="q-mb-sm"
          />

          <div class="row justify-end q-mt-md">
            <s-btn
              color="primary"
              icon="add"
              :label="tdc('Add exam')"
              :disable="!form.exame"
              @click="addExame"
            />
          </div>
        </s-card>
      </div>

      <div class="col-md-7 col-sm-12 col-xs-12">
        <s-card flat bordered class="q-pa-md">
          <div class="row items-center q-mb-md">
            <div class="text-h6 text-weight-bold">
              {{ tdc('Added exams') }}
            </div>

            <q-space />

            <q-badge color="primary">
              {{ items.length }}
            </q-badge>
          </div>

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
                  {{ tdc('Type') }}: {{ item.tipo_label }}
                </q-item-label>

                <q-item-label caption>
                  {{ tdc('Class') }}: {{ item.classe_label }}
                </q-item-label>

                <q-item-label caption>
                  {{ tdc('Priority') }}: {{ item.prioridade_label }}
                </q-item-label>

                <q-item-label
                  v-if="item.instrucoes"
                  caption
                >
                  <span v-html="item.instrucoes"></span>
                </q-item-label>

                <q-item-label
                  v-if="item.observacao"
                  caption
                >
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

          <div
            v-else
            class="text-center text-grey q-pa-xl"
          >
            {{ tdc('No exam added.') }}
          </div>

          <q-separator class="q-my-md" />

          <s-editor
            v-model="pedido.informacao_clinica"
            :label="tdc('Clinical information')"
            min-height="120px"
            class="q-mb-sm"
          />

          <s-editor
            v-model="pedido.outros_exames"
            :label="tdc('Other exams')"
            min-height="100px"
            class="q-mb-sm"
          />

          <div class="row justify-end q-gutter-sm q-mt-md">
            <s-btn
              flat
              color="grey"
              :label="tdc('Cancel')"
              @click="router.back()"
            />

            <s-btn
              color="primary"
              icon="save"
              :label="tdc('Save request')"
              :loading="saving"
              :disable="!items.length"
              @click="savePedido"
            />
          </div>
        </s-card>
      </div>
    </div>

    <q-dialog v-model="dialogs.tipo" persistent>
      <s-modal-card :title="tdc('New exam type')" width="500px">
        <s-input
          v-model="tipoForm.nome"
          :label="tdc('Name')"
          class="q-mb-sm"
        />

        <s-editor
          v-model="tipoForm.descricao"
          :label="tdc('Description')"
          min-height="100px"
          class="q-mb-sm"
        />

        <s-input
          v-model="tipoForm.ordem"
          :label="tdc('Order')"
          type="number"
          class="q-mb-sm"
        />

        <s-switch
          v-model="tipoForm.ativo"
          :label="tdc('Active')"
        />

        <template #footer>
          <s-btn
                      flat
                      :label="tdc('Cancel')"
                      color="grey"
                      @click="dialogs.tipo = false"
                    />

                    <s-btn
                      color="primary"
                      icon="save"
                      :label="tdc('Save')"
                      :loading="savingTipo"
                      @click="saveTipo"
                    />

        </template>
      </s-modal-card>
    </q-dialog>

    <q-dialog v-model="dialogs.classe" persistent>
      <s-modal-card :title="tdc('New exam class')" width="600px">
        <s-select
          v-model="classeForm.tipo_exame_medico"
          :label="tdc('Exam type')"
          :options="tipoOptions"
          emit-value
          map-options
          class="q-mb-sm"
        />

        <s-input
          v-model="classeForm.nome"
          :label="tdc('Name')"
          class="q-mb-sm"
        />

        <s-editor
          v-model="classeForm.descricao"
          :label="tdc('Description')"
          min-height="100px"
          class="q-mb-sm"
        />

        <s-input
          v-model="classeForm.ordem"
          :label="tdc('Order')"
          type="number"
          class="q-mb-sm"
        />

        <s-switch
          v-model="classeForm.ativo"
          :label="tdc('Active')"
        />

        <template #footer>
          <s-btn
                      flat
                      :label="tdc('Cancel')"
                      color="grey"
                      @click="dialogs.classe = false"
                    />

                    <s-btn
                      color="primary"
                      icon="save"
                      :label="tdc('Save')"
                      :loading="savingClasse"
                      @click="saveClasse"
                    />

        </template>
      </s-modal-card>
    </q-dialog>

    <q-dialog v-model="dialogs.exame" persistent>
      <s-modal-card :title="tdc('New medical exam')" width="700px">
        <s-select
          v-model="exameForm.classe_exame_medico"
          :label="tdc('Exam class')"
          :options="classeOptions"
          emit-value
          map-options
          class="q-mb-sm"
        />

        <div class="row q-col-gutter-sm">
          <div class="col-md-4 col-xs-12">
            <s-input
              v-model="exameForm.codigo"
              :label="tdc('Code')"
            />
          </div>

          <div class="col-md-8 col-xs-12">
            <s-input
              v-model="exameForm.nome"
              :label="tdc('Name')"
            />
          </div>
        </div>

        <s-editor
          v-model="exameForm.descricao"
          :label="tdc('Description')"
          min-height="100px"
          class="q-mt-sm"
        />

        <s-editor
          v-model="exameForm.preparacao"
          :label="tdc('Preparation')"
          min-height="100px"
          class="q-mt-sm"
        />

        <div class="row q-col-gutter-sm q-mt-sm">
          <div class="col-md-4 col-xs-12">
            <s-input
              v-model="exameForm.amostra"
              :label="tdc('Sample')"
            />
          </div>

          <div class="col-md-4 col-xs-12">
            <s-input
              v-model="exameForm.prazo_horas"
              :label="tdc('Deadline (hours)')"
              type="number"
            />
          </div>

          <div class="col-md-4 col-xs-12">
            <s-switch
              v-model="exameForm.ativo"
              :label="tdc('Active')"
            />
          </div>
        </div>

        <s-input
          v-model="exameForm.valor_referencia"
          :label="tdc('Reference value')"
          class="q-mt-sm"
        />

        <template #footer>
          <s-btn
                      flat
                      :label="tdc('Cancel')"
                      color="grey"
                      @click="dialogs.exame = false"
                    />

                    <s-btn
                      color="primary"
                      icon="save"
                      :label="tdc('Save')"
                      :loading="savingExame"
                      @click="saveExame"
                    />

        </template>
      </s-modal-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { HTTPAuth, url, tdc } from 'quasar_resaas'
import PacienteHeader from '../paciente/PacienteHeaderPage.vue'

import { usePedidoexamemedicoStore } from './../pedidoexamemedico/pedidoexamemedicoStore.js'
import { useTipoexamemedicoStore } from '../tipoexamemedico/tipoexamemedicoStore.js'
import { useClasseexamemedicoStore } from '../classeexamemedico/classeexamemedicoStore.js'
import { useExamemedicoStore } from '../examemedico/examemedicoStore.js'
import { useItempedidoexamemedicoStore } from './itempedidoexamemedicoStore.js'

const route = useRoute()
const router = useRouter()

const Pedidoexamemedico = usePedidoexamemedicoStore()
const Tipoexamemedico = useTipoexamemedicoStore()
const Classeexamemedico = useClasseexamemedicoStore()
const Examemedico = useExamemedicoStore()
const Itempedidoexamemedico = useItempedidoexamemedicoStore()

const saving = ref(false)
const savingTipo = ref(false)
const savingClasse = ref(false)
const savingExame = ref(false)

const items = ref([])

const dialogs = ref({
  tipo: false,
  classe: false,
  exame: false
})

const pedido = ref({
  informacao_clinica: '',
  outros_exames: ''
})

const form = ref({
  tipo_exame_medico: null,
  classe_exame_medico: null,
  exame: null,
  prioridade: 'normal',
  instrucoes: '',
  observacao: ''
})

const tipoForm = ref({
  nome: '',
  descricao: '',
  ordem: 0,
  ativo: true
})

const classeForm = ref({
  tipo_exame_medico: null,
  nome: '',
  descricao: '',
  ordem: 0,
  ativo: true
})

const exameForm = ref({
  classe_exame_medico: null,
  codigo: '',
  nome: '',
  descricao: '',
  preparacao: '',
  amostra: '',
  prazo_horas: null,
  valor_referencia: '',
  ativo: true
})

const prioridadeOptions = [
  {
    label: tdc('Normal'),
    value: 'normal'
  },
  {
    label: tdc('Urgent'),
    value: 'urgente'
  },
  {
    label: tdc('Very urgent'),
    value: 'muito_urgente'
  }
]

const tipoOptions = computed(() =>
  rowsOf(Tipoexamemedico).map(row => ({
    label: row.nome,
    value: row.id
  }))
)

const classeOptions = computed(() =>
  rowsOf(Classeexamemedico)
    .filter(row => {
      if (!form.value.tipo_exame_medico) return true

      const tipo = row.tipo_exame_medico_id || row.tipo_exame_medico?.id || row.tipo_exame_medico

      return String(tipo) === String(form.value.tipo_exame_medico)
    })
    .map(row => ({
      label: row.nome,
      value: row.id
    }))
)

const exameOptions = computed(() =>
  rowsOf(Examemedico)
    .filter(row => {
      if (!form.value.classe_exame_medico) return true

      const classe = row.classe_exame_medico_id || row.classe_exame_medico?.id || row.classe_exame_medico

      return String(classe) === String(form.value.classe_exame_medico)
    })
    .map(row => ({
      label: row.codigo ? `${row.codigo} - ${row.nome}` : row.nome,
      value: row.id
    }))
)

watch(
  () => form.value.tipo_exame_medico,
  () => {
    form.value.classe_exame_medico = null
    form.value.exame = null
  }
)

watch(
  () => form.value.classe_exame_medico,
  () => {
    form.value.exame = null
  }
)

onMounted(init)

async function init() {
  await Promise.all([
    Pedidoexamemedico.init?.(),
    Tipoexamemedico.init?.(),
    Classeexamemedico.init?.(),
    Examemedico.init?.(),
    Itempedidoexamemedico.init?.()
  ])

  await loadAll()
}

async function loadAll() {
  await Promise.all([
    loadStore(Tipoexamemedico),
    loadStore(Classeexamemedico),
    loadStore(Examemedico)
  ])
}

async function loadStore(store) {
  if (store.get) {
    await store.get()
    return
  }

  if (store.load) {
    await store.load()
    return
  }

  if (store.index) {
    await store.index()
  }
}

function rowsOf(store) {
  return store.rows || store.data || store.items || []
}

function selectedLabel(options, value) {
  return options.find(
    option => String(option.value) === String(value)
  )?.label || ''
}

function addExame() {
  if (!form.value.exame) return

  const alreadyExists = items.value.some(
    item => String(item.exame) === String(form.value.exame)
  )

  if (alreadyExists) return

  items.value.push({
    tipo_exame_medico: form.value.tipo_exame_medico,
    tipo_label: selectedLabel(tipoOptions.value, form.value.tipo_exame_medico),

    classe_exame_medico: form.value.classe_exame_medico,
    classe_label: selectedLabel(classeOptions.value, form.value.classe_exame_medico),

    exame: form.value.exame,
    exame_label: selectedLabel(exameOptions.value, form.value.exame),

    prioridade: form.value.prioridade,
    prioridade_label: selectedLabel(prioridadeOptions, form.value.prioridade),

    instrucoes: form.value.instrucoes,
    observacao: form.value.observacao
  })

  form.value.exame = null
  form.value.prioridade = 'normal'
  form.value.instrucoes = ''
  form.value.observacao = ''
}

function removeExame(index) {
  items.value.splice(index, 1)
}

function openTipoDialog() {
  tipoForm.value = {
    nome: '',
    descricao: '',
    ordem: 0,
    ativo: true
  }

  dialogs.value.tipo = true
}

function openClasseDialog() {
  classeForm.value = {
    tipo_exame_medico: form.value.tipo_exame_medico,
    nome: '',
    descricao: '',
    ordem: 0,
    ativo: true
  }

  dialogs.value.classe = true
}

function openExameDialog() {
  exameForm.value = {
    classe_exame_medico: form.value.classe_exame_medico,
    codigo: '',
    nome: '',
    descricao: '',
    preparacao: '',
    amostra: '',
    prazo_horas: null,
    valor_referencia: '',
    ativo: true
  }

  dialogs.value.exame = true
}

async function saveTipo() {
  if (!tipoForm.value.nome) return

  savingTipo.value = true

  try {
    const created = await createWithStoreOrHttp(
      Tipoexamemedico,
      'saude/tipoexamemedicos/',
      tipoForm.value
    )

    await loadStore(Tipoexamemedico)

    form.value.tipo_exame_medico = created?.id || created?.data?.id

    dialogs.value.tipo = false
  } finally {
    savingTipo.value = false
  }
}

async function saveClasse() {
  if (!classeForm.value.nome || !classeForm.value.tipo_exame_medico) return

  savingClasse.value = true

  try {
    const created = await createWithStoreOrHttp(
      Classeexamemedico,
      'saude/classeexamemedicos/',
      classeForm.value
    )

    await loadStore(Classeexamemedico)

    form.value.classe_exame_medico = created?.id || created?.data?.id

    dialogs.value.classe = false
  } finally {
    savingClasse.value = false
  }
}

async function saveExame() {
  if (!exameForm.value.nome || !exameForm.value.classe_exame_medico) return

  savingExame.value = true

  try {
    const created = await createWithStoreOrHttp(
      Examemedico,
      'saude/examemedicos/',
      exameForm.value
    )

    await loadStore(Examemedico)

    form.value.exame = created?.id || created?.data?.id

    dialogs.value.exame = false
  } finally {
    savingExame.value = false
  }
}

async function savePedido() {
  if (!items.value.length) return

  saving.value = true

  try {
    const paciente = route.params.id || route.params.paciente || route.query.paciente

    const pedidoCriado = await createWithStoreOrHttp(
      Pedidoexamemedico,
      'saude/pedidoexamemedicos/',
      {
        paciente,
        informacao_clinica: pedido.value.informacao_clinica,
        outros_exames: pedido.value.outros_exames
      }
    )

    const pedidoId = pedidoCriado?.id || pedidoCriado?.data?.id

    for (const item of items.value) {
      await createWithStoreOrHttp(
        Itempedidoexamemedico,
        'saude/itempedidoexamemedicos/',
        {
          pedido: pedidoId,
          exame: item.exame,
          prioridade: item.prioridade,
          instrucoes: item.instrucoes,
          observacao: item.observacao
        }
      )
    }

    router.back()
  } finally {
    saving.value = false
  }
}

async function createWithStoreOrHttp(store, endpoint, payload) {
  if (store.create) {
    const res = await store.create(payload)
    return res?.data || res
  }

  if (store.save) {
    store.form = payload
    const res = await store.save()
    return res?.data || res
  }

  const { data } = await HTTPAuth.post(
    url({
      type: 'u',
      url: endpoint
    }),
    payload
  )

  return data
}
</script>
