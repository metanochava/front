<template>
  <!-- the student / guardian portal: the caller's own enrolments (or their
       students') with grades, attendance and tuition - read only -->
  <q-page class="q-pa-sm">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <s-card flat bordered>
          <q-card-section class="row items-center q-col-gutter-sm">
            <div class="col-auto">
              <q-avatar size="44px" color="primary" text-color="white" icon="backpack" />
            </div>
            <div class="col">
              <div class="text-h6 text-weight-bold">{{ tdc('My school life') }}</div>
              <div class="text-caption text-grey-7">{{ tdc('Grades, attendance and fees of your enrolments.') }}</div>
            </div>
            <div class="col-12 col-sm-5">
              <s-select v-if="Portal.enrolments.length > 1" v-model="enrolmentId" :options="enrolmentOptions"
                        emit-value map-options :label="tdc('Enrolment')" data-test="portal-enrolment" />
            </div>
            <div class="col-auto">
              <s-btn flat round icon="refresh" :loading="Portal.loading" @click="reload">
                <s-tooltip>{{ tdc('Reload') }}</s-tooltip>
              </s-btn>
            </div>
          </q-card-section>
        </s-card>
      </div>

      <div v-if="!Portal.loading && !Portal.enrolments.length" class="col-12">
        <s-card flat bordered>
          <q-card-section class="text-grey-7" data-test="portal-empty">
            {{ tdc('No enrolment is linked to your account.') }}
          </q-card-section>
        </s-card>
      </div>

      <template v-if="current">
        <div class="col-12">
          <s-card flat bordered>
            <q-card-section class="row q-col-gutter-md">
              <div class="col-12 col-sm-4">
                <div class="text-caption text-grey-7">{{ tdc('Student') }}</div>
                <div class="text-subtitle1 text-weight-medium">{{ current.student }}</div>
                <div class="text-caption">{{ current.student_number }}</div>
              </div>
              <div class="col-6 col-sm-3">
                <div class="text-caption text-grey-7">{{ tdc('Academic year') }}</div>
                <div>{{ current.academic_year.name }}</div>
              </div>
              <div class="col-6 col-sm-3">
                <div class="text-caption text-grey-7">{{ tdc('Class') }}</div>
                <div>{{ current.grade_level }}<span v-if="current.class_group"> · {{ current.class_group }}</span></div>
              </div>
              <div class="col-12 col-sm-2">
                <q-badge :color="statusColor(current.status)" :label="tdc(cap(current.status))" />
              </div>
            </q-card-section>
          </s-card>
        </div>

        <div class="col-12">
          <s-card flat bordered>
            <q-tabs v-model="tab" dense align="center" active-color="primary" indicator-color="primary" no-caps>
              <q-tab name="grades" icon="grading" :label="tdc('Grades')" />
              <q-tab name="attendance" icon="fact_check" :label="tdc('Attendance')" />
              <q-tab name="tuition" icon="payments" :label="tdc('Tuition')" />
            </q-tabs>
            <q-separator />

            <q-tab-panels v-model="tab" animated>
              <!-- GRADES -->
              <q-tab-panel name="grades" data-test="portal-grades">
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-4">
                    <s-select v-model="periodId" :options="periodOptions" emit-value map-options clearable
                              :label="tdc('Period')" @update:model-value="loadCurrent" />
                  </div>
                  <div class="col-12">
                    <q-markup-table flat bordered dense>
                      <thead>
                        <tr>
                          <th class="text-left">{{ tdc('Subject') }}</th>
                          <th class="text-right">{{ tdc('Average') }}</th>
                          <th class="text-center">{{ tdc('Result') }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="row in Portal.grades?.report || []" :key="row.subject_id">
                          <td>{{ row.subject }}</td>
                          <td class="text-right">{{ row.average ?? '—' }}</td>
                          <td class="text-center">
                            <q-badge v-if="row.passed !== null" :color="row.passed ? 'positive' : 'negative'"
                                     :label="tdc(row.passed ? 'Pass' : 'Fail')" />
                            <span v-else>—</span>
                          </td>
                        </tr>
                        <tr v-if="!(Portal.grades?.report || []).length">
                          <td colspan="3" class="text-grey-6">{{ tdc('No grades yet.') }}</td>
                        </tr>
                      </tbody>
                    </q-markup-table>
                  </div>
                  <div v-if="(Portal.grades?.grades || []).length" class="col-12">
                    <div class="text-subtitle2 q-mb-sm">{{ tdc('Assessments') }}</div>
                    <q-markup-table flat bordered dense>
                      <thead>
                        <tr>
                          <th class="text-left">{{ tdc('Date') }}</th>
                          <th class="text-left">{{ tdc('Subject') }}</th>
                          <th class="text-left">{{ tdc('Assessment') }}</th>
                          <th class="text-right">{{ tdc('Grade') }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="g in Portal.grades.grades" :key="g.id">
                          <td>{{ isoToDisplay(g.date) }}</td>
                          <td>{{ g.subject }}</td>
                          <td>{{ g.assessment }} <span class="text-caption text-grey-6">({{ g.period.name }})</span></td>
                          <td class="text-right">{{ g.absent ? tdc('Absent') : (g.value ?? g.qualitative_value) }}</td>
                        </tr>
                      </tbody>
                    </q-markup-table>
                  </div>
                </div>
              </q-tab-panel>

              <!-- ATTENDANCE -->
              <q-tab-panel name="attendance" data-test="portal-attendance">
                <div class="row q-col-gutter-sm q-mb-md">
                  <div v-for="(label, status) in attendanceLabels" :key="status" class="col-6 col-sm-3">
                    <s-card flat bordered class="text-center q-pa-sm">
                      <div class="text-h6">{{ Portal.attendance?.totals?.[status] ?? 0 }}</div>
                      <div class="text-caption text-grey-7">{{ tdc(label) }}</div>
                    </s-card>
                  </div>
                </div>
                <q-markup-table flat bordered dense>
                  <thead>
                    <tr>
                      <th class="text-left">{{ tdc('Date') }}</th>
                      <th class="text-left">{{ tdc('Subject') }}</th>
                      <th class="text-left">{{ tdc('Status') }}</th>
                      <th class="text-left">{{ tdc('Justification') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="r in Portal.attendance?.records || []" :key="r.id">
                      <td>{{ isoToDisplay(r.date) }}</td>
                      <td>{{ r.subject || tdc('Whole day') }}</td>
                      <td>{{ tdc(attendanceLabels[r.status] || r.status) }}</td>
                      <td>{{ r.justification }}</td>
                    </tr>
                    <tr v-if="!(Portal.attendance?.records || []).length">
                      <td colspan="4" class="text-grey-6">{{ tdc('No attendance recorded yet.') }}</td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </q-tab-panel>

              <!-- TUITION -->
              <q-tab-panel name="tuition" data-test="portal-tuition">
                <div class="text-subtitle1 q-mb-sm">
                  {{ tdc('Balance owed') }}: <b>{{ money(Portal.tuition?.balance) }}</b>
                </div>
                <q-markup-table flat bordered dense>
                  <thead>
                    <tr>
                      <th class="text-left">{{ tdc('Fee') }}</th>
                      <th class="text-left">{{ tdc('Month') }}</th>
                      <th class="text-right">{{ tdc('Total') }}</th>
                      <th class="text-right">{{ tdc('Paid') }}</th>
                      <th class="text-right">{{ tdc('Balance') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="c in Portal.tuition?.charges || []" :key="c.id">
                      <td>{{ tdc(c.kind === 'enrolment_fee' ? 'Enrolment fee' : 'Monthly fee') }}</td>
                      <td>{{ c.month ? c.month.slice(0, 7) : '—' }}</td>
                      <td class="text-right">{{ money(c.total) }}</td>
                      <td class="text-right">{{ money(c.paid) }}</td>
                      <td class="text-right">{{ money(c.balance) }}</td>
                    </tr>
                    <tr v-if="!(Portal.tuition?.charges || []).length">
                      <td colspan="5" class="text-grey-6">{{ tdc('No fees charged.') }}</td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </q-tab-panel>
            </q-tab-panels>
          </s-card>
        </div>
      </template>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { tdc, isoToDisplay } from 'quasar_resaas'
import { usePortalStore } from './portalStore'

const Portal = usePortalStore()
const enrolmentId = ref(null)
const periodId = ref(null)
const tab = ref('grades')

const attendanceLabels = { present: 'Present', absent: 'Absent', late: 'Late', excused: 'Excused absence' }

const current = computed(() => Portal.enrolments.find(e => e.id === enrolmentId.value) || null)
const enrolmentOptions = computed(() => Portal.enrolments.map(e => ({
  value: e.id, label: `${e.student} · ${e.academic_year.name} · ${e.grade_level}`
})))
const periodOptions = computed(() => (Portal.grades?.periods || []).map(p => ({ value: p.id, label: p.name })))

const cap = (value) => value ? value.charAt(0).toUpperCase() + value.slice(1) : ''
const statusColor = (status) => ({ active: 'positive', pending: 'warning', suspended: 'orange', cancelled: 'negative' }[status] || 'grey')
const money = (value) => value === null || value === undefined ? '—'
  : Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

async function loadCurrent () {
  if (enrolmentId.value) await Portal.loadEnrolment(enrolmentId.value, { period: periodId.value })
}

async function reload () {
  const rows = await Portal.loadEnrolments()
  if (!rows.some(e => e.id === enrolmentId.value)) enrolmentId.value = rows[0]?.id || null
  else await loadCurrent()
}

watch(enrolmentId, () => { periodId.value = null; loadCurrent() })
onMounted(reload)
</script>
