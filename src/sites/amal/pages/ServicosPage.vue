<template>
  <section
    id="servicos"
    class="servicos q-py-xl"
  >

    <!-- TITULO -->
    <div class="row justify-center q-mb-xl">

      <div
        class="text-weight-bold text-primary text-center col-12"
        :style="{ fontSize: ps?.typography?.font_size_h1 + 'px' }"
      >
        {{ tdc('Services') }}
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

          <div class="service-card">

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

.servicos{

  padding-top:80px;
  padding-bottom:80px;

  border-top:6px solid var(--q-primary);

  background:
  linear-gradient(
    135deg,
    #43CEA2,
    #185A9D
  );

}


/* CARD */

.service-card{

  background:rgba(255,255,255,.12);

  backdrop-filter:blur(12px);

  padding:35px;

  border-radius:22px;

  text-align:center;

  color:white;

  transform-style:preserve-3d;

  transition:all .35s ease;

  box-shadow:
  0 12px 30px rgba(0,0,0,.2);

}


.service-card:hover{

  transform:
  perspective(800px)
  rotateX(6deg)
  rotateY(-6deg)
  translateY(-10px);

}


/* ICON */

.icon-wrapper{

  width:70px;
  height:70px;

  margin:auto;

  display:flex;
  align-items:center;
  justify-content:center;

  border-radius:50%;

  background:white;

  color:var(--q-primary);

  margin-bottom:16px;

}


/* TITULO */

.service-title{

  font-size:18px;
  font-weight:600;

  margin-bottom:12px;

}


/* DESC */

.service-desc{

  font-size:14px;

  opacity:.9;

}


/* SCROLL ANIMATION */

.reveal{

  opacity:0;

  transform:translateY(40px);

  transition:all .7s ease;

}

.reveal.active{

  opacity:1;

  transform:translateY(0);

}

</style>
