<template>
  <q-dialog :model-value="modelValue" @update:model-value="v => emit('update:modelValue', v)">
    <s-modal-card :title="tdc('Consultation documents')" icon="folder_open" width="640px" @close="close">
      <div v-if="loading" class="flex flex-center q-pa-lg">
        <q-spinner :color="$q.dark.isActive ? 'white' : 'primary'" size="40px" />
      </div>

      <div v-else-if="!visibleSections.length" class="text-caption text-grey-6 q-pa-md text-center" data-test="no-documents">
        {{ tdc('No document linked to this consultation') }}
      </div>

      <div v-else>
        <div v-for="section in visibleSections" :key="section.key" class="q-mb-md" :data-test="`documents-${section.key}`">
          <div class="text-subtitle2 q-mb-xs">
            <q-icon :name="section.icon" class="q-mr-xs" />
            {{ tdc(section.label) }} ({{ section.rows.length }})
          </div>
          <q-list bordered separator dense>
            <q-item v-for="row in section.rows" :key="row.id">
              <q-item-section>
                <q-item-label>{{ formatDate(row.created_at) }}</q-item-label>
                <q-item-label caption>{{ authorOf(row) }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <s-btn
                  flat round dense color="primary" icon="picture_as_pdf"
                  :loading="opening === row.id"
                  :data-test="`document-pdf-${section.key}`"
                  @click="openPdf(section, row)"
                >
                  <s-tooltip>{{ tdc('PDF') }}</s-tooltip>
                </s-btn>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>

      <div v-if="errorMsg" class="text-negative text-caption q-mt-sm">{{ errorMsg }}</div>
    </s-modal-card>
  </q-dialog>

  <s-pdf-render v-model="showPdf" :src="pdfSrc" :title="pdfTitle" />
</template>

<script setup>
// Everything linked to one consultation (prescriptions, certificates,
// referrals, medical reports, exam requests), each with its PDF. Reads the
// existing list endpoints filtered by ?consulta=<id> (BaseAPIView's automatic
// filters); a section is asked for only with its list permission - the
// backend checks that permission again (UX only here).
import { ref, computed, watch } from 'vue'
import { tdc, url, HTTPAuth, errorMessage, rawValue, useUserStore } from 'quasar_resaas'

import { useReceitamedicaStore } from '../receitamedica/receitamedicaStore'
import { useAtestadomedicoStore } from '../atestadomedico/atestadomedicoStore'
import { useGuiatransferenciaStore } from '../guiatransferencia/guiatransferenciaStore'
import { useRelatoriomedicoStore } from '../relatoriomedico/relatoriomedicoStore'
import { usePedidoexamemedicoStore } from '../pedidoexamemedico/pedidoexamemedicoStore'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  consultaId: { type: String, default: null },
})
const emit = defineEmits(['update:modelValue'])

const User = useUserStore()

const SECTIONS = [
  { key: 'receitamedica', label: 'Prescriptions', icon: 'medication', endpoint: 'saude/receitamedicas/', store: useReceitamedicaStore },
  { key: 'atestadomedico', label: 'Medical certificates', icon: 'description', endpoint: 'saude/atestadomedicos/', store: useAtestadomedicoStore },
  { key: 'guiatransferencia', label: 'Referrals', icon: 'forward_to_inbox', endpoint: 'saude/guiatransferencias/', store: useGuiatransferenciaStore },
  { key: 'relatoriomedico', label: 'Medical reports', icon: 'summarize', endpoint: 'saude/relatoriomedicos/', store: useRelatoriomedicoStore },
  { key: 'pedidoexamemedico', label: 'Exam requests', icon: 'biotech', endpoint: 'saude/pedidoexamemedicos/', store: usePedidoexamemedicoStore },
]

const sections = ref([])
const loading = ref(false)
const errorMsg = ref('')
const opening = ref(null)

const showPdf = ref(false)
const pdfSrc = ref(null)
const pdfTitle = ref('')

const visibleSections = computed(() => sections.value.filter(s => s.rows.length))

const close = () => emit('update:modelValue', false)

function formatDate (value) {
  return value ? new Date(value).toLocaleString() : '—'
}

function authorOf (row) {
  return row.employee?.label || row.medico?.label || row.created_by?.label || ''
}

async function load () {
  errorMsg.value = ''
  sections.value = []
  if (!props.consultaId) return

  loading.value = true
  try {
    const allowed = SECTIONS.filter(s => User.can(`list_${s.key}`))
    const results = await Promise.all(allowed.map(async (section) => {
      try {
        const { data } = await HTTPAuth.get(url({
          type: 'u', url: section.endpoint, params: { consulta: props.consultaId, page_size: 100 },
        }))
        return { ...section, rows: Array.isArray(data) ? data : (data?.results || []) }
      } catch {
        // a section the backend refuses (e.g. 403) is simply left out
        return { ...section, rows: [] }
      }
    }))
    sections.value = results
  } catch (e) {
    errorMsg.value = errorMessage(e)
  } finally {
    loading.value = false
  }
}

async function openPdf (section, row) {
  opening.value = row.id
  try {
    const store = section.store()
    await store.getPdf(rawValue(row.id))
    store.showPdf = false
    pdfSrc.value = store.pdf
    pdfTitle.value = tdc(section.label)
    showPdf.value = true
  } catch (e) {
    errorMsg.value = errorMessage(e)
  } finally {
    opening.value = null
  }
}

watch(() => [props.modelValue, props.consultaId], ([open]) => { if (open) load() }, { immediate: true })
</script>
