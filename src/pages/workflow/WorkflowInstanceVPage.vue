<template>
  <q-page class="q-pa-sm" v-if="instance">
    <div class="text-h6 q-mb-sm row items-center q-gutter-sm">
      <q-icon name="fact_check" />
      <span data-test="wf-title">{{ instance.object_label || instance.object_id }}</span>
      <q-badge :color="statusColor" data-test="wf-status">{{ instance.status?.label || status }}</q-badge>
      <q-space />
      <template v-if="instance.can_decide">
        <s-btn color="positive" icon="check" :label="tdc('Approve')" :loading="busy" data-test="wf-approve" @click="approve" />
        <s-btn color="negative" outline icon="close" :label="tdc('Reject')" :loading="busy" data-test="wf-reject" @click="showReject = true" />
      </template>
      <s-btn
        v-if="status === 'pending' && User.can('cancel_workflowinstance')"
        flat icon="cancel" :label="tdc('Cancel')" :loading="busy" @click="cancel"
      />
    </div>

    <div class="row q-col-gutter-sm q-mb-sm">
      <div class="col-12 col-sm-4">
        <s-card flat bordered><q-card-section>
          <div class="text-caption text-grey-7">{{ tdc('Workflow') }}</div>
          <div class="text-subtitle1">{{ instance.definition?.label }}</div>
        </q-card-section></s-card>
      </div>
      <div class="col-12 col-sm-4">
        <s-card flat bordered><q-card-section>
          <div class="text-caption text-grey-7">{{ tdc('Current step') }}</div>
          <div class="text-subtitle1">{{ instance.current_step?.label || '—' }}</div>
        </q-card-section></s-card>
      </div>
      <div class="col-12 col-sm-4">
        <s-card flat bordered><q-card-section>
          <div class="text-caption text-grey-7">{{ tdc('Started by') }}</div>
          <div class="text-subtitle1">{{ instance.started_by?.label || '—' }}</div>
        </q-card-section></s-card>
      </div>
    </div>

    <s-card flat bordered>
      <q-card-section>
        <div class="text-subtitle1 text-weight-medium q-mb-sm">{{ tdc('Decisions') }}</div>
        <div v-if="!instance.decisions?.length" class="text-caption text-grey-7">{{ tdc('No data') }}</div>
        <q-timeline v-else dense data-test="wf-decisions">
          <q-timeline-entry
            v-for="d in instance.decisions" :key="d.id"
            :color="(d.decision?.value ?? d.decision) === 'approve' ? 'positive' : 'negative'"
            :icon="(d.decision?.value ?? d.decision) === 'approve' ? 'check' : 'close'"
            :title="`${d.step?.label} · ${d.decision?.label || d.decision}`"
            :subtitle="`${d.decided_by?.label || ''} · ${new Date(d.created_at).toLocaleString()}`"
          >
            <div v-if="d.comment">{{ d.comment }}</div>
          </q-timeline-entry>
        </q-timeline>
      </q-card-section>
    </s-card>

    <q-dialog v-model="showReject" persistent>
      <s-modal-card :title="tdc('Reject')" icon="close" width="420px" form @close="showReject = false" @submit="reject">
        <s-input v-model="comment" type="textarea" autogrow :label="tdc('Reason')" :rules="[v => !!(v && v.trim()) || tdc('A reason is required.')]" />
        <template #footer>
          <s-btn flat :label="tdc('Cancel')" @click="showReject = false" />
          <s-btn color="negative" type="submit" :label="tdc('Reject')" :loading="busy" />
        </template>
      </s-modal-card>
    </q-dialog>
  </q-page>

  <q-page v-else class="flex flex-center">
    <q-spinner color="primary" size="48px" />
  </q-page>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { tdc, useUserStore } from 'quasar_resaas'
import { useWorkflowInstanceStore } from './workflowStore'

const route = useRoute()
const User = useUserStore()
const Instance = useWorkflowInstanceStore()

const id = computed(() => route.params.id)
const instance = computed(() => (Instance.row?.id === id.value ? Instance.row : null))
const status = computed(() => instance.value?.status?.value ?? instance.value?.status)
const statusColor = computed(() => ({ pending: 'warning', approved: 'positive', rejected: 'negative', cancelled: 'grey' }[status.value] || 'grey'))

const busy = ref(false)
const showReject = ref(false)
const comment = ref('')

async function run(action) {
  busy.value = true
  try {
    await action()
  } catch {
    // shown by the alert funnel
  } finally {
    await Instance.getById(id.value)
    busy.value = false
  }
}

const approve = () => run(() => Instance.decide(id.value, 'approve'))
const cancel = () => run(() => Instance.cancel(id.value))

async function reject() {
  await run(async () => {
    await Instance.decide(id.value, 'reject', comment.value)
    showReject.value = false
    comment.value = ''
  })
}

onMounted(() => Instance.getById(id.value))
</script>
