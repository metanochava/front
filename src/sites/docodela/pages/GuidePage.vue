<template>
  <div class="guide-page" data-test="docodela-guide">
    <div class="row justify-center q-px-md">
      <article class="col-md-7 col-12">

        <a href="#" class="guide-back" data-test="guide-back" @click.prevent="backToGuides">
          <q-icon name="arrow_back" size="16px" /> {{ tdc('Back to guides') }}
        </a>

        <div class="guide-eyebrow">{{ tdc('Guide') }} {{ guide.number }} · {{ tdc(guide.category) }}</div>
        <h1 class="guide-title">{{ tdc(guide.title) }}</h1>

        <ArticleBody :blocks="guide.blocks" :closing="guide.closing" />

        <div class="row q-gutter-sm q-mt-lg">
          <s-btn unelevated no-caps color="primary" icon="calculate" :label="tdc('Assess financing')" :to="{ name: 'calculadora' }" />
          <s-btn outline no-caps color="primary" icon="support_agent" :label="tdc('Talk to a consultant')" :to="{ name: 'contacto' }" />
        </div>

        <!-- the other guides -->
        <div class="guide-others">
          <div class="guide-others__title">{{ tdc('Other guides') }}</div>
          <router-link
            v-for="other in others" :key="other.slug"
            class="guide-others__link"
            :to="{ name: 'guia', params: { slug: other.slug } }"
          >
            <q-icon :name="other.icon" size="18px" class="q-mr-sm" />
            <span>{{ tdc('Guide') }} {{ other.number }} · {{ tdc(other.title) }}</span>
          </router-link>
        </div>

      </article>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, watch, nextTick } from "vue"
import { useRoute, useRouter } from "vue-router"
import { tdc } from "quasar_resaas"
import { guides, guideBySlug } from "../guides"
import ArticleBody from "../components/ArticleBody.vue"

export default defineComponent({

  components: { ArticleBody },

  setup () {

    const route = useRoute()
    const router = useRouter()

    // an unknown slug (e.g. an old link) opens the first guide
    const guide = computed(() => guideBySlug(route.params.slug) || guides[0])
    const others = computed(() => guides.filter(item => item.slug !== guide.value.slug))

    watch(() => route.params.slug, () => window.scrollTo({ top: 0 }))

    async function backToGuides () {
      await router.push({ name: 'home' })
      await nextTick()
      document.getElementById('guides')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    return {
      tdc,
      guide,
      others,
      backToGuides,
    }

  }

})
</script>

<style scoped>
.guide-page {
  padding: 100px 0;
  background: #fff;
  color: #10233f;
}

.guide-back {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #185A9D;
  text-decoration: none;
}

.guide-eyebrow {
  margin-top: 24px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: #1f8f6b;
}

.guide-title {
  margin: 8px 0 24px;
  font-size: clamp(28px, 3vw, 38px);
  font-weight: 800;
  line-height: 1.2;
}

.guide-others {
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid #e3ebf5;
}

.guide-others__title {
  margin-bottom: 12px;
  font-weight: 700;
}

.guide-others__link {
  display: flex;
  align-items: center;
  padding: 10px 0;
  color: #185A9D;
  text-decoration: none;
  font-weight: 600;
}

.guide-others__link:hover span { text-decoration: underline; }

.body--dark .guide-page { background: #121212; color: #eef2f7; }
.body--dark .guide-others { border-top-color: #2c3440; }
</style>
