<template>
  <section
    id="blog"
    class="blog-section amal-section"
  >

    <!-- TITULO -->
    <div class="row justify-center q-mb-xl">

      <div class="text-center col-12">
        <h2 class="amal-title" :style="ps?.typography?.font_size_h1 ? { fontSize: ps.typography.font_size_h1 + 'px' } : null">
          {{ tdc('Health blog') }}
        </h2>
        <p class="amal-subtitle">
          {{ tdc('Medical tips, prevention and well-being') }}
        </p>
      </div>

    </div>


    <!-- POSTS -->
    <div class="row justify-center">

      <div class="col-md-10 row q-col-gutter-lg">

        <div
          v-for="post in posts"
          :key="post.id"
          class="col-md-4 col-sm-6 col-12"
        >

          <s-card
            class="amal-card amal-card--hover blog-card"
            tabindex="0"
            role="button"
            @click="openPost(post)"
            @keyup.enter="openPost(post)"
          >

            <!-- IMAGEM -->
            <q-img
              :src="post.image"
              :ratio="16 / 10"
              class="blog-image"
            />

            <q-card-section>

              <!-- CATEGORIA -->
              <div class="amal-eyebrow blog-category">
                {{ tdc(post.category) }}
              </div>

              <!-- TITULO -->
              <div class="text-h6 text-weight-bold q-mt-sm blog-title">
                {{ tdc(post.title) }}
              </div>

              <!-- DESCRIÇÃO -->
              <div class="amal-muted q-mt-sm">
                {{ tdc(post.excerpt) }}
              </div>

              <!-- META -->
              <div class="row justify-between items-center q-mt-md text-caption amal-muted">

                <span>{{ post.date }}</span>
                <span>{{ tdc(post.read_time) }}</span>

              </div>

            </q-card-section>

          </s-card>

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
          <q-btn
            flat
            :label="tdc('Close')"
            v-close-popup
          />
        </template>
      </s-modal-card>

    </q-dialog>

  </section>
</template>


<script>
import { defineComponent, ref, computed } from "vue"
import { tdc, useUserStore } from "quasar_resaas"

export default defineComponent({

  setup () {

    // the title reads the Entity typography (ps)
    const User = useUserStore()
    const ps = computed(() => User.ps || {})

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
        image:"https://images.unsplash.com/photo-1584515933487-779824d29309?w=900&q=75&auto=format&fit=crop"
      },

      {
        id:2,
        title:'Taking care of your heart',
        category:'Cardiology',
        excerpt:'Learn how to keep your heart healthy...',
        content:'A balanced diet and regular physical exercise are essential.',
        date:"05 Mar 2026",
        read_time:"4 min",
        image:"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&q=75&auto=format&fit=crop"
      },

      {
        id:3,
        title:'Mental health in everyday life',
        category:'Psychology',
        excerpt:'Tips for looking after your mental health...',
        content:'Sleeping well, avoiding stress and seeking help are essential.',
        date:"01 Mar 2026",
        read_time:"6 min",
        image:"https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=900&q=75&auto=format&fit=crop"
      }

    ]


    function openPost (post) {

      selectedPost.value = post
      postModal.value = true

    }


    return {
      tdc,
      ps,
      posts,
      postModal,
      selectedPost,
      openPost
    }

  }

})
</script>


<style scoped>
.blog-card{
  overflow:hidden;
  cursor:pointer;
}
.blog-category{
  padding:4px 10px;
  font-size:11px;
}
.blog-title{
  line-height:1.3;
}
</style>
