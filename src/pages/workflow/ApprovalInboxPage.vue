<template>
  <q-page class="q-pa-sm">
    <div class="text-h6 q-mb-sm row items-center q-gutter-sm">
      <q-icon name="inbox" />
      <span>{{ tdc('My approvals') }}</span>
      <q-badge v-if="Instance.inbox.length" color="primary">{{ Instance.inbox.length }}</q-badge>
      <q-space />
      <s-btn flat icon="refresh" :loading="loading" @click="load" />
    </div>

    <div v-if="!loading && !Instance.inbox.length" class="text-grey-7 q-pa-lg text-center" data-test="inbox-empty">
      {{ tdc('Nothing waiting for your decision.') }}
    </div>

    <q-list v-else bordered separator data-test="inbox-list">
      <q-item
        v-for="row in Instance.inbox" :key="row.id" clickable
        @click="router.push({ name: 'view_workflowinstance', params: { id: row.id } })"
      >
        <q-item-section avatar><q-icon name="fact_check" color="primary" /></q-item-section>
        <q-item-section>
          <q-item-label>{{ row.object_label || row.object_id }}</q-item-label>
          <q-item-label caption>{{ row.definition?.label }} · {{ row.current_step?.label }}</q-item-label>
        </q-item-section>
        <q-item-section side>{{ new Date(row.created_at).toLocaleDateString() }}</q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { tdc } from 'quasar_resaas'
import { useWorkflowInstanceStore } from './workflowStore'

const router = useRouter()
const Instance = useWorkflowInstanceStore()
const loading = ref(false)

async function load() {
  loading.value = true
  try {
    await Instance.loadInbox()
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
