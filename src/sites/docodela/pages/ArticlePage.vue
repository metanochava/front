<template>
  <div class="article-page" data-test="docodela-article">
    <div class="row justify-center q-px-md">
      <article class="col-md-7 col-12">

        <router-link :to="{ name: 'blog' }" class="article-back" data-test="article-back">
          <q-icon name="arrow_back" size="16px" /> {{ tdc('Back to the blog') }}
        </router-link>

        <div class="article-eyebrow">
          {{ tdc('Article') }} {{ article.number }} · {{ tdc(article.category) }}
          <span class="article-eyebrow__time">· {{ article.readMinutes }} {{ tdc('min read') }}</span>
        </div>
        <h1 class="article-title">{{ tdc(article.title) }}</h1>

        <q-img :src="article.image" :ratio="16 / 7" class="article-image" />

        <ArticleBody :blocks="article.blocks" :closing="article.closing" />

        <div class="row q-gutter-sm q-mt-lg">
          <s-btn unelevated no-caps color="primary" icon="support_agent" :label="tdc('Talk to a consultant')" :to="{ name: 'contacto' }" />
          <s-btn outline no-caps color="primary" icon="calculate" :label="tdc('Assess financing')" :to="{ name: 'calculadora' }" />
        </div>

        <div class="article-others">
          <div class="article-others__title">{{ tdc('Other articles') }}</div>
          <router-link
            v-for="other in others" :key="other.slug"
            class="article-others__link"
            :to="{ name: 'artigo', params: { slug: other.slug } }"
          >
            <q-icon :name="other.icon" size="18px" class="q-mr-sm" />
            <span>{{ tdc('Article') }} {{ other.number }} · {{ tdc(other.title) }}</span>
          </router-link>
        </div>

      </article>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, watch } from "vue"
import { useRoute } from "vue-router"
import { tdc } from "quasar_resaas"
import { articles, articleBySlug } from "../blog"
import ArticleBody from "../components/ArticleBody.vue"

export default defineComponent({

  components: { ArticleBody },

  setup () {

    const route = useRoute()

    // an unknown slug opens the first article
    const article = computed(() => articleBySlug(route.params.slug) || articles[0])
    const others = computed(() => articles.filter(item => item.slug !== article.value.slug))

    watch(() => route.params.slug, () => window.scrollTo({ top: 0 }))

    return {
      tdc,
      article,
      others,
    }

  }

})
</script>

<style scoped>
.article-page {
  padding: 100px 0;
  background: #fff;
  color: #10233f;
}

.article-back {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #185A9D;
  text-decoration: none;
}

.article-eyebrow {
  margin-top: 24px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: #1f8f6b;
}

.article-eyebrow__time {
  color: #6b7280;
  text-transform: none;
  letter-spacing: 0;
  font-weight: 500;
}

.article-title {
  margin: 8px 0 20px;
  font-size: clamp(28px, 3vw, 38px);
  font-weight: 800;
  line-height: 1.2;
}

.article-image {
  border-radius: 16px;
  margin-bottom: 12px;
}

.article-others {
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid #e3ebf5;
}

.article-others__title {
  margin-bottom: 12px;
  font-weight: 700;
}

.article-others__link {
  display: flex;
  align-items: center;
  padding: 10px 0;
  color: #185A9D;
  text-decoration: none;
  font-weight: 600;
}

.article-others__link:hover span { text-decoration: underline; }

.body--dark .article-page { background: #121212; color: #eef2f7; }
.body--dark .article-others { border-top-color: #2c3440; }
</style>
