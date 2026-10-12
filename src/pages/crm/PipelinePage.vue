<template>
  <q-page class="q-pa-sm">
    <div class="text-h6 q-mb-sm row items-center q-gutter-sm">
      <q-icon name="view_kanban" />
      <span>{{ tdc('Pipeline') }}</span>
      <q-space />
      <s-toggle v-model="mine" :label="tdc('Only mine')" @update:model-value="load" />
      <div v-if="summary" class="text-subtitle2">
        {{ tdc('Total') }}: {{ money(summary.total_amount) }} · {{ tdc('Weighted') }}: {{ money(summary.total_weighted_amount) }}
      </div>
    </div>

    <div v-if="summary && !summary.stages.length" class="column items-center q-pa-xl q-gutter-sm">
      <div class="text-grey-7">{{ tdc('The pipeline has no stages yet.') }}</div>
      <s-btn
        v-if="User.can('create_defaults_stage')"
        color="primary" icon="playlist_add" :label="tdc('Create default stages')" data-test="pipeline-defaults"
        @click="createDefaults"
      />
    </div>

    <div class="pipeline row no-wrap q-gutter-sm" data-test="pipeline-board">
      <div v-for="column in columns" :key="column.stage" class="pipeline__column">
        <s-card flat bordered class="full-height">
          <q-card-section class="q-pb-xs">
            <div class="text-subtitle1 text-weight-medium">{{ column.name }}</div>
            <div class="text-caption text-grey-7">
              {{ column.count }} · {{ money(column.amount) }} · {{ column.probability }}%
            </div>
          </q-card-section>
          <q-card-section class="q-pt-xs column q-gutter-xs">
            <s-card
              v-for="opportunity in byStage[column.stage] || []" :key="opportunity.id"
              flat bordered class="cursor-pointer"
              @click="router.push({ name: 'view_opportunity', params: { id: opportunity.id } })"
            >
              <q-card-section class="q-pa-sm">
                <div class="text-body2 text-weight-medium ellipsis">{{ opportunity.title }}</div>
                <div class="row items-center text-caption text-grey-7">
                  <span>{{ money(opportunity.amount) }}</span>
                  <q-space />
                  <s-btn
                    v-if="User.can('move_opportunity')"
                    flat dense round size="sm" icon="swap_horiz" @click.stop
                  >
                    <q-menu>
                      <q-list dense>
                        <q-item
                          v-for="stage in Stage.rows.filter(s => s.id !== opportunity.stage?.value && s.active !== false)"
                          :key="stage.id" clickable v-close-popup
                          @click="move(opportunity, stage)"
                        >
                          <q-item-section>{{ stage.name }}</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </s-btn>
                </div>
              </q-card-section>
            </s-card>
          </q-card-section>
        </s-card>
      </div>
    </div>

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
</template>

<script setup>
import { computed, reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { tdc, url, HTTPAuth, useUserStore } from 'quasar_resaas'
import { useOpportunityStore, useStageStore } from './crmStore'

const router = useRouter()
const User = useUserStore()
const Opportunity = useOpportunityStore()
const Stage = useStageStore()

const mine = ref(false)
const summary = computed(() => Opportunity.pipeline)
const columns = computed(() => summary.value?.stages || [])
const byStage = computed(() => {
  const groups = {}
  for (const row of Opportunity.rows) {
    const stage = row.stage?.value ?? row.stage
    ;(groups[stage] ||= []).push(row)
  }
  return groups
})

const money = (value) => Number(value || 0).toFixed(2)

async function load() {
  const params = mine.value ? { mine: 'true' } : {}
  await Promise.all([
    Opportunity.loadPipeline(params),
    Opportunity.loadData({ status: 'open', page_size: 500, ...(mine.value ? { owner: User.id } : {}) }),
    Stage.loadData({ page_size: 100 }),
  ])
}

async function createDefaults() {
  try {
    await HTTPAuth.post(url({ type: 'u', url: 'crm/stages/create_defaults/' }))
  } finally {
    await load()
  }
}

const lost = reactive({ show: false, reason: '', opportunity: null, stage: null })

async function move(opportunity, stage) {
  if (stage.is_lost) {
    Object.assign(lost, { show: true, reason: '', opportunity, stage })
    return
  }
  try {
    await Opportunity.move(opportunity.id, stage.id)
  } finally {
    await load()
  }
}

async function confirmLost() {
  try {
    await Opportunity.move(lost.opportunity.id, lost.stage.id, lost.reason)
    lost.show = false
  } finally {
    await load()
  }
}

onMounted(load)
</script>

<style scoped>
.pipeline {
  overflow-x: auto;
  padding-bottom: 8px;
}
.pipeline__column {
  min-width: 240px;
  flex: 1 0 240px;
}
</style>
