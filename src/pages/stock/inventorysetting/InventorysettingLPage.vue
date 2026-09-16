<template>
  <q-page class="q-pa-sm">
    <div class="text-h6 q-mb-md row items-center">
      <q-icon name="settings" class="q-mr-sm" />
      {{ tdc('Inventory Settings') }}
    </div>

    <s-card flat bordered style="max-width: 480px">
      <q-card-section>
        <q-toggle
          v-model="allowNegativeStock"
          :label="tdc('Allow negative stock')"
        />
        <div class="text-caption text-grey-6 q-mt-xs">
          {{ tdc('When disabled (default), outbound movements that would leave stock negative are rejected.') }}
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="primary" :label="tdc('Save')" :loading="saving" @click="save" />
      </q-card-actions>
    </s-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { tdc } from 'quasar_resaas'
import { useInventorysettingStore } from './inventorysettingStore'

const Inventorysetting = useInventorysettingStore()
const allowNegativeStock = ref(false)
const saving = ref(false)

async function load() {
  await Inventorysetting.loadData({ page_size: 1 })
  const current = Inventorysetting.rows?.[0]
  if (current) {
    Inventorysetting.row = current
    allowNegativeStock.value = !!current.allow_negative_stock
  }
}

async function save() {
  saving.value = true
  try {
    Inventorysetting.form = { allow_negative_stock: allowNegativeStock.value }
    await Inventorysetting.create()
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>
