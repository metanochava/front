<template>
  <div class="exame-collapse">
    <div class="row items-center q-col-gutter-sm q-mb-sm">
      <div class="col">
        <s-input v-model="search" type="search" label="Pesquisar exame" dense clearable />
      </div>
      <div class="col-auto">
        <s-btn color="primary" icon="add" round @click="$emit('novo-tipo')" />
      </div>
    </div>

    <div v-if="!filteredTipos.length" class="text-grey text-center q-pa-md">
      Nenhum exame encontrado.
    </div>

    <q-list v-else bordered class="rounded-borders">
      <q-expansion-item v-for="tipo in filteredTipos" :key="tipo.id" group="tipo-exame" expand-separator>
        <template #header>
          <q-item-section avatar><q-icon name="science" color="primary" /></q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">{{ tipo.nome }}</q-item-label>
            <q-item-label caption>{{ countExamesByTipo(tipo.id) }} exames</q-item-label>
          </q-item-section>
          <q-item-section side>
            <s-btn dense flat round icon="add" color="primary" @click.stop="$emit('nova-classe', tipo)" />
          </q-item-section>
        </template>

        <div class="q-pl-md q-pr-sm q-pb-sm">
          <q-expansion-item v-for="classe in classesByTipo(tipo.id)" :key="classe.id" dense expand-separator class="classe-expansion">
            <template #header>
              <q-item-section avatar><q-icon name="folder" color="orange-8" /></q-item-section>
              <q-item-section>
                <q-item-label>{{ classe.nome }}</q-item-label>
                <q-item-label caption>{{ examesByClasse(classe.id).length }} exames</q-item-label>
              </q-item-section>
              <q-item-section side>
                <s-btn dense flat round icon="add" color="primary" @click.stop="$emit('novo-exame', classe)" />
              </q-item-section>
            </template>

            <div class="q-pl-md q-pr-xs q-pb-xs">
              <ExameItem
                v-for="exame in examesByClasse(classe.id)"
                :key="exame.id"
                :exame="exame"
                :selected="String(modelValue?.id || modelValue) === String(exame.id)"
                @select="selectExame"
                @add="$emit('add', buildPayload(tipo, classe, exame))"
              />
              <div v-if="!examesByClasse(classe.id).length" class="text-caption text-grey q-pa-sm">
                Esta classe ainda não tem exames.
              </div>
            </div>
          </q-expansion-item>

          <div v-if="!classesByTipo(tipo.id).length" class="text-caption text-grey q-pa-sm">
            Este tipo ainda não tem classes.
          </div>
        </div>
      </q-expansion-item>
    </q-list>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ExameItem from './ExameItem.vue'

const props = defineProps({
  modelValue: { type: [String, Number, Object, null], default: null },
  tipos: { type: Array, default: () => [] },
  classes: { type: Array, default: () => [] },
  exames: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:modelValue', 'select', 'add', 'novo-tipo', 'nova-classe', 'novo-exame'])
const search = ref('')

const filteredTipos = computed(() => {
  const q = normalize(search.value)
  if (!q) return props.tipos
  const tipoIds = new Set()

  for (const exame of props.exames) {
    if (normalize(exame.nome).includes(q) || normalize(exame.codigo).includes(q)) {
      const classe = props.classes.find(c => String(c.id) === String(getClasseIdFromExame(exame)))
      if (classe) tipoIds.add(String(getTipoIdFromClasse(classe)))
    }
  }

  for (const classe of props.classes) {
    if (normalize(classe.nome).includes(q)) tipoIds.add(String(getTipoIdFromClasse(classe)))
  }

  return props.tipos.filter(tipo => normalize(tipo.nome).includes(q) || tipoIds.has(String(tipo.id)))
})

function normalize(value) {
  return String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function getTipoIdFromClasse(classe) {
  return classe.tipo_exame_medico_id || classe.tipo_exame_medico?.id || classe.tipo_exame_medico
}

function getClasseIdFromExame(exame) {
  return exame.classe_exame_medico_id || exame.classe_exame_medico?.id || exame.classe_exame_medico
}

function classesByTipo(tipoId) {
  const q = normalize(search.value)
  return props.classes.filter(classe => {
    if (String(getTipoIdFromClasse(classe)) !== String(tipoId)) return false
    if (!q) return true
    return normalize(classe.nome).includes(q) || props.exames.some(exame =>
      String(getClasseIdFromExame(exame)) === String(classe.id) &&
      (normalize(exame.nome).includes(q) || normalize(exame.codigo).includes(q))
    )
  })
}

function examesByClasse(classeId) {
  const q = normalize(search.value)
  return props.exames.filter(exame => {
    if (String(getClasseIdFromExame(exame)) !== String(classeId)) return false
    if (!q) return true
    return normalize(exame.nome).includes(q) || normalize(exame.codigo).includes(q) || normalize(exame.descricao).includes(q)
  })
}

function countExamesByTipo(tipoId) {
  return classesByTipo(tipoId).reduce((total, classe) => total + examesByClasse(classe.id).length, 0)
}

function selectExame(exame) {
  emit('update:modelValue', exame)
  emit('select', exame)
}

function buildPayload(tipo, classe, exame) {
  return {
    tipo, classe, exame,
    tipo_id: tipo.id,
    classe_id: classe.id,
    exame_id: exame.id,
    tipo_label: tipo.nome,
    classe_label: classe.nome,
    exame_label: exame.codigo ? `${exame.codigo} - ${exame.nome}` : exame.nome
  }
}
</script>

<style scoped>
.exame-collapse { width: 100%; }
.classe-expansion { border-left: 2px solid rgba(25, 118, 210, .16); }
</style>
