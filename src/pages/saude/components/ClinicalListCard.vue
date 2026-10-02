<template>
  <s-card flat bordered :class="highlight && rows.length ? 'border-negative' : ''" :data-test="`clinical-list-${model}`">
    <q-card-section class="row items-center">
      <q-icon :name="icon" :color="color" class="q-mr-xs" />
      <div class="text-subtitle2 text-weight-medium">{{ tdc(title) }}</div>
    </q-card-section>
    <q-separator />

    <q-card-section>
      <div v-if="loading" class="flex flex-center q-pa-sm">
        <q-spinner :color="$q.dark.isActive ? 'white' : 'primary'" size="32px" />
      </div>

      <template v-else>
        <div v-if="!rows.length" class="text-caption text-grey-6 q-mb-sm">{{ tdc(emptyText) }}</div>

        <div v-else class="row q-gutter-xs q-mb-sm">
          <q-chip
            v-for="row in rows" :key="row.id"
            dense outline :color="color"
            :removable="canDelete"
            :clickable="canChange"
            :data-test="`clinical-item-${model}`"
            @remove="remove(row)"
          >
            {{ row.nome }}
            <!-- rename in place: change_<model> (UX); the backend checks it again -->
            <q-popup-edit
              v-if="canChange"
              v-slot="scope" :model-value="row.nome" buttons auto-save
              :label-set="tdc('Save')" :label-cancel="tdc('Cancel')"
              @save="value => rename(row, value)"
            >
              <s-input v-model="scope.value" dense autofocus :label="tdc('Name')" @keyup.enter="scope.set" />
            </q-popup-edit>
          </q-chip>
        </div>

        <div v-if="canAdd" class="row items-center no-wrap q-gutter-x-sm">
          <s-input
            v-model="newName" dense class="col" :label="tdc(addLabel)"
            :data-test="`clinical-new-${model}`"
            @keyup.enter="add"
          />
          <s-btn
            flat round dense :color="color" icon="add" :loading="saving"
            :disable="!newName.trim()" :data-test="`clinical-add-${model}`"
            @click="add"
          >
            <s-tooltip>{{ tdc('Add') }}</s-tooltip>
          </s-btn>
        </div>
      </template>
    </q-card-section>
  </s-card>
</template>

<script setup>
// A patient's current allergies / conditions / medication, managed in place
// (Clinical Summary of the patient record): add, rename and remove without
// leaving the record. The buttons follow add_/change_/delete_<model> (UX
// only); the backend enforces them and validates the patient against the
// tenant (400 "Does not belong to the current entity").
import { ref, computed, watch } from 'vue'
import { tdc, url, HTTPAuth, useUserStore, AlertError } from 'quasar_resaas'

const props = defineProps({
  title: { type: String, required: true },
  addLabel: { type: String, required: true },
  emptyText: { type: String, required: true },
  icon: { type: String, required: true },
  color: { type: String, default: 'primary' },
  model: { type: String, required: true },       // alergiacorrente
  endpoint: { type: String, required: true },    // saude/alergiacorrentes
  pacienteId: { type: String, required: true },
  highlight: { type: Boolean, default: false },  // red border when not empty (allergies)
})

const User = useUserStore()
const canAdd = computed(() => User.can(`add_${props.model}`))
const canChange = computed(() => User.can(`change_${props.model}`))
const canDelete = computed(() => User.can(`delete_${props.model}`))

const rows = ref([])
const loading = ref(true)
const saving = ref(false)
const newName = ref('')

async function load () {
  loading.value = true
  try {
    const { data } = await HTTPAuth.get(url({
      type: 'u', url: props.endpoint, params: { paciente: props.pacienteId, ordering: 'nome', page_size: 100 },
    }))
    rows.value = data.results ?? data
  } catch (e) {
    AlertError(e)
  } finally {
    loading.value = false
  }
}

async function add () {
  const nome = newName.value.trim()
  if (!nome) return
  saving.value = true
  try {
    await HTTPAuth.post(url({ type: 'u', url: `${props.endpoint}/` }), { nome, paciente: props.pacienteId })
    newName.value = ''
    await load()
  } catch (e) {
    AlertError(e)
  } finally {
    saving.value = false
  }
}

async function rename (row, value) {
  const nome = String(value || '').trim()
  if (!nome || nome === row.nome) return
  try {
    await HTTPAuth.patch(url({ type: 'u', url: `${props.endpoint}/${row.id}/` }), { nome })
    await load()
  } catch (e) {
    AlertError(e)
  }
}

async function remove (row) {
  try {
    await HTTPAuth.delete(url({ type: 'u', url: `${props.endpoint}/${row.id}/` }))
    await load()
  } catch (e) {
    AlertError(e)
  }
}

watch(() => props.pacienteId, (id) => { if (id) load() }, { immediate: true })
</script>
