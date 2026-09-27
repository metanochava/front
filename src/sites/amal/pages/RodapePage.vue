<template>

<div class="footer-wrapper">

  <!-- MAPA: the clinic's branches (GET site/branches/, from each Branch's
       main address) - one map, a button per branch when there are several -->
  <div v-if="located.length" class="map-container" data-test="branches-map">

    <div class="map-caption">
      <template v-if="located.length > 1">
        <s-btn
          v-for="branch in located"
          :key="branch.id"
          no-caps
          unelevated
          size="sm"
          icon="location_on"
          class="amal-btn"
          :color="branch.id === current.id ? 'white' : 'transparent'"
          :text-color="branch.id === current.id ? 'primary' : 'white'"
          :label="branch.name"
          data-test="map-branch"
          @click="currentId = branch.id"
        />
        <span v-if="current.address" class="map-address">{{ current.address }}</span>
      </template>

      <template v-else>
        <q-icon name="location_on" size="18px" />
        <b>{{ current.name }}</b>
        <span v-if="current.address" class="map-address">· {{ current.address }}</span>
      </template>
    </div>

    <iframe
      :key="current.id"
      width="100%"
      height="380"
      style="border:0"
      loading="lazy"
      allowfullscreen
      :title="current.name"
      :src="mapUrl(current)"
    ></iframe>

  </div>


  <!-- FOOTER -->
  <div class="footer-glass q-pa-xl">

    <div class="row q-col-gutter-xl">

      <!-- CLINICA -->
      <div class="col-md-4 col-12">

        <div class="text-h6 text-weight-bold q-mb-md">
          {{ tdc('Amal Clinic') }}
        </div>

        <div>
          {{ tdc('Modern medical care with advanced technology and qualified specialists to look after your health.') }}
        </div>

      </div>


      <!-- HORARIO -->
      <div class="col-md-4 col-12">

        <div class="text-h6 text-weight-bold q-mb-md">
          {{ tdc('Opening hours') }}
        </div>

        <div>{{ tdc('Monday - Friday: 08:00 - 18:00') }}</div>
        <div>{{ tdc('Saturday: 08:00 - 13:00') }}</div>
        <div>{{ tdc('Sunday: Closed') }}</div>

      </div>


      <!-- CONTACTOS -->
      <div class="col-md-4 col-12">

        <div class="text-h6 text-weight-bold q-mb-md">
          {{ tdc('Contacts') }}
        </div>

        <div>📧 info@clinicaamal.co.mz</div>
        <div>📞 +258 865550550</div>

        <div class="q-mt-md">

          <q-btn
            color="green"
            icon="fab fa-whatsapp"
            label="WhatsApp"
            href="https://wa.me/258865550550"
            target="_blank"
          />

        </div>

      </div>

    </div>


    <!-- REDES SOCIAIS -->
    <div class="row justify-center q-mt-xl social">

      <q-btn flat round icon="fab fa-facebook"/>
      <q-btn flat round icon="fab fa-instagram"/>
      <q-btn flat round icon="fab fa-twitter"/>
      <q-btn flat round icon="fab fa-linkedin"/>

    </div>


    <!-- COPYRIGHT -->
    <div class="text-center q-mt-xl text-caption">

      © {{ new Date().getFullYear() }}
      {{ tdc('All rights reserved') }}

    </div>

  </div>


  <!-- BOTAO WHATSAPP FLUTUANTE -->
  <q-page-sticky position="bottom-right" :offset="[10,65]">

    <q-btn
      round
      size="lg"
      color="green"
      icon="fab fa-whatsapp"
      class="whatsapp-btn"
      href="https://wa.me/258865550550"
      target="_blank"
    />

  </q-page-sticky>

</div>

</template>


<script>
import { defineComponent, computed, onMounted, ref } from "vue"
import { tdc, HTTPClient, url } from "quasar_resaas"

export default defineComponent({

  setup(){

    // the clinic's branches with a location (public: the clinic is found
    // from this site's Origin); the map used to be one fixed coordinate
    const branches = ref([])
    const currentId = ref(null)

    const located = computed(() => branches.value.filter(b => b.coordinates))
    const current = computed(() =>
      located.value.find(b => b.id === currentId.value) || located.value[0] || {}
    )

    function mapUrl (branch) {
      const { lat, lng } = branch.coordinates || {}
      return `https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`
    }

    onMounted(async () => {
      try {
        const response = await HTTPClient.get(url({ type: "u", url: "site/branches/" }))
        branches.value = Array.isArray(response.data) ? response.data : []
      } catch {
        branches.value = []   // no map rather than a wrong one
      }
    })

    return{
      tdc,
      located,
      current,
      currentId,
      mapUrl
    }
  }

})
</script>


<style scoped>
/* the theme's footer colours (Theme.footer / footer_text), a subtle brand glow */
.footer-wrapper{
  background:
    radial-gradient(circle at 15% 0%, color-mix(in srgb, var(--amal-secondary) 45%, transparent), transparent 55%),
    var(--amal-footer);
  color:var(--amal-footer-text);
}
.body--dark .footer-wrapper{
  background:
    radial-gradient(circle at 15% 0%, color-mix(in srgb, var(--amal-primary) 30%, transparent), transparent 55%),
    var(--amal-surface);
  color:var(--amal-text);
}
.map-container{
  position:relative;
}
.map-caption{
  display:flex;
  flex-wrap:wrap;
  align-items:center;
  justify-content:center;
  gap:8px;
  padding:10px 16px;
  font-size:14px;
  background:color-mix(in srgb, var(--amal-footer) 92%, #000);
}
.map-address{
  opacity:.85;
}
.map-container iframe{
  display:block;
  filter:contrast(1.05) saturate(1.05);
}
.body--dark .map-container iframe{
  filter:invert(.9) hue-rotate(180deg) contrast(.9);
}
.footer-glass{
  border-top:1px solid color-mix(in srgb, currentColor 15%, transparent);
}
.social :deep(.q-btn){
  margin:0 6px;
  transition:transform .2s;
}
.social :deep(.q-btn:hover){
  transform:scale(1.15);
}
.whatsapp-btn{
  box-shadow:0 8px 25px rgba(0,0,0,.3);
}
.whatsapp-btn:hover{
  transform:scale(1.1);
  transition:.2s;
}
</style>
