<template>

<div class="inicio">

  <section class="amal-section inicio-hero">
    <div class="row justify-center">
      <div class="col-12 col-md-10 row items-center q-col-gutter-xl">

        <div class="col-md-6 col-12">
          <div class="amal-eyebrow">{{ tdc('Modern, humane care') }}</div>

          <h1
            class="inicio-title"
            :style="ps?.typography?.font_size_h1 ? { fontSize: (ps.typography.font_size_h1 * 1.6) + 'px' } : null"
          >
            {{ tdc('WE CARE') }}
            <span class="inicio-cross">+</span>
            {{ tdc('UP CLOSE') }}
          </h1>

          <p
            class="inicio-text amal-muted"
            :style="ps?.typography?.font_size_h5 ? { fontSize: ps.typography.font_size_h5 + 'px' } : null"
          >
            {{ tdc('Humane care, qualified specialists, modern technology and simple booking for consultations, exams and check-ups.') }}
          </p>

          <ul class="inicio-highlights">
            <li v-for="item in highlights" :key="item.label">
              <span class="amal-icon inicio-highlight-icon"><q-icon :name="item.icon" size="20px" /></span>
              {{ tdc(item.label) }}
            </li>
          </ul>

          <div class="row q-gutter-sm q-mt-lg">
            <s-btn
              unelevated
              no-caps
              color="primary"
              size="lg"
              icon="event"
              class="amal-btn"
              :label="tdc('Book appointment')"
              @click="scrollTo('marcacao')"
            />

            <s-btn
              outline
              no-caps
              color="primary"
              size="lg"
              class="amal-btn"
              :label="tdc('View specialties')"
              @click="scrollTo('especialidades')"
            />
          </div>

          <div class="row q-col-gutter-md q-mt-lg">
            <div v-for="info in contacts" :key="info.label" class="col-sm-6 col-12">
              <div class="amal-card inicio-info">
                <span class="amal-icon"><q-icon :name="info.icon" size="22px" /></span>
                <div>
                  <div class="inicio-info-label amal-muted">{{ tdc(info.label) }}</div>
                  <div class="inicio-info-value">{{ info.translate ? tdc(info.value) : info.value }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-12">
          <ReviewPage />
        </div>

      </div>
    </div>
  </section>


  <!-- CONTADORES -->
  <section v-if="counters.length" class="amal-section amal-section--surface inicio-counters" data-test="site-stats">
    <div class="row justify-center">
      <div class="col-12 col-md-10 row q-col-gutter-lg">
        <div
          v-for="c in counters"
          :key="c.label"
          :class="['col-6', counterCol]"
        >
          <div class="amal-card counter-card text-center">
            <div class="counter-number">{{ c.value }}</div>
            <div class="counter-label amal-muted">{{ tdc(c.label) }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>

</div>

</template>

<script>

import { defineComponent, computed, ref, onMounted } from "vue"
import { tdc, useUserStore, HTTPClient, url } from "quasar_resaas"
import ReviewPage from "./ReviewPage.vue"

export default defineComponent({

components:{
  ReviewPage
},

setup(){

const User =useUserStore()
const ps = computed(()=>User.ps || {})

const highlights=[
{icon:'schedule',label:'Open 24 hours'},
{icon:'pregnant_woman',label:'Maternity and operating theatre'},
{icon:'medical_services',label:'Consultations in different specialties'}
]

const contacts=[
{icon:'call',label:'Phone',value:'+258 86 555 0550'},
{icon:'location_on',label:'Location',value:'Maputo, Mozambique',translate:true}
]

// the figures come from the clinic's own records (GET saude/publicsite/stats/,
// public - the clinic is found from this site's Origin); a figure the clinic
// has not recorded (e.g. years without a founding date) is not shown
const stats = ref(null)

const COUNTERS = [
{key:'patients',label:'Patients'},
{key:'specialists',label:'Specialists'},
{key:'specialties',label:'Specialties'},
{key:'years_of_experience',label:'Years of experience'}
]

const counters = computed(() =>
COUNTERS
.filter(c => typeof stats.value?.[c.key] === 'number')
.map(c => ({ label: c.label, value: stats.value[c.key] }))
)

// 4 figures: a row of 4 on desktop; fewer: they share the row
const counterCol = computed(() => `col-md-${12 / Math.max(counters.value.length, 1)}`)

onMounted(async () => {
try {
const response = await HTTPClient.get(url({ type: 'u', url: 'saude/publicsite/stats/' }))
stats.value = response.data && typeof response.data === 'object' ? response.data : null
} catch {
stats.value = null
}
})

// both buttons had no action: the site is one page, so they lead to their section
function scrollTo (id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

return{
User,
ps,
tdc,
counters,
counterCol,
highlights,
contacts,
scrollTo
}

}

})

</script>

<style scoped>

.inicio-hero{
padding-top:72px;
}

.inicio-title{
margin:18px 0 0;
font-size:clamp(36px, 4.6vw, 58px);
line-height:1.04;
font-weight:800;
letter-spacing:-.02em;
color:var(--amal-text);
}

.inicio-cross{
color:var(--q-negative, #e60000);
margin:0 6px;
}

.inicio-text{
margin:18px 0 0;
max-width:560px;
font-size:18px;
line-height:1.65;
}

.inicio-highlights{
list-style:none;
margin:22px 0 0;
padding:0;
display:grid;
gap:12px;
}
.inicio-highlights li{
display:flex;
align-items:center;
gap:12px;
font-weight:600;
font-size:16px;
}
.inicio-highlight-icon{
width:36px;
height:36px;
}

.inicio-info{
display:flex;
align-items:center;
gap:14px;
padding:14px 16px;
}
.inicio-info-label{
font-size:12px;
font-weight:600;
text-transform:uppercase;
letter-spacing:.06em;
}
.inicio-info-value{
font-weight:700;
}

.inicio-counters{
padding-top:56px;
padding-bottom:56px;
}
.counter-card{
padding:24px 12px;
}
.counter-number{
font-size:clamp(30px, 3vw, 40px);
font-weight:800;
line-height:1.1;
background:var(--amal-gradient);
-webkit-background-clip:text;
background-clip:text;
color:transparent;
}
.counter-label{
margin-top:6px;
font-size:15px;
font-weight:600;
}

</style>
