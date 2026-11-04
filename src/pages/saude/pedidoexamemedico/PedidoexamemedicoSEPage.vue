<template>
  <q-page class="q-pa-sm">
    <s-pdf-render
      v-model="Pedidoexamemedico.showPdf"
      :src="Pedidoexamemedico.pdf"
      :title="tdc('Medical exam request')"
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
                {{ tdc('Medical exam request').toUpperCase() }}
              </div>

              <div class="banner-subtitle">
                {{ tdc('Request issued by a qualified healthcare professional') }}
              </div>
            </td>

            <td width="80"></td>
          </tr>
        </table>
      </div>

    <div class="row q-col-gutter-md">
      <!-- ESQUERDA -->
      <div class="col-md-8 col-sm-12 col-xs-12">
        <div class="q-pa-md col-12">

          <!-- catalogue maintenance: each "+" only with its own add_ permission
               (UX only - the backend checks it again) -->
          <s-btn
            v-if="can.addType"
            class="full-width q-mb-sm"
            color="primary"
            icon="add"
            :label="tdc('Add exam type')"
            data-test="exam-add-type"
            @click="dialogs.tipo = true"
          />

          <s-input
            v-model="search"
            type="search"
            :label="tdc('Search exam')"
            clearable
            dense
            class="q-mb-sm"
          />

          <div v-if="loadingCatalogo" class="flex flex-center q-pa-xl">
            <q-spinner :color="$q.dark.isActive ? 'white' : 'primary'" size="48px" />
          </div>

          <q-list v-else bordered class="rounded-borders">
            <!-- the Entity's favourite exams (saude/favouriteexams/), first and
                 open; a search filters it like the catalogue below -->
            <q-expansion-item
              v-if="can.listFavourites"
              v-model="expanded.favourites"
              expand-separator
              data-test="exam-favourites"
            >
              <template #header>
                <q-item-section avatar>
                  <q-icon name="star" color="amber-8" size="20px" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold">{{ tdc('Favourites') }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-badge color="amber-8" :label="favouriteEntries.length" />
                </q-item-section>
              </template>

              <div class="q-pa-sm">
                <div v-if="!favouriteEntries.length" class="text-caption text-grey-7">
                  {{ tdc('No favourite exams yet: use the star of an exam to add it.') }}
                </div>
                <div v-else class="row q-col-gutter-xs">
                  <div
                    v-for="entry in favouriteEntries"
                    :key="entry.exame.id"
                    class="col-12 col-sm-6"
                  >
                    <ExameRow
                      :exame="entry.exame"
                      :search="search"
                      :added="isAdded(entry.exame)"
                      favourite
                      :can-favourite="can.removeFavourite"
                      @add="selectAndAdd(entry.tipo, entry.classe, entry.exame)"
                      @toggle-favourite="toggleFavourite(entry.exame)"
                    />
                  </div>
                </div>
              </div>
            </q-expansion-item>

            <!-- while searching every type / class found opens (no accordion group)
                 and the matching text is highlighted, as in the left menu -->
            <q-expansion-item
              v-for="tipo in filteredCatalogo"
              :key="tipo.id"
              v-model="expanded[`t-${tipo.id}`]"
              :group="searching ? undefined : 'tipo-exame'"
              icon="science"
              :label="tipo.nome"
              header-class="text-primary text-weight-bold"
              expand-separator
            >
              <template #header>
                <q-item-section avatar>
                  <s-btn
                    v-if="can.addClass"
                    dense
                    flat
                    round
                    color="primary"
                    icon="add"
                    data-test="exam-add-class"
                    @click.stop="openClasseModal(tipo)"
                  >
                    <s-tooltip>{{ tdc('Add exam class') }}</s-tooltip>
                  </s-btn>
                  <q-icon v-else name="science" color="primary" size="20px" />
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-weight-bold">
                    <s-highlight :text="tipo.nome" :search="search" />
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
                        v-model="expanded[`c-${classe.id}`]"
                        dense
                        expand-separator
                        class="classe-box"
                      >
                        <template #header>
                          <q-item-section avatar>
                            <s-btn
                              v-if="can.addExam"
                              dense
                              flat
                              round
                              color="primary"
                              icon="add"
                              data-test="exam-add-exam"
                              @click.stop="openExameModal(classe)"
                            >
                              <s-tooltip>{{ tdc('Add exam') }}</s-tooltip>
                            </s-btn>
                            <q-icon v-else name="category" color="primary" size="18px" />
                          </q-item-section>

                          <q-item-section>
                            <q-item-label class="text-weight-medium">
                              <s-highlight :text="classe.nome" :search="search" />
                            </q-item-label>
                          </q-item-section>
                        </template>

                        <div class="q-pa-xs">
                          <div class="row q-col-gutter-xs">
                            <div
                              v-for="exame in classe.exames"
                              :key="exame.id"
                              class="col-12 col-sm-6"
                            >
                              <ExameRow
                                :exame="exame"
                                :search="search"
                                :added="isAdded(exame)"
                                :favourite="isFavourite(exame)"
                                :can-favourite="isFavourite(exame) ? can.removeFavourite : can.addFavourite"
                                @add="selectAndAdd(tipo, classe, exame)"
                                @toggle-favourite="toggleFavourite(exame)"
                              />
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
      <div class="col-md-4 col-sm-12 col-xs-12">
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

           <s-editor
            v-model="Pedidoexamemedico.form.informacao_clinica"
            :label="tdc('Clinical information')"
            min-height="120px"
            class="q-mb-sm"
          />

          <!-- every added exam: its priority (always visible) and, folded, its
               instructions and notes; one control sets the priority of all -->
          <div v-if="items.length > 1" class="row items-center no-wrap q-mb-sm priority-all" data-test="exam-priority-all">
            <span class="text-caption text-grey-7 q-mr-sm">{{ tdc('Set the priority of every exam') }}</span>
            <q-btn-toggle
              :model-value="commonPriority"
              dense no-caps rounded unelevated size="sm"
              :options="priorityToggle"
              @update:model-value="setAllPriorities"
            />
          </div>

          <q-list v-if="items.length" bordered separator class="rounded-borders">
            <q-item
              v-for="(item, index) in items"
              :key="item.exame"
              class="column q-py-sm"
              :data-test="`added-exam-${index}`"
            >
              <div class="row items-start no-wrap full-width">
                <div class="col">
                  <div class="text-weight-bold">{{ item.exame_label }}</div>
                  <div class="text-caption text-grey-7">{{ item.tipo_label }} · {{ item.classe_label }}</div>
                </div>
                <s-btn flat round dense color="negative" icon="delete" @click="removeExame(index)">
                  <s-tooltip>{{ tdc('Remove') }}</s-tooltip>
                </s-btn>
              </div>

              <div class="row items-center no-wrap q-mt-xs">
                <span class="text-caption text-grey-7 q-mr-sm">{{ tdc('Priority') }}</span>
                <q-btn-toggle
                  v-model="item.prioridade"
                  dense no-caps rounded unelevated size="sm"
                  :options="priorityToggle"
                  :data-test="`added-exam-priority-${index}`"
                />
              </div>

              <q-expansion-item
                dense dense-toggle
                class="q-mt-xs"
                header-class="q-px-none text-caption text-primary"
                icon="edit_note"
                :label="item.instrucoes || item.observacao ? tdc('Instructions and notes') + ' ✓' : tdc('Instructions and notes')"
              >
                <div class="q-pt-xs q-gutter-y-sm">
                  <s-input v-model="item.instrucoes" type="textarea" autogrow dense :label="tdc('Instructions')" />
                  <s-input v-model="item.observacao" type="textarea" autogrow dense :label="tdc('Notes')" />
                </div>
              </q-expansion-item>
            </q-item>
          </q-list>

          <div v-else class="text-center text-grey q-pa-xl">
            {{ tdc('No exam added.') }}
          </div>

          <q-separator class="q-my-md" />



          <s-editor
            v-model="Pedidoexamemedico.form.outros_exames"
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
              :disable="!items.length || !can.saveRequest"
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

<style scoped>
/* day / night: the theme's primary colour, a light tint of it as background */
.prescription-banner {
  background: color-mix(in srgb, var(--q-primary) 6%, transparent);
  border: 2px solid var(--q-primary);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 20px;
}

.rx-symbol {
  font-size: 48px;
  color: var(--q-primary);
  font-weight: bold;
}

.banner-title {
  font-size: 26px;
  font-weight: bold;
  color: var(--q-primary);
  letter-spacing: 2px;
}

.banner-subtitle {
  font-size: 12px;
  opacity: .7;
  margin-top: 4px;
}

.body--dark .prescription-banner {
  background: color-mix(in srgb, var(--q-primary) 14%, transparent);
}
</style>

<script setup>

import { ref, computed, onMounted, watch } from 'vue'
import { HTTPAuth, url, tdc, useUserStore } from 'quasar_resaas'
import PacienteHeader from './../paciente/PacienteHeaderPage.vue'
import TipoExameModal from './TipoExameModal.vue'
import ExameModal from './ExameModal.vue'
import ClassExameModal from './ClassExameModal.vue'
import ExameRow from './ExameRow.vue'
import { usePedidoexamemedicoStore } from './pedidoexamemedicoStore.js'

import { usePacienteStore } from './../paciente/pacienteStore'


const Paciente = usePacienteStore()

// what this user may add (UX only - every endpoint checks it again):
// the exam catalogue (type / class / exam) and the request with its items
const User = useUserStore()
const can = computed(() => ({
  addType: User.can('add_tipoexamemedico'),
  addClass: User.can('add_classeexamemedico'),
  addExam: User.can('add_examemedico'),
  saveRequest: User.can('add_pedidoexamemedico') && User.can('add_itempedidoexamemedico'),
  // the Entity's favourite exams: reading it, putting an exam on it, taking one off
  listFavourites: User.can('list_favouriteexam'),
  addFavourite: User.can('add_favouriteexam'),
  removeFavourite: User.can('delete_favouriteexam'),
}))

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
  { label: tdc('Normal'), value: 'normal' },
  { label: tdc('Urgent'), value: 'urgente' }
]

// the priority buttons of each added exam: grey / red (danger) when chosen
const PRIORITY_COLORS = { normal: 'grey-7', urgente: 'negative' }
const priorityToggle = prioridadeOptions.map(o => ({ ...o, toggleColor: PRIORITY_COLORS[o.value] }))

// the shared priority when every exam has the same one (else none is lit)
const commonPriority = computed(() => {
  const values = new Set(items.value.map(item => item.prioridade))
  return values.size === 1 ? [...values][0] : null
})

function setAllPriorities(value) {
  for (const item of items.value) item.prioridade = value
}

// which type / class panels are open; a search opens every one it found and
// clearing it closes them again (the left menu's behaviour)
const expanded = ref({ favourites: true })
const searching = computed(() => !!normalize(search.value))

watch(search, () => {
  // the favourites keep their own open / closed state
  const open = { favourites: expanded.value.favourites }
  if (searching.value) {
    for (const tipo of filteredCatalogo.value) {
      open[`t-${tipo.id}`] = true
      for (const classe of tipo.classes || []) open[`c-${classe.id}`] = true
    }
  }
  expanded.value = open
})

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
  await Promise.all([loadCatalogo(), loadFavourites()])
})

// exam id -> its favourite row id (the row is what DELETE takes)
const favourites = ref({})
const favouriteBusy = ref(false)

// the favourites in catalogue order, each with its type and class (adding
// one to the request needs them), filtered by the search like the catalogue
const favouriteEntries = computed(() => {
  const entries = []
  for (const tipo of filteredCatalogo.value) {
    for (const classe of tipo.classes || []) {
      for (const exame of classe.exames || []) {
        if (isFavourite(exame)) entries.push({ tipo, classe, exame })
      }
    }
  }
  return entries
})

function isFavourite(exame) {
  return Object.prototype.hasOwnProperty.call(favourites.value, String(exame.id))
}

async function loadFavourites() {
  if (!can.value.listFavourites) return

  const { data } = await HTTPAuth.get(url({ type: 'u', url: 'saude/favouriteexams/' }))
  const map = {}
  for (const row of Array.isArray(data) ? data : []) {
    // READ shape {id, value, label} or the plain id
    const exameId = row.exame && typeof row.exame === 'object' ? (row.exame.id ?? row.exame.value) : row.exame
    map[String(exameId)] = row.id
  }
  favourites.value = map
}

async function toggleFavourite(exame) {
  if (favouriteBusy.value) return
  favouriteBusy.value = true

  try {
    const favouriteId = favourites.value[String(exame.id)]
    if (favouriteId) {
      await HTTPAuth.delete(url({ type: 'u', url: `saude/favouriteexams/${favouriteId}/` }))
    } else {
      await HTTPAuth.post(url({ type: 'u', url: 'saude/favouriteexams/' }), { exame: exame.id })
    }
  } finally {
    // the list is shared: re-read it, whoever else changed it meanwhile
    try {
      await loadFavourites()
    } finally {
      favouriteBusy.value = false
    }
  }
}

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

function isAdded(exame) {
  return items.value.some(item => String(item.exame) === String(exame.id))
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
}

.body--dark .classe-box {
  border-color: rgba(255, 255, 255, .12);
}

.exame-row {
  border: 1px solid rgba(0, 0, 0, .08);
  border-radius: 6px;
  padding: 2px 6px;
  min-height: 28px;
  transition: border-color .15s;
}

.exame-row:hover {
  border-color: var(--q-primary);
}

.exame-row--added {
  border-color: var(--q-positive);
}

.body--dark .exame-row:not(.exame-row--added):not(:hover) {
  border-color: rgba(255, 255, 255, .12);
}
</style>
