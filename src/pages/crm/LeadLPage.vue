<template>
  <q-page class="q-pa-sm">
    <s-auto-crud
      :key="reloadKey"
      app="crm" model="Lead"
      :ignoreFields="['created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at']"
      :ignoreFieldsFilter="['id', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at']"
      @runaction="onAction"
    />

    <!-- CONVERT -->
    <q-dialog v-model="showConvert" persistent>
      <s-modal-card :title="tdc('Convert')" icon="trending_up" width="440px" form @close="showConvert = false" @submit="convert">
        <div class="column q-gutter-sm">
          <s-input v-model="convertForm.title" :label="tdc('Title')" />
          <s-input v-model.number="convertForm.amount" type="number" step="0.01" min="0" :label="tdc('Amount')" />
          <s-select
            v-model="convertForm.stage" :options="openStages" emit-value map-options clearable
            :label="tdc('Stage')"
          />
          <s-select
            v-if="User.can('list_customer')"
            v-model="convertForm.customer_id" :api="customerSelectUrl"
            option-label="label" option-value="value" emit-value map-options clearable
            :label="tdc('Customer') + ' (' + tdc('optional') + ')'"
          />
          <s-date v-model="convertForm.expected_close_date" :label="tdc('Expected close date')" />
        </div>
        <template #footer>
          <s-btn flat :label="tdc('Cancel')" @click="showConvert = false" />
          <s-btn color="primary" type="submit" :label="tdc('Convert')" :loading="busy" data-test="lead-convert" />
        </template>
      </s-modal-card>
    </q-dialog>

    <!-- DISQUALIFY -->
    <q-dialog v-model="showDisqualify" persistent>
      <s-modal-card :title="tdc('Disqualify')" icon="block" width="420px" form @close="showDisqualify = false" @submit="disqualify">
        <s-input v-model="reason" type="textarea" autogrow :label="tdc('Reason')" :rules="[v => !!(v && v.trim()) || tdc('A reason is required.')]" />
        <template #footer>
          <s-btn flat :label="tdc('Cancel')" @click="showDisqualify = false" />
          <s-btn color="negative" type="submit" :label="tdc('Disqualify')" :loading="busy" />
        </template>
      </s-modal-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { tdc, url, useUserStore } from 'quasar_resaas'
import { useLeadStore, useStageStore } from './crmStore'

const User = useUserStore()
const Lead = useLeadStore()
const Stage = useStageStore()
const router = useRouter()

const reloadKey = ref(0)
const busy = ref(false)
const current = ref(null)

const customerSelectUrl = url({ type: 'u', url: 'sales/customers', params: { select: 'true' } })
const openStages = computed(() =>
  Stage.rows.filter(s => !s.is_won && !s.is_lost && s.active !== false).map(s => ({ label: s.name, value: s.id }))
)

// actions without autorequest need input: the page asks for it
function onAction(action, row) {
  current.value = row
  if (action.action === 'convert') openConvert(row)
  else if (action.action === 'disqualify') {
    reason.value = ''
    showDisqualify.value = true
  } else {
    reloadKey.value++
  }
}

const showConvert = ref(false)
const convertForm = reactive({ title: '', amount: 0, stage: null, customer_id: null, expected_close_date: null })

async function openConvert(row) {
  Object.assign(convertForm, { title: row.display_name || row.name, amount: 0, stage: null, customer_id: null, expected_close_date: null })
  await Stage.loadData({ page_size: 100 })
  showConvert.value = true
}

async function convert() {
  busy.value = true
  try {
    const opportunity = await Lead.convert(current.value.id, { ...convertForm })
    showConvert.value = false
    router.push({ name: 'view_opportunity', params: { id: opportunity.id } })
  } catch {
    // shown by the alert funnel
  } finally {
    busy.value = false
  }
}

const showDisqualify = ref(false)
const reason = ref('')

async function disqualify() {
  busy.value = true
  try {
    await Lead.disqualify(current.value.id, reason.value)
    showDisqualify.value = false
    reloadKey.value++
  } catch {
    // shown by the alert funnel
  } finally {
    busy.value = false
  }
}
</script>
