<template>
  <!-- the consultation price per specialty and of the general consultation
       (GET saude/publicsite/consultations/); a card opens the consultation's
       page. Without prices the section is not shown - no invented prices. -->
  <section v-if="site.consultations.length" id="precos" class="amal-section amal-section--surface" data-test="prices">
    <div class="row justify-center q-mb-xl amal-on-light">
      <div class="text-center col-12">
        <div class="amal-eyebrow">{{ tdc('Amal Clinic') }}</div>
        <h2 class="amal-title" :style="ps?.typography?.font_size_h1 ? { fontSize: ps.typography.font_size_h1 + 'px' } : null">
          {{ tdc('Consultation prices') }}
        </h2>
      </div>
    </div>

    <div class="row justify-center q-px-md">
      <div class="col-12 col-md-10 row justify-center q-col-gutter-lg">
        <div v-for="c in site.consultations" :key="c.key" class="col-md-3 col-sm-6 col-12">
          <s-card class="amal-card amal-card--hover text-center cursor-pointer" data-test="consultation-card"
                  @click="open(c)">
            <q-card-section class="q-pa-lg">
              <span class="amal-icon"><q-icon :name="c.general ? 'stethoscope' : 'medical_services'" size="28px" /></span>
              <div class="text-h6 text-weight-bold q-mt-md">{{ c.general ? tdc(c.title) : c.title }}</div>
              <div class="text-h6 text-primary text-weight-bold q-mt-sm">{{ formatPrice(c.price) }}</div>
              <div class="q-mt-md">
                <s-btn color="primary" icon="visibility" no-caps outline class="amal-btn" :label="tdc('View details')"
                       @click.stop="open(c)">
                  <s-tooltip>{{ tdc('See what is included and the doctors') }}</s-tooltip>
                </s-btn>
              </div>
            </q-card-section>
          </s-card>
        </div>
      </div>
    </div>
    <OfferDetailDialog v-model="detailOpen" kind="consultation" :id="detailId" />
  </section>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from "vue"
import { tdc, useUserStore } from "quasar_resaas"
import { usePublicSite } from "../usePublicSite"
import OfferDetailDialog from "./OfferDetailDialog.vue"

export default defineComponent({
  components: { OfferDetailDialog },

  setup () {
    const User = useUserStore()
    const ps = computed(() => User.ps || {})
    const detailOpen = ref(false)
    const detailId = ref(null)
    const { state: site, loadConsultations, formatPrice } = usePublicSite()
    // the consultation's details in a modal
    function open (c) {
      detailId.value = c.key
      detailOpen.value = true
    }
    onMounted(loadConsultations)
    return { ps, tdc, site, formatPrice, open, detailOpen, detailId }
  }
})
</script>
