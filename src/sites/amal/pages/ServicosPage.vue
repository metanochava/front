<template>
  <section
    id="servicos"
    class="servicos amal-section amal-section--brand"
  >

    <!-- TITULO -->
    <div class="row justify-center q-mb-xl">

      <div class="text-center col-12">
        <div class="amal-eyebrow">{{ tdc('Amal Clinic') }}</div>
        <h2 class="amal-title" :style="ps?.typography?.font_size_h1 ? { fontSize: ps.typography.font_size_h1 + 'px' } : null">
          {{ tdc('Services') }}
        </h2>
      </div>

    </div>


    <!-- GRID SERVIÇOS -->
    <div class="row justify-center">

      <div class="col-md-10 row q-col-gutter-lg">

        <div
          class="col-md-4 col-sm-6 col-12 reveal"
          v-for="s in services"
          :key="s.title"
        >

          <div class="amal-card service-card">

            <div class="icon-wrapper">
              <q-icon
                :name="s.icon"
                size="40px"
              />
            </div>

            <div class="service-title">
              {{ tdc(s.title) }}
            </div>

            <div class="service-desc">
              {{ tdc(s.desc) }}
            </div>

          </div>

        </div>

      </div>

    </div>

  </section>
</template>


<script>
import { defineComponent, computed, onMounted } from "vue"
import { tdc,useUserStore } from "quasar_resaas"

export default defineComponent({

  setup () {

    const User =useUserStore()

    const ps = computed(() => User.ps || {})

    const services = [

      {
        icon: "monitor_heart",
        title: 'Cardiology',
        desc: 'Diagnosis and treatment of cardiovascular disease'
      },

      {
        icon: "visibility",
        title: "Oftalmologia",
        desc: 'Complete care for vision and eye health'
      },

      {
        icon: "psychology",
        title: "Neurologia",
        desc: 'Specialised treatment of the nervous system'
      },

      {
        icon: "healing",
        title: "Ortopedia",
        desc: 'Treatment of muscle and bone injuries'
      },

      {
        icon: "pregnant_woman",
        title: "Maternidade",
        desc: 'Complete pregnancy care'
      },

      {
        icon: "biotech",
        title: 'Laboratory exams',
        desc: 'Clinical analyses and laboratory diagnostics'
      }

    ]


    onMounted(() => {

      const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {
            entry.target.classList.add("active")
          }

        })

      }, { threshold: 0.2 })


      document.querySelectorAll(".reveal").forEach(el => {
        observer.observe(el)
      })

    })


    return {
      ps,
      tdc,
      services
    }

  }

})
</script>


<style scoped>
.service-card{
  padding:32px 24px;
  text-align:center;
  transition:transform .3s ease, background .3s ease;
}
.service-card:hover{
  transform:translateY(-6px);
  background:rgba(255, 255, 255, .18) !important;
}
.icon-wrapper{
  width:64px;
  height:64px;
  margin:0 auto 16px;
  display:flex;
  align-items:center;
  justify-content:center;
  border-radius:calc(var(--amal-radius) + 2px);
  background:#ffffff;
  color:var(--amal-primary);
}
.service-title{
  font-size:18px;
  font-weight:700;
  margin-bottom:8px;
}
.service-desc{
  font-size:14px;
  line-height:1.55;
  opacity:.9;
}
/* SCROLL ANIMATION */
.reveal{
  opacity:0;
  transform:translateY(40px);
  transition:opacity .6s ease, transform .6s ease;
}
.reveal.active{
  opacity:1;
  transform:translateY(0);
}
</style>
