<template>
  <q-page class="q-pa-sm">
    <div class="row items-center q-mb-md">
      <div class="col">
        <div class="text-h6">{{ tdc('Preparation stations') }}</div>
        <div class="text-caption text-grey-7">{{ tdc('Each station prepares the items of its categories: they appear on its screen.') }}</div>
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div v-for="s in rows" :key="s.id" class="col-12 col-sm-6 col-md-4">
        <s-card flat bordered class="q-pa-md station-card" data-test="station-card">
          <div class="row items-center no-wrap q-mb-sm">
            <q-icon name="outdoor_grill" size="22px" color="primary" class="q-mr-sm" />
            <s-input v-model="s.name" dense class="col" :label="tdc('Name')" :disable="!canChange" />
            <s-toggle v-model="s.active" :label="tdc('Active')" :disable="!canChange" class="q-ml-sm" />
          </div>
          <s-select
            v-model="s.category_ids"
            :options="categoryOptions"
            multiple emit-value map-options use-chips
            :label="tdc('Categories prepared here')"
            :disable="!canChange"
            data-test="station-categories"
          />
          <div class="row justify-end q-mt-sm">
            <s-btn v-if="canChange" unelevated rounded color="primary" icon="save" :label="tdc('Save')"
                   :loading="saving === s.id" data-test="station-save" @click="save(s)">
              <s-tooltip>{{ tdc('Save this station') }}</s-tooltip>
            </s-btn>
          </div>
        </s-card>
      </div>

      <!-- a new station -->
      <div v-if="canAdd" class="col-12 col-sm-6 col-md-4">
        <s-card flat bordered class="q-pa-md station-card station-card--new">
          <s-input v-model="newName" dense :label="tdc('New station')" :hint="tdc('For example: Kitchen, Bar, Grill')"
                   data-test="station-new-name" @keyup.enter="add" />
          <div class="row justify-end q-mt-sm">
            <s-btn unelevated rounded color="primary" icon="add" :label="tdc('Add')" :disable="!newName.trim()"
                   :loading="saving === 'new'" data-test="station-add" @click="add">
              <s-tooltip>{{ tdc('Add this station') }}</s-tooltip>
            </s-btn>
          </div>
        </s-card>
      </div>
    </div>

    <div v-if="error" class="text-negative q-mt-md">{{ error }}</div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { tdc, url, HTTPAuth, errorMessage, useUserStore } from 'quasar_resaas'
import { usePrepStationStore } from './prepStationStore'

// The branch's preparation stations and the catalogue categories each one
// prepares (an item of no station's category is served without a ticket).
const Station = usePrepStationStore()
const User = useUserStore()
const canChange = computed(() => User.can('change_prepstation'))
const canAdd = computed(() => User.can('add_prepstation'))

const rows = ref([])
const categoryOptions = ref([])
const newName = ref('')
const saving = ref(null)
const error = ref('')

async function load () {
  const { data } = await HTTPAuth.get(url({ type: 'u', url: 'hospitality/prepstations/', params: { page_size: 50 } }))
  rows.value = (data.results ?? data ?? []).map(s => ({
    id: s.id, name: s.name, active: s.active, order: s.order, category_ids: [...(s.category_ids || [])],
  }))
}

async function loadCategories () {
  const { data } = await HTTPAuth.get(url({ type: 'u', url: 'catalog/productcategorys', params: { ativo: true, page_size: 100 } }))
  categoryOptions.value = (data.results ?? data ?? []).map(c => ({ label: c.nome, value: c.id }))
}

async function save (station) {
  error.value = ''
  saving.value = station.id
  try {
    Station.form = { id: station.id, name: station.name, active: station.active, category_ids: station.category_ids }
    await Station.update()
  } catch (e) {
    error.value = errorMessage(e) || tdc('An error occurred. Please try again.')
  } finally {
    saving.value = null
  }
}

async function add () {
  if (!newName.value.trim()) return
  error.value = ''
  saving.value = 'new'
  try {
    Station.form = { name: newName.value.trim(), active: true, category_ids: [] }
    await Station.create()
    newName.value = ''
    await load()
  } catch (e) {
    error.value = errorMessage(e) || tdc('An error occurred. Please try again.')
  } finally {
    saving.value = null
  }
}

onMounted(async () => {
  try {
    await Promise.all([load(), loadCategories()])
  } catch (e) {
    error.value = errorMessage(e) || tdc('An error occurred. Please try again.')
  }
})
</script>

<style scoped>
.station-card { border-radius: 16px; height: 100%; }
.station-card--new { border-style: dashed; }
</style>
