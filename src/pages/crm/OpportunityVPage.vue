<template>
  <q-page class="q-pa-sm" v-if="opportunity">
    <div class="text-h6 q-mb-sm row items-center q-gutter-sm">
      <q-icon name="trending_up" />
      <span data-test="opp-title">{{ opportunity.title }}</span>
      <q-badge :color="statusColor">{{ opportunity.status?.label || status }}</q-badge>
      <q-space />
      <s-select
        v-if="User.can('move_opportunity')"
        :model-value="opportunity.stage?.value ?? opportunity.stage" :options="stageOptions"
        emit-value map-options dense style="min-width: 200px" :label="tdc('Stage')"
        data-test="opp-stage"
        @update:model-value="onStage"
      />
    </div>

    <div class="row q-col-gutter-sm q-mb-sm">
      <div class="col-6 col-sm-3" v-for="card in cards" :key="card.label">
        <s-card flat bordered><q-card-section>
          <div class="text-caption text-grey-7">{{ card.label }}</div>
          <div class="text-subtitle1">{{ card.value || '—' }}</div>
        </q-card-section></s-card>
      </div>
    </div>

    <q-banner v-if="status === 'lost'" dense class="bg-negative text-white q-mb-sm">
      {{ tdc('Lost') }}: {{ opportunity.lost_reason }}
    </q-banner>

    <s-card flat bordered>
      <q-card-section>
        <div class="text-subtitle1 text-weight-medium q-mb-sm">{{ tdc('Activities') }}</div>
        <div v-if="!Activity.rows.length" class="text-caption text-grey-7">{{ tdc('No data') }}</div>
        <q-list v-else dense separator data-test="opp-activities">
          <q-item v-for="activity in Activity.rows" :key="activity.id">
            <q-item-section avatar><q-icon :name="activityIcon(activity)" /></q-item-section>
            <q-item-section>
              <q-item-label :class="{ 'text-strike': activity.done }">{{ activity.subject }}</q-item-label>
              <q-item-label caption>{{ activity.due_at ? new Date(activity.due_at).toLocaleString() : '' }} {{ activity.notes || '' }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <s-btn
                v-if="!activity.done && User.can('complete_activity')"
                flat dense icon="check" :label="tdc('Mark as done')" @click="complete(activity)"
              />
              <q-icon v-else-if="activity.done" name="check_circle" color="positive" />
            </q-item-section>
          </q-item>
        </q-list>

        <div v-if="User.can('add_activity')" class="row q-col-gutter-sm items-start q-mt-sm">
          <div class="col-6 col-sm-2">
            <s-select v-model="newActivity.activity_type" :options="activityTypes" emit-value map-options :label="tdc('Type')" />
          </div>
          <div class="col-12 col-sm">
            <s-input v-model="newActivity.subject" :label="tdc('Subject')" />
          </div>
          <div class="col-12 col-sm-3">
            <s-date-time v-model="newActivity.due_at" :label="tdc('Due')" />
          </div>
          <div class="col-12 col-sm-auto">
            <s-btn color="primary" icon="add" :label="tdc('Add')" :disable="!newActivity.subject" data-test="opp-add-activity" @click="addActivity" />
          </div>
        </div>
      </q-card-section>
    </s-card>

    <q-dialog v-model="lost.show" persistent>
      <s-modal-card :title="tdc('Lost')" icon="thumb_down" width="420px" form @close="lost.show = false" @submit="confirmLost">
        <s-input v-model="lost.reason" type="textarea" autogrow :label="tdc('Reason')" :rules="[v => !!(v && v.trim()) || tdc('A reason is required.')]" />
        <template #footer>
          <s-btn flat :label="tdc('Cancel')" @click="lost.show = false" />
          <s-btn color="negative" type="submit" :label="tdc('Lost')" />
        </template>
      </s-modal-card>
    </q-dialog>
  </q-page>

  <q-page v-else class="flex flex-center">
    <q-spinner color="primary" size="48px" />
  </q-page>
</template>

<script setup>
import { computed, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { tdc, useUserStore } from 'quasar_resaas'
import { useActivityStore, useOpportunityStore, useStageStore } from './crmStore'

const route = useRoute()
const User = useUserStore()
const Opportunity = useOpportunityStore()
const Stage = useStageStore()
const Activity = useActivityStore()

const id = computed(() => route.params.id)
const opportunity = computed(() => (Opportunity.row?.id === id.value ? Opportunity.row : null))
const status = computed(() => opportunity.value?.status?.value ?? opportunity.value?.status)
const statusColor = computed(() => ({ open: 'primary', won: 'positive', lost: 'negative' }[status.value] || 'grey'))

const stageOptions = computed(() =>
  Stage.rows.filter(s => s.active !== false).map(s => ({ label: s.name, value: s.id, lost: s.is_lost }))
)

const cards = computed(() => [
  { label: tdc('Amount'), value: Number(opportunity.value.amount || 0).toFixed(2) },
  { label: tdc('Customer'), value: opportunity.value.customer_name },
  { label: tdc('Expected close date'), value: opportunity.value.expected_close_date },
  { label: tdc('Owner'), value: opportunity.value.owner?.label },
])

const activityTypes = [
  { label: tdc('Call'), value: 'call' },
  { label: tdc('Email'), value: 'email' },
  { label: tdc('Meeting'), value: 'meeting' },
  { label: tdc('Task'), value: 'task' },
  { label: tdc('Note'), value: 'note' },
]

function activityIcon(activity) {
  const type = activity.activity_type?.value ?? activity.activity_type
  return { call: 'call', email: 'mail', meeting: 'groups', task: 'task_alt', note: 'sticky_note_2' }[type] || 'event_note'
}

async function refresh() {
  await Promise.all([
    Opportunity.getById(id.value),
    Stage.loadData({ page_size: 100 }),
    Activity.loadData({ opportunity: id.value, page_size: 200 }),
  ])
}

const lost = reactive({ show: false, reason: '', stage: null })

async function onStage(stageId) {
  const stage = stageOptions.value.find(s => s.value === stageId)
  if (stage?.lost) {
    Object.assign(lost, { show: true, reason: '', stage: stageId })
    return
  }
  try {
    await Opportunity.move(id.value, stageId)
  } finally {
    await refresh()
  }
}

async function confirmLost() {
  try {
    await Opportunity.move(id.value, lost.stage, lost.reason)
    lost.show = false
  } finally {
    await refresh()
  }
}

const newActivity = reactive({ activity_type: 'task', subject: '', due_at: null })

async function addActivity() {
  try {
    Activity.form = { ...newActivity, opportunity: id.value }
    await Activity.create()
    Object.assign(newActivity, { activity_type: 'task', subject: '', due_at: null })
  } catch {
    // field messages in Activity.errors
  } finally {
    await refresh()
  }
}

async function complete(activity) {
  try {
    await Activity.complete(activity.id)
  } finally {
    await refresh()
  }
}

onMounted(refresh)
</script>
