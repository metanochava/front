<template>
  <div id="slider">

    <!-- SLIDER: the whole screen. It starts under the header (margin-top:-70px);
         on desktop the 50px menu bar below the header is taken off -->
    <q-carousel
      style="margin-top:-70px;"
      v-model="slide"
      animated
      arrows
      navigation
      infinite
      :height="$q.screen.lt.md ? '100vh' : 'calc(100vh - 50px)'"
      autoplay
    >

      <q-carousel-slide
        v-for="(s, i) in slides"
        :key="i"
        :name="i"
        :img-src="s.img"
        class="column flex-center"
      >

        <div
          class="slide-overlay column flex-center text-center"
          :style="{ borderRadius: ps?.layout?.rounded ? '30px' : '6px' }"
        >

          <div
            class="slide-title q-mb-md"
            :style="ps?.typography?.font_size_h1 ? { fontSize: ps.typography.font_size_h1 + 'px' } : null"
          >
            {{ tdc(s.title) }}
          </div>

          <div
            class="slide-text q-mb-lg"
            :style="ps?.typography?.font_size_body ? { fontSize: ps.typography.font_size_body + 'px' } : null"
          >
            {{ tdc(s.desc) }}
          </div>

          <s-btn
            unelevated
            no-caps
            color="primary"
            size="lg"
            icon-right="arrow_forward"
            class="slide-btn"
            :label="tdc(s.button)"
            @click="scrollTo(s.section)"
          />

        </div>

      </q-carousel-slide>

    </q-carousel>

  </div>
</template>

<script>
import { defineComponent, ref, computed } from "vue"
import { tdc,useUserStore } from "quasar_resaas"
import foto from "./../images/13.jpeg"

export default defineComponent({

  setup () {

    const User =useUserStore()

    const slide = ref(0)

    const ps = computed(() => User.ps || {})

    const slides = [
      {
        img: foto,
        title: 'Qualified specialists',
        desc: 'Experienced doctors in several specialties',
        button: 'Meet the doctors',
        section: "medicos"
      },

      {
        img: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=2000",
        title: 'Modern clinic',
        desc: 'Advanced technology to look after your health',
        button: 'Book appointment',
        section: "marcacao"
      },

      {
        img: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2000",
        title: 'Humane care',
        desc: 'We care for every patient with attention',
        button: 'Contact the clinic',
        section: "contactos"
      }
    ]

    // the site is one page: each slide leads to its section (the named routes
    // it used before - marcarconsulta, medicos, contactos - do not exist)
    function scrollTo (id) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }

    return {
      User,
      ps,
      tdc,
      slide,
      slides,
      scrollTo
    }

  }

})
</script>

<style>
.slide-overlay {
  background: color-mix(in srgb, var(--q-primary) 50%, rgba(0, 0, 0, .55));
  backdrop-filter: blur(4px);
  padding: 40px;
  border-radius: 10px;
  color: white;
  max-width: 640px;
  margin: 0 16px;
}
</style>

<style scoped>
.slide-title {
  font-size: clamp(30px, 4vw, 52px);
  line-height: 1.1;
  font-weight: 800;
}
.slide-text {
  font-size: clamp(16px, 1.6vw, 20px);
  line-height: 1.5;
  opacity: .95;
}
.slide-btn {
  border-radius: 999px !important;
  font-weight: 700;
}
</style>
