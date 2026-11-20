<template>
  <!-- add_customer / change_customer/:id: a manual form over the Customer
       store (BaseStore). The type decides what shows: an individual is a
       Person (pick or create one), a company has its name. The backend
       validates both rules again (sales/serializers/customer.py). -->
  <q-page class="q-pa-sm" data-test="customer-form">
    <div class="row items-center q-mb-sm">
      <q-icon :name="isEdit ? 'manage_accounts' : 'person_add'" size="24px" class="q-mr-sm" />
      <div class="text-h6" data-test="customer-form-title">{{ tdc(isEdit ? 'Edit customer' : 'New customer') }}</div>
    </div>

    <div v-if="Customer.loading && !ready" class="flex flex-center q-pa-lg">
      <q-spinner :color="$q.dark.isActive ? 'white' : 'primary'" size="48px" />
    </div>

    <s-card v-else flat bordered class="q-pa-md">
      <div class="row q-col-gutter-md">
        <!-- who the customer is -->
        <div class="col-12">
          <div class="text-subtitle2 text-grey-7 q-mb-xs">{{ tdc('Customer type') }}</div>
          <q-btn-toggle
            :model-value="type"
            :options="typeOptions"
            no-caps unelevated toggle-color="primary" color="grey-3" text-color="grey-9"
            data-test="customer-type"
            @update:model-value="setType"
          />
          <div v-if="Customer.errors.customer_type" class="text-negative text-caption q-mt-xs">{{ Customer.errors.customer_type }}</div>
        </div>

        <div v-if="type === 'individual'" class="col-12 col-md-8" data-test="customer-person">
          <s-field
            v-model="Customer.form.person"
            :field="fieldOf('person')"
            :label="tdc('Person')"
            :hint="tdc('Pick the person, or create them here')"
            :error="!!Customer.errors.person"
            :error-message="Customer.errors.person"
          />
        </div>

        <div v-if="type === 'company'" class="col-12 col-md-8" data-test="customer-company">
          <s-input
            v-model="Customer.form.company_name"
            :label="tdc('Company name')"
            :error="!!Customer.errors.company_name"
            :error-message="Customer.errors.company_name"
            maxlength="255"
          />
        </div>

        <div class="col-12 col-md-4">
          <s-input
            v-model="Customer.form.tax_id"
            :label="tdc('Tax ID (NUIT)')"
            :error="!!Customer.errors.tax_id"
            :error-message="Customer.errors.tax_id"
            data-test="customer-tax-id"
          />
        </div>

        <!-- the commercial terms -->
        <div class="col-12 col-sm-6 col-md-4">
          <s-input
            v-model.number="Customer.form.payment_terms"
            type="number" min="0"
            :label="tdc('Payment terms (days)')"
            :error="!!Customer.errors.payment_terms"
            :error-message="Customer.errors.payment_terms"
          />
        </div>
        <div class="col-12 col-sm-6 col-md-4">
          <s-input
            v-model="Customer.form.credit_limit"
            type="number" min="0" step="0.01"
            :label="tdc('Credit limit')"
            :error="!!Customer.errors.credit_limit"
            :error-message="Customer.errors.credit_limit"
          />
        </div>
        <div class="col-12 col-md-4">
          <s-select
            v-model="Customer.form.price_list_id"
            :api="priceListUrl"
            option-label="label" option-value="value"
            emit-value map-options clearable
            :label="tdc('Price list')"
            :hint="tdc('Their prices at the point of sale')"
            :error="!!Customer.errors.price_list_id"
            :error-message="Customer.errors.price_list_id"
            data-test="customer-price-list"
          />
        </div>

        <div class="col-12">
          <s-toggle v-model="Customer.form.ativo" :label="tdc('Active')" data-test="customer-active" />
        </div>
      </div>

      <div v-if="generalError" class="text-negative q-mt-sm" data-test="customer-error">{{ generalError }}</div>

      <div class="row justify-end q-gutter-sm q-mt-md">
        <s-btn flat :label="tdc('Cancel')" data-test="customer-cancel" @click="back">
          <s-tooltip>{{ tdc('Leave without saving') }}</s-tooltip>
        </s-btn>
        <s-btn unelevated color="primary" icon="save" :label="tdc('Save')" :loading="saving" :disable="!canSave"
               data-test="customer-save" @click="save">
          <s-tooltip>{{ tdc('Save the customer') }}</s-tooltip>
        </s-btn>
      </div>
    </s-card>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { tdc, url, useUserStore } from 'quasar_resaas'
import { useCustomerStore } from './customerStore'

const route = useRoute()
const router = useRouter()
const Customer = useCustomerStore()
const User = useUserStore()

const ready = ref(false)
const saving = ref(false)
const generalError = ref('')

const isEdit = computed(() => Boolean(route.params.id))
const canSave = computed(() => User.can(isEdit.value ? 'change_customer' : 'add_customer'))
const priceListUrl = url({ type: 'u', url: 'catalog/pricelists', params: { select: 'true' } })

const typeOptions = computed(() => [
  { label: tdc('Individual'), value: 'individual', icon: 'person' },
  { label: tdc('Company'), value: 'company', icon: 'business' },
])

// the READ shape of a choice is {value, label}: the toggle works on the value
const type = computed(() => {
  const value = Customer.form?.customer_type
  return (value && typeof value === 'object') ? value.value : value
})

function fieldOf (name) {
  return (Customer.fields || []).find(f => f.name === name) || { name, type: 'ForeignKey', label: name }
}

// the field the other type has no use for is cleared (the backend refuses both)
function setType (value) {
  Customer.form.customer_type = value
  if (value === 'individual') Customer.form.company_name = null
  if (value === 'company') Customer.form.person = null
  Customer.errors = {}
}

async function load () {
  ready.value = false
  await Customer.init()
  if (route.params.id) {
    Customer.row = await Customer.getById(route.params.id)
    Customer.form = { ...Customer.row }
  } else {
    Customer.resetForm()
    Customer.form = { ...Customer.form, customer_type: 'individual', ativo: true, payment_terms: Customer.form.payment_terms ?? 0 }
  }
  ready.value = true
}

function back () {
  if (window.history.length > 1) router.back()
  else router.push({ name: 'list_customer' })
}

async function save () {
  if (!canSave.value) return
  saving.value = true
  generalError.value = ''
  try {
    const data = await Customer.save()
    const id = data?.id || route.params.id
    if (id && router.hasRoute('view_customer') && User.can('view_customer')) router.push({ name: 'view_customer', params: { id } })
    else router.push({ name: 'list_customer' })
  } catch (error) {
    // field errors show at their fields (Customer.errors); anything else here
    const failure = error?.response?.data?.error
    if (!Object.keys(Customer.errors || {}).length) generalError.value = failure?.message || tdc('Could not save.')
  } finally {
    saving.value = false
  }
}

onMounted(load)
watch(() => route.params.id, (now, before) => { if (now !== before) load() })
</script>
