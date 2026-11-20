<template>
  <!-- the rows a record's GET action answers (e.g. enrolments/{id}/history/),
       shown read-only with the columns the page names -->
  <q-table
    flat bordered dense
    :rows="rows" :columns="tableColumns" row-key="id" :loading="loading"
    :no-data-label="tdc('No records.')" :rows-per-page-options="[10, 25, 50, 0]"
  />
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { tdc, HTTPAuth, url } from 'quasar_resaas'

const props = defineProps({
  // the record's endpoint (e.g. academica/enrolments/), its id and the action
  endpoint: { type: String, required: true },
  id: { type: [String, Number], required: true },
  action: { type: String, required: true },
  // [{name, label}] - the value shown is the field's label when it is a relation
  columns: { type: Array, required: true }
})

const rows = ref([])
const loading = ref(false)

const shown = (value) => (value && typeof value === 'object') ? (value.label ?? value.value ?? '') : (value ?? '')
const tableColumns = computed(() => props.columns.map(c => ({
  name: c.name, label: tdc(c.label), field: c.name, align: 'left', sortable: true,
  format: (value) => c.date ? String(shown(value)).replace('T', ' ').slice(0, 16) : shown(value)
})))

async function load () {
  loading.value = true
  try {
    const { data } = await HTTPAuth.get(url({ type: 'u', url: `${props.endpoint}${props.id}/${props.action}/` }))
    rows.value = Array.isArray(data) ? data : (data?.results || [])
  } catch {
    rows.value = []
  } finally {
    loading.value = false
  }
}

watch(() => [props.id, props.action], load)
onMounted(load)
</script>
