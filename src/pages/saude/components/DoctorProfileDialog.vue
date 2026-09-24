<template>
  <q-dialog v-model="open" @show="load">
    <s-modal-card
      :title="fullName || fallbackName || tdc('Doctor')"
      icon="medical_services"
      width="900px"
    >
      <div v-if="loading" class="flex flex-center q-pa-xl">
        <q-spinner :color="$q.dark.isActive ? 'white' : 'primary'" size="48px" />
      </div>

      <div v-else-if="error || !staff" class="text-center q-pa-xl">
        <q-icon name="error_outline" size="40px" color="negative" />
        <div class="q-mt-sm q-mb-md">{{ tdc('Could not load the doctor information.') }}</div>
        <s-btn flat color="primary" icon="refresh" :label="tdc('Try again')" @click="load" />
      </div>

      <template v-else>
        <!-- ============ PROFESSIONAL DATA ============ -->
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-8">
            <s-card flat bordered class="full-height">
              <q-card-section class="section-title row items-center no-wrap">
                <q-icon name="badge" size="20px" class="q-mr-xs" />
                {{ tdc('Professional data') }}
                <q-space />
                <q-badge :color="isActive ? 'positive' : 'grey'" :label="isActive ? tdc('Active') : tdc('Inactive')" />
              </q-card-section>
              <q-separator />

              <q-card-section>
                <div class="row q-col-gutter-md">
                  <div v-for="fact in facts" :key="fact.label" class="col-12 col-sm-6">
                    <div class="fact-label">
                      <q-icon :name="fact.icon" size="16px" /> {{ fact.label }}
                    </div>
                    <div :class="{ 'text-grey-6': !fact.value }">{{ fact.value || '—' }}</div>
                  </div>
                </div>

                <div v-if="specialties.length" class="q-mt-md">
                  <div class="fact-label"><q-icon name="workspace_premium" size="16px" /> {{ tdc('Specialties') }}</div>
                  <div class="row q-gutter-xs q-mt-xs">
                    <q-chip v-for="s in specialties" :key="s.id" dense square color="primary" text-color="white">
                      {{ s.label }}
                    </q-chip>
                  </div>
                </div>

                <div v-if="medico?.observacao" class="q-mt-md">
                  <div class="fact-label"><q-icon name="notes" size="16px" /> {{ tdc('Notes') }}</div>
                  <div class="pre-line">{{ medico.observacao }}</div>
                </div>
              </q-card-section>
            </s-card>
          </div>

          <!-- ============ SIGNATURE + STAMP ============ -->
          <div class="col-12 col-md-4">
            <s-card flat bordered class="full-height">
              <q-card-section class="section-title">
                <q-icon name="draw" size="20px" class="q-mr-xs" /> {{ tdc('Signature and stamp') }}
              </q-card-section>
              <q-separator />
              <q-card-section class="column q-gutter-y-md">
                <div v-for="img in credentials" :key="img.label">
                  <div class="fact-label q-mb-xs">{{ img.label }}</div>
                  <div class="credential-box flex flex-center">
                    <img v-if="img.url" :src="img.url" :alt="img.label">
                    <span v-else class="text-grey-6">—</span>
                  </div>
                </div>
              </q-card-section>
            </s-card>
          </div>
        </div>
      </template>

      <template #footer>
        <s-btn flat :label="tdc('Close')" v-close-popup />
        <s-btn
          v-if="medico?.id"
          color="primary"
          icon="open_in_new"
          :label="tdc('Open doctor record')"
          :to="{ name: 'view_medico', params: { id: medico.id } }"
          v-close-popup
        />
      </template>
    </s-modal-card>
  </q-dialog>
</template>

<script setup>
import { computed, ref } from 'vue'
import { tdc, ds, useEmployeeStore } from 'quasar_resaas'
import { useMedicoStore } from '../medico/medicoStore'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  // the record's `employee` (an id, or the {id, ...} relation object)
  employee: { type: [Object, String, Number], default: null },
  fallbackName: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])

const open = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const Employee = useEmployeeStore()
const Medico = useMedicoStore()

const staff = ref(null)
const medico = ref(null)
const loading = ref(false)
const error = ref(false)

const employeeId = computed(() => (props.employee && typeof props.employee === 'object' ? props.employee.id : props.employee))

// fetchPage only reads: it leaves Employee.row/rows and Medico.row/rows to the page that owns them.
async function load() {
  if (!employeeId.value) {
    error.value = true
    return
  }

  loading.value = true
  error.value = false

  try {
    const [emp, doc] = await Promise.all([
      Employee.fetchPage({ id: employeeId.value, page_size: 1 }),
      Medico.fetchPage({ employee: employeeId.value, page_size: 1 })
    ])

    staff.value = emp.rows[0] || null
    medico.value = doc.rows[0] || null
    error.value = !staff.value
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

const label = (value) => (value && typeof value === 'object' ? value.label : value)

const fullName = computed(() => staff.value?.person_data?.full_name || '')
const isActive = computed(() => medico.value ? medico.value.ativo !== false : true)
const specialties = computed(() => medico.value?.especialidade || [])

const facts = computed(() => [
  { icon: 'confirmation_number', label: tdc('Order number'), value: medico.value?.numero_ordem },
  { icon: 'category', label: tdc('Category'), value: medico.value?.categoria },
  { icon: 'work_outline', label: tdc('Position'), value: staff.value?.position_data?.title },
  { icon: 'fingerprint', label: tdc('Employee code'), value: staff.value?.code },
  { icon: 'verified_user', label: tdc('Employment status'), value: label(staff.value?.employment_status) },
  { icon: 'event', label: tdc('Hire date'), value: staff.value?.hire_date ? ds(staff.value.hire_date) : '' },
  { icon: 'mail_outline', label: tdc('Work email'), value: staff.value?.work_email },
  { icon: 'call', label: tdc('Work phone'), value: staff.value?.work_phone }
])

const credentials = computed(() => [
  { label: tdc('Signature'), url: medico.value?.assinatura?.url },
  { label: tdc('Stamp'), url: medico.value?.carimbo?.url }
])
</script>

<style scoped>
.section-title {
  font-weight: 600;
}

.fact-label {
  font-size: 12px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  opacity: 0.7;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 2px;
}

.credential-box {
  height: 96px;
  border: 1px dashed rgba(128, 128, 128, 0.5);
  border-radius: 6px;
  padding: 6px;
}

.credential-box img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.pre-line {
  white-space: pre-line;
}
</style>
