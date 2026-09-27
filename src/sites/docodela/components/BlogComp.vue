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
            v-for="post in posts"
            :key="post.id"
            class="col-md-4 col-sm-6 col-12"
          >
            <s-card
              class="post"
              tabindex="0"
              role="button"
              @click="openPost(post)"
              @keyup.enter="openPost(post)"
            >
              <q-img :src="post.image" :ratio="16 / 10" class="post__image">
                <div class="post__category">{{ tdc(post.category) }}</div>
              </q-img>

              <div class="post__body">
                <div class="post__title">{{ tdc(post.title) }}</div>
                <div class="post__excerpt">{{ tdc(post.excerpt) }}</div>

                <div class="post__meta">
                  <span><q-icon name="event" size="14px" class="q-mr-xs" />{{ post.date }}</span>
                  <span><q-icon name="schedule" size="14px" class="q-mr-xs" />{{ tdc(post.read_time) }}</span>
                </div>
              </div>
            </s-card>
          </div>
        </div>

      </div>
    </div>

    <!-- MODAL ARTIGO -->
    <q-dialog v-model="postModal">

      <s-modal-card :title="tdc(selectedPost.title)" width="600px">
        <q-img :src="selectedPost.image" height="200px" />

        <div class="text-caption text-grey q-mt-sm">
          {{ tdc(selectedPost.category) }} • {{ selectedPost.date }}
        </div>

        <div class="text-body1 q-mt-md">
          {{ tdc(selectedPost.content) }}
        </div>

        <template #footer>
          <s-btn
            flat
            no-caps
            :label="tdc('Close')"
            v-close-popup
          />
        </template>
      </s-modal-card>

    </q-dialog>

  </section>
</template>


<script>
import { defineComponent, ref } from "vue"
import { tdc } from "quasar_resaas"

export default defineComponent({

  setup () {

    const postModal = ref(false)
    const selectedPost = ref({})

    const posts = [

      {
        id:1,
        title:'The importance of regular check-ups',
        category:'Prevention',
        excerpt:'Having regular exams helps prevent disease...',
        content:'Check-ups allow problems to be identified early and increase the chances of effective treatment.',
        date:"10 Mar 2026",
        read_time:'5 min',
        image:"https://images.unsplash.com/photo-1584515933487-779824d29309?w=900&q=70&auto=format&fit=crop"
      },

      {
        id:2,
        title:'Taking care of your heart',
        category:'Cardiology',
        excerpt:'Learn how to keep your heart healthy...',
        content:'A balanced diet and regular physical exercise are essential.',
        date:"05 Mar 2026",
        read_time:"4 min",
        image:"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&q=70&auto=format&fit=crop"
      },

      {
        id:3,
        title:'Mental health in everyday life',
        category:'Psychology',
        excerpt:'Tips for looking after your mental health...',
        content:'Sleeping well, avoiding stress and seeking help are essential.',
        date:"01 Mar 2026",
        read_time:"6 min",
        image:"https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=900&q=70&auto=format&fit=crop"
      }

    ]


    function openPost (post) {

      selectedPost.value = post
      postModal.value = true

    }


    return {
      tdc,
      posts,
      postModal,
      selectedPost,
      openPost
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
  flex-direction: column;
  overflow: hidden;
  cursor: pointer;
  border-radius: 20px !important;
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
