<template>

<!-- id: the header menu's "Testimonials" (#depoimentos) target. The reviews are
     the clinic's Google reviews (public site/reviews/); without them the section
     is not shown - no invented testimonials. -->
<div v-if="reviews.length" id="depoimentos" class="depoimentos amal-section" data-test="google-reviews">

  <div class="row justify-center q-mb-lg q-px-md">
      <div class="text-center col-12">
        <div class="amal-eyebrow">{{ tdc('Testimonials') }}</div>
        <h2 class="amal-title" :style="ps?.typography?.font_size_h1 ? { fontSize: ps.typography.font_size_h1 + 'px' } : null">
          {{ tdc('Patient testimonials') }}
        </h2>

        <!-- overall rating on Google -->
        <a v-if="summary.rating" :href="summary.url" target="_blank" rel="noopener" class="google-summary">
          <span class="google-summary__rating">{{ Number(summary.rating).toFixed(1) }}</span>
          <span class="stars">
            <q-icon v-for="n in 5" :key="n" :name="starIcon(summary.rating, n)" size="20px" color="amber" />
          </span>
          <span class="google-summary__total">{{ summary.total }} {{ tdc('reviews on Google') }}</span>
        </a>
      </div>
  </div>

  <q-carousel
    v-model="slide"
    animated
    arrows
    navigation
    autoplay
    infinite
    height="360px"
    control-color="primary"
    class="bg-transparent"
  >

    <q-carousel-slide
      v-for="(group, i) in groups"
      :key="i"
      :name="i"
      class="row justify-center items-center q-col-gutter-lg"
    >

      <div
        v-for="review in group"
        :key="review.author + review.time"
        class="col-md-5 col-12"
      >

        <div class="amal-card testimonial-card">
          <q-icon name="format_quote" size="40px" class="testimonial-quote" />

          <!-- author, as Google attributes it -->
          <a :href="review.author_url" target="_blank" rel="noopener" class="testimonial-author">
            <q-avatar size="56px">
              <img v-if="review.photo" :src="review.photo" :alt="review.author" referrerpolicy="no-referrer">
              <span v-else class="testimonial-initial">{{ review.author.charAt(0) }}</span>
            </q-avatar>
            <div class="text-left">
              <div class="text-weight-bold">{{ review.author }}</div>
              <div class="text-caption testimonial-time">{{ review.relative_time }}</div>
            </div>
          </a>

          <div class="stars q-mt-sm">
            <q-icon v-for="n in 5" :key="n" name="star" size="20px" :color="n <= review.rating ? 'amber' : 'grey-5'" />
          </div>

          <!-- the review as written (Google may translate it to the language asked) -->
          <div class="testimonial-text q-mt-sm">"{{ review.text }}"</div>
        </div>

      </div>

    </q-carousel-slide>

  </q-carousel>

  <div class="text-center q-mt-md">
    <a :href="summary.url" target="_blank" rel="noopener" class="google-attribution">
      <q-icon name="open_in_new" size="16px" /> {{ tdc('See all reviews on Google') }}
    </a>
  </div>

</div>

</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { tdc, useUserStore, useLanguageStore, HTTPClient, url } from 'quasar_resaas'

const $q = useQuasar()
const User = useUserStore()
const Language = useLanguageStore()

// the title reads the Entity typography (ps)
const ps = computed(() => User.ps || {})

const slide = ref(0)
const reviews = ref([])
const summary = ref({})

const perSlide = computed(() => ($q.screen.lt.md ? 1 : 2))
const groups = computed(() => {
  const result = []
  for (let i = 0; i < reviews.value.length; i += perSlide.value) {
    result.push(reviews.value.slice(i, i + perSlide.value))
  }
  return result
})

function starIcon(rating, n) {
  if (rating >= n) return 'star'
  if (rating >= n - 0.5) return 'star_half'
  return 'star_border'
}

async function load() {
  try {
    const lang = (Language.current?.code || 'pt-pt').split('-')[0]
    const { data } = await HTTPClient.get(url({ type: 'u', url: 'site/reviews/', params: { lang } }))
    summary.value = data || {}
    reviews.value = (data?.reviews || []).filter(review => review.text)
  } catch {
    reviews.value = [] // no reviews: the section stays hidden
  }
}

onMounted(load)
watch(() => Language.current?.code, load)
</script>

<style scoped>
.testimonial-card{
  position:relative;
  padding:28px 26px;
  text-align:center;
  height:100%;
}
.testimonial-quote{
  position:absolute;
  top:16px;
  right:18px;
  color:var(--amal-tint-strong);
}
.testimonial-author{
  display:inline-flex;
  align-items:center;
  gap:12px;
  color:inherit;
  text-decoration:none;
}
.testimonial-initial{
  display:flex;
  align-items:center;
  justify-content:center;
  width:100%;
  height:100%;
  font-weight:700;
  color:var(--amal-on-brand);
  background:var(--amal-primary);
}
.testimonial-time{
  color:var(--amal-muted);
}
.testimonial-text{
  font-size:16px;
  line-height:1.6;
  font-style:italic;
  display:-webkit-box;
  -webkit-line-clamp:5;
  -webkit-box-orient:vertical;
  overflow:hidden;
}
.stars{
  display:flex;
  justify-content:center;
  gap:3px;
}
.google-summary{
  display:inline-flex;
  align-items:center;
  gap:10px;
  margin-top:12px;
  padding:8px 16px;
  border-radius:999px;
  color:inherit;
  text-decoration:none;
  background:var(--amal-tint);
}
.google-summary__rating{
  font-size:22px;
  font-weight:800;
}
.google-summary__total,
.google-attribution{
  font-size:14px;
  color:var(--amal-muted);
}
.google-attribution{
  display:inline-flex;
  align-items:center;
  gap:6px;
  text-decoration:none;
}
.google-attribution:hover{
  color:var(--amal-primary);
}
:deep(.q-carousel__navigation){
  background:transparent;
}
</style>
