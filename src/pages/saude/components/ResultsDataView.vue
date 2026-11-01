<template>
  <!-- The results page's "Data" view: what was entered for the patient's exams,
       validated or not, by parameter (resultadoexamemedicos/data/,
       list_resultadoexamemedico), newest first. -->
  <div class="results-data q-pa-sm" data-test="results-data">
    <!-- the tab (Results / Evolution) is chosen in the page's toolbar -->
    <!-- Evolution (table) and Chart share one panel: the chosen parameter and
         dates stay when switching between them -->
    <LabEvolutionPanel v-if="evolutionTab && canEvolution" :paciente-id="paciente" :mode="tab === 'chart' ? 'chart' : 'table'" />

    <template v-else>
    <div v-if="loading && !rows.length" class="flex flex-center q-pa-lg">
      <q-spinner :color="$q.dark.isActive ? 'white' : 'primary'" size="40px" />
    </div>

    <div v-else-if="!rows.length" class="text-center text-grey-7 q-pa-xl">
      <q-icon name="table_chart" size="40px" />
      <div class="q-mt-sm">{{ tdc(search ? 'No results match the search.' : 'No results entered yet.') }}</div>
    </div>

    <ResultValuesCard v-for="row in rows" :key="row.id" :row="row" class="q-mb-sm" :data-test="`results-data-${row.id}`" />

    <div v-if="hasMore" class="text-center q-mt-sm">
      <s-btn flat no-caps color="primary" icon="expand_more" :label="tdc('Load more')" :loading="loading" @click="load(page + 1)">
        <s-tooltip>{{ tdc('Load more') }}</s-tooltip>
      </s-btn>
    </div>
    </template>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { tdc, url, HTTPAuth, useUserStore } from 'quasar_resaas'
import LabEvolutionPanel from './LabEvolutionPanel.vue'
import ResultValuesCard from './ResultValuesCard.vue'

const props = defineProps({
  paciente: { type: String, default: null },
  // the toolbar's search: exam name, parameter name or free value
  search: { type: String, default: '' },
  // 'results' | 'evolution' | 'chart' (the page's toolbar tabs)
  tab: { type: String, default: 'results' }
})

const PAGE_SIZE = 20

const User = useUserStore()
// the evolution reads validated results through pacientes/{id}/lab_evolution/
const canEvolution = computed(() => User.can('lab_evolution_paciente'))
const evolutionTab = computed(() => props.tab === 'evolution' || props.tab === 'chart')

const rows = ref([])
const page = ref(1)
const total = ref(0)
const loading = ref(false)

const hasMore = computed(() => rows.value.length < total.value)




async function load (next = 1) {
  if (!props.paciente) return
  loading.value = true
  try {
    const { data } = await HTTPAuth.get(url({
      type: 'u',
      url: 'saude/resultadoexamemedicos/data/',
      params: { paciente: props.paciente, search: props.search || undefined, page: next, page_size: PAGE_SIZE }
    }))
    rows.value = next === 1 ? (data.results || []) : [...rows.value, ...(data.results || [])]
    total.value = data.pagination?.total || 0
    page.value = next
  } finally {
    loading.value = false
  }
}

watch(() => props.paciente, () => load(1), { immediate: true })

// typing: wait a moment before asking the server
let searchTimer = null
watch(() => props.search, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => load(1), 300)
})

defineExpose({ reload: () => load(1) })
</script>
