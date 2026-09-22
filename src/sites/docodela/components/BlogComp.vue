<template>
  <section
    id="blog"
    class="blog-section q-py-xl q-pa-md"

  >
    <!-- TITULO -->
    <div class="row justify-center q-mb-xl">

      <div class="text-center col-12">

        <div
          class="text-weight-bold text-white"
          style="font-size:40px"
        >
          {{ tdc('Health blog') }}
        </div>
      </div>
    </div>

    <!-- POSTS -->
    <div class="row justify-center ">
      <div class="col-md-12 row q-col-gutter-lg">
        <div
          v-for="post in posts"
          :key="post.id"
          class="col-md-4 col-sm-6 col-12"
        >

          <s-card
            class="blog-card"
            @click="openPost(post)"
          >

            <!-- IMAGEM -->
            <q-img
              :src="post.image"
              height="180px"
              class="rounded-top"
            />

            <q-card-section>

              <!-- CATEGORIA -->
              <div class="text-caption text-primary text-weight-bold">
                {{ tdc(post.category) }}
              </div>

              <!-- TITULO -->
              <div class="text-h6 q-mt-sm">
                {{ tdc(post.title) }}
              </div>

              <!-- DESCRIÇÃO -->
              <div class="text-grey-7 q-mt-sm">
                {{ tdc(post.excerpt) }}
              </div>

              <!-- META -->
              <div class="row justify-between items-center q-mt-md text-caption text-grey">

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
        image:"https://images.unsplash.com/photo-1584515933487-779824d29309"
      },

      {
        id:2,
        title:'Taking care of your heart',
        category:'Cardiology',
        excerpt:'Learn how to keep your heart healthy...',
        content:'A balanced diet and regular physical exercise are essential.',
        date:"05 Mar 2026",
        read_time:"4 min",
        image:"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d"
      },

      {
        id:3,
        title:'Mental health in everyday life',
        category:'Psychology',
        excerpt:'Tips for looking after your mental health...',
        content:'Sleeping well, avoiding stress and seeking help are essential.',
        date:"01 Mar 2026",
        read_time:"6 min",
        image:"https://images.unsplash.com/photo-1493836512294-502baa1986e2"
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

.blog-section{

  background:
  linear-gradient(
    135deg,
    #43CEA2,
    #185A9D
  );
}


/* CARD */

.blog-card{

  border-radius:20px;

  overflow:hidden;

  cursor:pointer;

  transition:all .3s;

  box-shadow:
  0 10px 25px rgba(0,0,0,.15);

}

.blog-card:hover{

  transform:translateY(-8px) scale(1.02);

}


/* MODAL */


</style>
