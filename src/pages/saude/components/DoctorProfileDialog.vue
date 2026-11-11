<template>
  <!-- the doctor of a record (right menu: the doctor's photo) and the public
       site's doctor profile (`public-doctor`): ONE dialog. Its body is what may
       be public (saude/doctorprofile/<employee>/ in the app - any member of the
       clinic, no HR permission; saude/publicbooking/ on the site): photo,
       category, Medical Council number, specialties, bio, languages, branches
       and the patients' ratings. In the app, what needs a permission is added
       only for whoever has it (HR data: view_employee; signature and stamp:
       list_medico) - a missing permission never breaks the dialog. -->
  <q-dialog :persistent="!isPublic" v-model="open" @show="load">
    <s-modal-card
      :title="profile?.name || fallbackName || tdc('Doctor')"
      icon="medical_services"
      width="900px"
    >
      <div v-if="loading" class="flex flex-center q-pa-xl">
        <q-spinner :color="$q.dark.isActive ? 'white' : 'primary'" size="48px" />
      </div>

      <div v-else-if="error || !profile" class="text-center q-pa-xl">
        <q-icon name="error_outline" size="40px" color="negative" />
        <div class="q-mt-sm q-mb-md">{{ tdc('Could not load the doctor information.') }}</div>
        <s-btn flat color="primary" icon="refresh" :label="tdc('Try again')" @click="load">
          <s-tooltip>{{ tdc('Try again') }}</s-tooltip>
        </s-btn>
      </div>

      <div v-else class="column q-gutter-y-md">
        <div class="row q-col-gutter-md">
          <!-- ============ PROFESSIONAL DATA ============ -->
          <div class="col-12 col-md-8">
            <s-card flat bordered class="full-height">
              <q-card-section class="section-title row items-center no-wrap">
                <q-icon name="badge" size="20px" class="q-mr-xs" />
                {{ tdc('Professional data') }}
                <q-space />
                <q-badge v-if="!isPublic" :color="isActive ? 'positive' : 'grey'" :label="isActive ? tdc('Active') : tdc('Inactive')" />
              </q-card-section>
              <q-separator />

              <q-card-section>
                <div v-if="profile.bio" class="q-mb-md pre-line" data-test="doctor-bio">{{ profile.bio }}</div>

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

                <div v-if="!isPublic && medico?.observacao" class="q-mt-md">
                  <div class="fact-label"><q-icon name="notes" size="16px" /> {{ tdc('Notes') }}</div>
                  <div class="pre-line">{{ medico.observacao }}</div>
                </div>
              </q-card-section>
            </s-card>
          </div>

          <div class="col-12 col-md-4 column q-gutter-y-md">
            <!-- ============ PHOTO ============ -->
            <s-card flat bordered>
              <q-card-section class="column items-center q-pa-lg" data-test="doctor-photo">
                <q-avatar size="150px" color="primary" text-color="white">
                  <img v-if="profile.photo" :src="profile.photo" :alt="profile.name">
                  <span v-else class="doctor-initials">{{ initials(profile.name) }}</span>
                </q-avatar>
                <div v-if="rating?.count" class="row items-center q-mt-sm q-gutter-x-xs" data-test="doctor-stars">
                  <q-rating :model-value="rating.average || 0" readonly size="18px" color="amber" icon="star_border" icon-selected="star" icon-half="star_half" />
                  <span class="text-caption">{{ Number(rating.average).toFixed(1) }} ({{ rating.count }})</span>
                </div>
              </q-card-section>
            </s-card>

            <!-- ============ SIGNATURE + STAMP (list_medico only) ============ -->
            <s-card v-if="!isPublic && medico" flat bordered>
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

        <!-- ============ RATINGS ============ -->
        <DoctorRatingCard
          v-model:scope="scope"
          :rating="rating"
          :loading="ratingLoading"
          @moderate="moderate"
        />
      </div>

      <template #footer>
        <s-btn flat :label="tdc('Close')" v-close-popup>
          <s-tooltip>{{ tdc('Close') }}</s-tooltip>
        </s-btn>
        <s-btn
          v-if="isPublic && bookable"
          color="primary" icon="event" no-caps
          :label="tdc('Book appointment')"
          data-test="doctor-profile-book"
          @click="emit('book', publicDoctor)"
        >
          <s-tooltip>{{ tdc('Book a consultation with this doctor') }}</s-tooltip>
        </s-btn>
        <s-btn
          v-if="!isPublic && medicoId && canOpenRecord"
          color="primary"
          icon="open_in_new"
          :label="tdc('Open doctor record')"
          :to="{ name: 'view_medico', params: { id: medicoId } }"
          v-close-popup
        >
          <s-tooltip>{{ tdc('Open doctor record') }}</s-tooltip>
        </s-btn>
      </template>
    </s-modal-card>
  </q-dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { tdc, ds, HTTPAuth, HTTPClient, url, useUserStore } from 'quasar_resaas'
import { useEmployeeStore } from '../../hr/stores/EmployeeStore.js'
import { useMedicoStore } from '../medico/medicoStore'
import DoctorRatingCard from './DoctorRatingCard.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  // the record's `employee` (an id, or the {id, ...} relation object)
  employee: { type: [Object, String, Number], default: null },
  fallbackName: { type: String, default: '' },
  // the public site: a doctor of saude/publicbooking/doctors/
  publicDoctor: { type: Object, default: null },
  // the clinic's branches ({ id, name }), to name where the doctor works (site)
  branches: { type: Array, default: () => [] },
  // public site: show "Book appointment"
  bookable: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'book'])

const isPublic = computed(() => !!props.publicDoctor)

const open = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const User = useUserStore()
const Employee = useEmployeeStore()
const Medico = useMedicoStore()

// the app's public profile (saude/doctorprofile/) - on the site, publicDoctor
const internalProfile = ref(null)
const staff = ref(null)       // HR data, only with view_employee
const medico = ref(null)      // signature/stamp/notes, only with list_medico
const rating = ref(null)
const scope = ref('entity')
const loading = ref(false)
const ratingLoading = ref(false)
const error = ref(false)

const employeeId = computed(() => (props.employee && typeof props.employee === 'object' ? props.employee.id : props.employee))
const profile = computed(() => (isPublic.value ? props.publicDoctor : internalProfile.value))
const can = (perm) => (typeof User?.can === 'function' ? User.can(perm) : false)
const canOpenRecord = computed(() => can('view_medico'))
const medicoId = computed(() => medico.value?.id || internalProfile.value?.medico_id)

function profileUrl () {
  return url({ type: 'u', url: `saude/doctorprofile/${employeeId.value}/`, params: { scope: scope.value } })
}

async function loadRating () {
  ratingLoading.value = true
  try {
    if (isPublic.value) {
      const { data } = await HTTPClient.get(url({ type: 'u', url: 'saude/publicbooking/rating/', params: { doctor: props.publicDoctor.id, scope: scope.value } }))
      rating.value = data
    } else {
      const { data } = await HTTPAuth.get(profileUrl())
      internalProfile.value = data
      rating.value = data.rating
    }
  } catch {
    // the rating stays as it was; the rest of the dialog is unaffected
  } finally {
    ratingLoading.value = false
  }
}

// fetchPage only reads: it leaves Employee.row/rows and Medico.row/rows to the page that owns them.
async function loadExtras () {
  const [emp, doc] = await Promise.allSettled([
    can('view_employee') ? Employee.fetchPage({ id: employeeId.value, page_size: 1 }) : null,
    can('list_medico') ? Medico.fetchPage({ employee: employeeId.value, page_size: 1 }) : null
  ])
  staff.value = emp.status === 'fulfilled' ? (emp.value?.rows?.[0] || null) : null
  medico.value = doc.status === 'fulfilled' ? (doc.value?.rows?.[0] || null) : null
}

async function load () {
  error.value = false
  if (isPublic.value) {
    rating.value = props.publicDoctor.rating || null
    await loadRating()
    return
  }
  if (!employeeId.value) {
    error.value = true
    return
  }

  loading.value = true
  try {
    const { data } = await HTTPAuth.get(profileUrl())
    internalProfile.value = data
    rating.value = data.rating
    await loadExtras()
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

watch(scope, () => { if (open.value) loadRating() })

async function moderate (comment, status) {
  try {
    await HTTPAuth.post(url({ type: 'u', url: `hr/employeeratings/${comment.id}/moderate/` }), { status })
    await loadRating()
  } catch {
    // the alert funnel (HTTPAuth interceptor) shows why
  }
}

const label = (value) => (value && typeof value === 'object' ? value.label : value)

const isActive = computed(() => (internalProfile.value ? internalProfile.value.active !== false : true))
const specialties = computed(() => (profile.value?.specialties || []).map(s => ({ id: s.id, label: tdc(s.title) })))

function initials (name) {
  return String(name || '').split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0].toUpperCase()).join('') || '?'
}

const branchNames = computed(() => {
  if (!isPublic.value) return (internalProfile.value?.branch_names || []).join(' · ')
  const ids = new Set(props.publicDoctor?.branches || [])
  return props.branches.filter(branch => ids.has(branch.id)).map(branch => branch.name).join(' · ')
})

const facts = computed(() => {
  const list = [
    { icon: 'confirmation_number', label: tdc('Order number'), value: profile.value?.order_number },
    { icon: 'category', label: tdc('Category'), value: profile.value?.category },
    { icon: 'place', label: tdc('Branches'), value: branchNames.value },
    { icon: 'translate', label: tdc('Languages'), value: profile.value?.languages }
  ]
  if (!isPublic.value && staff.value) {
    list.push(
      { icon: 'work_outline', label: tdc('Position'), value: staff.value.position_data?.title },
      { icon: 'fingerprint', label: tdc('Employee code'), value: staff.value.code },
      { icon: 'verified_user', label: tdc('Employment status'), value: label(staff.value.employment_status) },
      { icon: 'event', label: tdc('Hire date'), value: staff.value.hire_date ? ds(staff.value.hire_date) : '' },
      { icon: 'mail_outline', label: tdc('Work email'), value: staff.value.work_email },
      { icon: 'call', label: tdc('Work phone'), value: staff.value.work_phone }
    )
  }
  return list
})

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

.doctor-initials {
  font-size: 44px;
  font-weight: 800;
}
</style>
