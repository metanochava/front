<template>
  <section id="blog" class="blog" data-test="docodela-blog">
    <div class="row justify-center">
      <div class="col-12 col-md-10">

        <div class="text-center q-mb-xl">
          <div class="section-eyebrow">{{ tdc('Articles') }}</div>
          <h2 class="section-title">{{ tdc('Health blog') }}</h2>
        </div>

        <div class="row q-col-gutter-lg">
          <div
            v-for="post in articles"
            :key="post.slug"
            class="col-md-4 col-sm-6 col-12"
          >
            <router-link
              class="post"
              :to="{ name: 'artigo', params: { slug: post.slug } }"
              :data-test="`blog-card-${post.slug}`"
            >
              <q-img :src="post.image" :ratio="16 / 10" class="post__image">
                <div class="post__category">{{ tdc(post.category) }}</div>
              </q-img>

              <div class="post__body">
                <div class="post__title">{{ tdc(post.title) }}</div>
                <div class="post__excerpt">{{ tdc(post.excerpt) }}</div>

                <div class="post__meta">
                  <span><q-icon name="schedule" size="14px" class="q-mr-xs" />{{ post.readMinutes }} {{ tdc('min read') }}</span>
                  <span class="post__more">{{ tdc('Read the article') }} <q-icon name="arrow_forward" size="14px" /></span>
                </div>
              </div>
            </router-link>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>


<script>
import { defineComponent } from "vue"
import { tdc } from "quasar_resaas"
import { articles } from "../blog"

export default defineComponent({

  setup () {
    return {
      tdc,
      articles,
    }
  }

})
</script>


<style scoped>
.blog {
  padding: 88px 16px;
  background: #fff;
}

.section-eyebrow {
  color: #1f8f6b;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.section-title {
  margin: 8px 0 0;
  font-size: clamp(28px, 3.4vw, 42px);
  line-height: 1.15;
  font-weight: 800;
  color: #10233f;
}

.post {
  height: 100%;
  display: flex;
  background: #fff;
  color: inherit;
  text-decoration: none;
  flex-direction: column;
  overflow: hidden;
  cursor: pointer;
  border-radius: 20px;
  border: 1px solid #e3ebf5;
  transition: transform .25s, box-shadow .25s;
}
.post:hover,
.post:focus-visible {
  transform: translateY(-4px);
  box-shadow: 0 18px 40px rgba(16, 35, 63, .12);
  outline: none;
}

.post__image :deep(.q-img__content > div.post__category) {
  position: absolute;
  top: 14px;
  left: 14px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  color: #185a9d;
  background: #fff;
  line-height: 1.4;
}

.post__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
}
.post__title {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.3;
  color: #10233f;
}
.post__excerpt {
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-top: 8px;
  font-size: 14px;
  line-height: 1.55;
  color: #4b5563;
}
.post__meta {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  font-size: 12px;
  color: #6b7280;
}
.post__more {
  font-weight: 600;
  color: #185a9d;
}
.post__meta span {
  display: inline-flex;
  align-items: center;
}

@media (max-width: 599px) {
  .blog {
    padding: 56px 16px;
  }
}
</style>
