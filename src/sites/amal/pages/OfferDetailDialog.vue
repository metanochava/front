<template>
  <!-- one exam or consultation of the site in a modal: what is sold, its
       price and what it includes, its images, and the way to book it
       (GET saude/publicsite/exams/<id>/ or consultations/<key>/) -->
  <q-dialog v-model="open" transition-show="scale" transition-hide="scale">
    <s-modal-card :title="title || tdc(kind === 'exam' ? 'Exam' : 'Consultation')"
                  :icon="kind === 'exam' ? 'biotech' : 'medical_services'" width="min(720px, 94vw)">
      <div v-if="loading" class="row justify-center q-pa-xl"><q-spinner color="primary" size="48px" /></div>

      <div v-else-if="!item" class="text-center q-pa-xl" data-test="offer-not-found">
        {{ tdc(kind === 'exam' ? 'Exam not found.' : 'Consultation not found.') }}
      </div>

      <div v-else data-test="offer-detail">
        <div class="row items-center q-col-gutter-md q-mb-md">
          <div class="col">
            <div class="amal-muted">{{ subtitle }}</div>
          </div>
          <div class="col-auto text-right">
            <div class="text-caption amal-muted">{{ tdc('Price') }}</div>
            <div class="text-h5 text-primary text-weight-bold" data-test="offer-price">
              {{ formatPrice(item.price) || tdc('Price on request') }}
            </div>
          </div>
        </div>

        <q-carousel v-if="item.images?.length" v-model="slide" animated arrows navigation infinite height="240px"
                    class="q-mb-md rounded-borders">
          <q-carousel-slide v-for="(src, i) in item.images" :key="src" :name="i" :img-src="src" />
        </q-carousel>

        <div v-if="item.description" class="text-body1 q-mb-md">{{ item.description }}</div>

        <!-- exam: preparation, sample, result time -->
        <q-list v-if="kind === 'exam'" separator>
          <q-item v-if="item.preparation">
            <q-item-section avatar><q-icon name="restaurant" color="primary" /></q-item-section>
            <q-item-section><q-item-label caption>{{ tdc('Preparation') }}</q-item-label>{{ item.preparation }}</q-item-section>
          </q-item>
          <q-item v-if="item.sample">
            <q-item-section avatar><q-icon name="science" color="primary" /></q-item-section>
            <q-item-section><q-item-label caption>{{ tdc('Sample') }}</q-item-label>{{ item.sample }}</q-item-section>
          </q-item>
          <q-item v-if="item.result_hours">
            <q-item-section avatar><q-icon name="schedule" color="primary" /></q-item-section>
            <q-item-section>
              <q-item-label caption>{{ tdc('Results') }}</q-item-label>
              {{ resultTime(item.result_hours) }}
            </q-item-section>
          </q-item>
        </q-list>

        <!-- what the price includes (only when it has several items) -->
        <div v-if="item.includes?.length" class="q-mt-md" data-test="offer-includes">
          <div class="text-subtitle1 text-weight-bold q-mb-sm">{{ tdc('What the price includes') }}</div>
          <q-markup-table flat bordered dense>
            <tbody>
              <tr v-for="line in item.includes" :key="line.name">
                <td>{{ line.name }}<span v-if="Number(line.quantity) !== 1" class="amal-muted"> × {{ line.quantity }}</span></td>
                <td class="text-right">{{ formatPrice(line.total) }}</td>
              </tr>
              <tr class="text-weight-bold">
                <td>{{ tdc('Total') }}</td>
                <td class="text-right">{{ formatPrice(item.price) }}</td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>

        <!-- consultation: the specialty's doctors -->
        <div v-if="kind === 'consultation' && item.doctors?.length" class="q-mt-md">
          <div class="text-subtitle1 text-weight-bold q-mb-sm">{{ tdc('Our doctors') }}</div>
          <div class="row q-col-gutter-sm">
            <div v-for="d in item.doctors" :key="d.id" class="col-12 col-sm-6">
              <q-item class="rounded-borders bg-grey-1">
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white">
                    <img v-if="d.photo" :src="d.photo" :alt="d.name" />
                    <span v-else>{{ d.name.charAt(0) }}</span>
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ d.name }}</q-item-label>
                  <q-item-label caption>{{ (d.specialties || []).map(s => s.title).join(', ') }}</q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <s-btn v-if="item && kind === 'consultation'" color="primary" icon="event" no-caps class="amal-btn"
               :label="tdc('Book appointment')" data-test="offer-book" @click="book">
          <s-tooltip>{{ tdc('Book this consultation') }}</s-tooltip>
        </s-btn>
        <s-btn v-else-if="item" color="primary" icon="call" no-caps class="amal-btn" :label="tdc('Contact us')"
               data-test="offer-contact" @click="contact">
          <s-tooltip>{{ tdc('Ask us about this exam') }}</s-tooltip>
        </s-btn>
        <s-btn flat no-caps :label="tdc('Close')" data-test="offer-close" @click="open = false">
          <s-tooltip>{{ tdc('Close') }}</s-tooltip>
        </s-btn>
      </template>
    </s-modal-card>
  </q-dialog>
</template>

<script>
import { computed, defineComponent, ref, watch } from "vue"
import { useRouter } from "vue-router"
import { tdc } from "quasar_resaas"
import { usePublicSite } from "../usePublicSite"
import { usePublicBooking } from "../usePublicBooking"

export default defineComponent({
  props: {
    modelValue: { type: Boolean, default: false },
    kind: { type: String, required: true },     // 'exam' | 'consultation'
    id: { type: String, default: null }          // the exam id or the consultation key
  },

  emits: ['update:modelValue'],

  setup (props, { emit }) {
    const router = useRouter()
    const { getExam, getConsultation, formatPrice, goToSection } = usePublicSite()
    const { state: booking } = usePublicBooking()
    const open = computed({ get: () => props.modelValue, set: value => emit('update:modelValue', value) })
    const item = ref(null)
    const loading = ref(false)
    const slide = ref(0)

    const title = computed(() => item.value
      ? (props.kind === "consultation" && item.value.general ? tdc(item.value.title) : item.value.title) : "")
    const subtitle = computed(() => !item.value ? "" : props.kind === "exam"
      ? [item.value.type, item.value.class, item.value.code].filter(Boolean).join(" · ")
      : tdc("Consultation"))

    const resultTime = (hours) => hours >= 24 && hours % 24 === 0
      ? `${hours / 24} ${tdc(hours === 24 ? "day" : "days")}`
      : `${hours} ${tdc(hours === 1 ? "hour" : "hours")}`

    async function load () {
      loading.value = true
      item.value = null
      try {
        item.value = props.kind === "exam" ? await getExam(props.id) : await getConsultation(props.id)
      } catch {
        item.value = null
      } finally {
        loading.value = false
      }
    }

    // the booking form with this consultation's specialty (all doctors for the general one)
    function book () {
      booking.preselect = { doctor: null, specialty: item.value.general ? null : item.value.key }
      open.value = false
      goToSection(router, "#marcacao")
    }

    function contact () {
      open.value = false
      goToSection(router, "#contactos")
    }

    // loaded each time it opens (the price follows the catalog)
    watch(() => [props.modelValue, props.kind, props.id], ([visible]) => { if (visible && props.id) load() },
          { immediate: true })

    return { tdc, open, item, loading, slide, title, subtitle, formatPrice, resultTime, book, contact }
  }
})
</script>
