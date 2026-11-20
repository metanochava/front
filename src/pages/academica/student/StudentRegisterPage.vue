<template>
  <!-- registering a student: the Person (the shared person intake - search
       for an existing person first, documents, contacts), the admission date
       and the guardians (who pays). One call, all or nothing. -->
  <q-page class="q-pa-sm">
    <q-form class="row q-col-gutter-md" @submit.prevent="save">
      <div class="col-12">
        <s-card flat bordered>
          <q-card-section class="row items-center no-wrap">
            <q-avatar size="44px" color="primary" text-color="white" icon="school" class="q-mr-md" />
            <div class="col">
              <div class="text-h6 text-weight-bold">{{ tdc('Register student') }}</div>
              <div class="text-caption text-grey-7">{{ tdc('Pick the person who is this student.') }}</div>
            </div>
          </q-card-section>
        </s-card>
      </div>

      <div class="col-12">
        <s-person-intake :intake="intake" :relation-config="personRelationConfig" />
      </div>

      <div class="col-12">
        <s-card flat bordered>
          <q-card-section class="text-subtitle1 text-weight-medium">{{ tdc('Student') }}</q-card-section>
          <q-separator />
          <q-card-section class="row q-col-gutter-md">
            <div class="col-12 col-sm-4">
              <s-date v-model="admissionDate" :label="tdc('Admission date')" data-test="student-admission" />
            </div>
            <div class="col-12 col-sm-8">
              <s-input v-model="notes" type="textarea" autogrow :label="tdc('Notes')" />
            </div>
          </q-card-section>
        </s-card>
      </div>

      <!-- GUARDIANS -->
      <div class="col-12">
        <s-card flat bordered>
          <q-card-section class="row items-center">
            <div class="text-subtitle1 text-weight-medium">{{ tdc('Guardians') }}</div>
            <q-space />
            <s-btn flat dense icon="person_add" color="primary" no-caps :label="tdc('Add guardian')"
                   data-test="student-add-guardian" @click="addGuardian">
              <s-tooltip>{{ tdc('Add guardian') }}</s-tooltip>
            </s-btn>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div v-if="!guardians.length" class="text-caption text-grey-6">
              {{ tdc('No guardian: the student pays the fees.') }}
            </div>
            <div v-for="(guardian, index) in guardians" :key="index" class="row q-col-gutter-sm items-center q-mb-sm">
              <div class="col-12 col-md-5">
                <s-select v-model="guardian.person_id" :api="personsUrl" emit-value map-options
                          :label="tdc('Person')" />
              </div>
              <div class="col-6 col-md-3">
                <s-select v-model="guardian.relationship" :options="relationshipOptions" emit-value map-options
                          :label="tdc('Relationship')" />
              </div>
              <div class="col-6 col-md-3 row no-wrap">
                <q-checkbox :model-value="guardian.pays" :label="tdc('Pays')" @update:model-value="setPayer(index, $event)" />
                <q-checkbox v-model="guardian.emergency_contact" :label="tdc('Emergency')" />
              </div>
              <div class="col-auto">
                <s-btn flat dense round icon="delete_outline" color="negative" @click="guardians.splice(index, 1)">
                  <s-tooltip>{{ tdc('Remove') }}</s-tooltip>
                </s-btn>
              </div>
            </div>
          </q-card-section>
        </s-card>
      </div>

      <div class="col-12 row justify-end q-gutter-sm">
        <s-btn flat :label="tdc('Cancel')" @click="router.back()">
          <s-tooltip>{{ tdc('Close without saving') }}</s-tooltip>
        </s-btn>
        <s-btn type="submit" color="primary" icon="save" :label="tdc('Register student')" :loading="Student.registering"
               data-test="student-save">
          <s-tooltip>{{ tdc('Register student') }}</s-tooltip>
        </s-btn>
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { tdc, url, usePersonIntake, AlertSuccess } from 'quasar_resaas'
import { useStudentStore } from './studentStore'

const router = useRouter()
const intake = usePersonIntake()
const Student = useStudentStore()

const admissionDate = ref(new Date().toLocaleDateString('en-CA'))
const notes = ref('')
const guardians = ref([])
const personsUrl = url({ type: 'u', url: 'django_resaas/persons', params: { select: 'true' } })

const personRelationConfig = computed(() => intake.fieldOf(Student, 'person')?.relation_config || null)

const relationshipOptions = computed(() => [
  ['mother', 'Mother'], ['father', 'Father'], ['grandparent', 'Grandparent'], ['sibling', 'Sibling'],
  ['uncle_aunt', 'Uncle / aunt'], ['legal_guardian', 'Legal guardian'], ['other', 'Other']
].map(([value, label]) => ({ value, label: tdc(label) })))

function addGuardian () {
  guardians.value.push({ person_id: null, relationship: 'mother', pays: !guardians.value.length, emergency_contact: false })
}

// one paying guardian (the backend keeps it so too)
function setPayer (index, value) {
  guardians.value.forEach((g, i) => { g.pays = value && i === index })
}

async function save () {
  const outcome = await intake.resolveMatch()
  if (outcome === 'cancel') return
  try {
    const student = await Student.register({
      ...intake.registrationPayload(),
      admissionDate: admissionDate.value,
      notes: notes.value,
      guardians: guardians.value.filter(g => g.person_id)
    })
    AlertSuccess(`${tdc('Student registered')}: ${student.number}`)
    router.push({ name: 'list_student' })
  } catch { /* the alert funnel shows why */ }
}
</script>
