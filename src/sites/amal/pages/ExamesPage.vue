<template>

  <section
    id="exames"
    class="exames-section amal-section amal-section--surface"
  >

    <!-- TITULO -->

    <div class="row justify-center q-mb-xl amal-on-light">

      <div class="text-center col-12">
        <h2 class="amal-title" :style="ps?.typography?.font_size_h1 ? { fontSize: ps.typography.font_size_h1 + 'px' } : null">
          {{ tdc('Exams') }}
        </h2>
      </div>

    </div>



    <!-- the clinic's active exams (GET saude/publicsite/exams/): search,
         filter by type, a card opens the exam's page -->
    <div class="row justify-center q-mb-lg q-px-md">
      <div class="col-12 col-md-10 row q-col-gutter-md items-center">
        <div class="col-12 col-sm-6">
          <s-input v-model="search" dense outlined clearable debounce="200" :label="tdc('Search exams')"
                   data-test="exams-search">
            <template #prepend><q-icon name="search" /></template>
          </s-input>
        </div>
        <div class="col-12 col-sm-6 row q-gutter-xs justify-end">
          <q-chip v-for="t in types" :key="t" clickable :outline="type !== t" color="primary"
                  :text-color="type === t ? 'white' : 'primary'" @click="type = type === t ? null : t">
            {{ t }}
          </q-chip>
        </div>
      </div>
    </div>

    <div v-if="site.loading.exams && !site.exams.length" class="row justify-center q-pa-lg">
      <q-spinner color="primary" size="40px" />
    </div>
    <div v-else-if="!filtered.length" class="text-center amal-muted q-pa-lg" data-test="exams-empty">
      {{ site.exams.length ? tdc('No exam matches your search.') : tdc('Our exams will be shown here soon. Please call us.') }}
    </div>

    <div v-else class="row justify-center q-px-md">
      <div class="col-12 col-md-10 row q-col-gutter-lg">
        <div v-for="exam in shown" :key="exam.id" class="col-md-4 col-sm-6 col-12">
          <s-card class="amal-card amal-card--hover exam-card cursor-pointer" data-test="exam-card"
                  @click="openExam(exam)">
            <q-card-section class="text-center q-pa-lg">
              <span class="amal-icon"><q-icon name="biotech" size="28px" /></span>
              <div class="text-h6 text-weight-bold q-mt-md">{{ exam.name }}</div>
              <div class="amal-muted q-mt-xs exam-desc">{{ [exam.type, exam.class].filter(Boolean).join(' · ') }}</div>
              <div class="text-subtitle1 text-weight-bold q-mt-sm text-primary">
                {{ formatPrice(exam.price) || tdc('Price on request') }}
              </div>
              <div class="q-mt-md">
                <s-btn color="primary" icon="visibility" no-caps outline class="amal-btn" :label="tdc('View details')"
                       @click.stop="openExam(exam)">
                  <s-tooltip>{{ tdc('See the preparation, sample and price of this exam') }}</s-tooltip>
                </s-btn>
              </div>
            </q-card-section>
          </s-card>
        </div>
        <div v-if="filtered.length > shown.length" class="col-12 text-center">
          <s-btn flat no-caps color="primary" icon="expand_more" :label="tdc('Show all exams') + ` (${filtered.length})`"
                 data-test="exams-more" @click="all = true">
            <s-tooltip>{{ tdc('Show every exam of the clinic') }}</s-tooltip>
          </s-btn>
        </div>
      </div>
    </div>

    <OfferDetailDialog v-model="detailOpen" kind="exam" :id="detailId" />
  </section>

</template>



<script>
import { computed, defineComponent, onMounted, ref } from "vue"
import { tdc, useUserStore } from "quasar_resaas"
import { usePublicSite } from "../usePublicSite"
import OfferDetailDialog from "./OfferDetailDialog.vue"

const FIRST = 9

export default defineComponent({
  components: { OfferDetailDialog },

  setup () {
    const User = useUserStore()
    const ps = computed(() => User.ps || {})
    const detailOpen = ref(false)
    const detailId = ref(null)
    const { state: site, loadExams, formatPrice } = usePublicSite()

    const search = ref("")
    const type = ref(null)
    const all = ref(false)

    const types = computed(() => [...new Set(site.exams.map(e => e.type).filter(Boolean))])
    const normalize = (text) => String(text || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    const filtered = computed(() => {
      const q = normalize(search.value)
      return site.exams.filter(e => (!type.value || e.type === type.value) &&
        (!q || [e.name, e.code, e.class, e.type].some(v => normalize(v).includes(q))))
    })
    const shown = computed(() => (all.value || search.value || type.value) ? filtered.value : filtered.value.slice(0, FIRST))

    // the exam's details in a modal
    function openExam (exam) {
      detailId.value = exam.id
      detailOpen.value = true
    }

    onMounted(loadExams)

    return { ps, tdc, site, search, type, all, types, filtered, shown, formatPrice, openExam, detailOpen, detailId }
  }
})
</script>



<style scoped>
.exam-desc{
  font-size:14px;
  line-height:1.5;
}
</style>
