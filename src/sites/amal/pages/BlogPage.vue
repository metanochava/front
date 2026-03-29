<template>
  <section
    id="blog"
    class="blog-section q-py-xl"
  >

    <!-- TITULO -->
    <div class="row justify-center q-mb-xl">

      <div class="text-center col-12">

        <div
          class="text-weight-bold text-primary"
          style="font-size:40px"
        >
          {{ tdc('Blog de Saúde') }}
        </div>

        <div class="text-grey-7 q-mt-sm">
          Dicas médicas, prevenção e bem-estar
        </div>

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
                {{ post.category }}
              </div>

              <!-- TITULO -->
              <div class="text-h6 q-mt-sm">
                {{ post.title }}
              </div>

              <!-- DESCRIÇÃO -->
              <div class="text-grey-7 q-mt-sm">
                {{ post.excerpt }}
              </div>

              <!-- META -->
              <div class="row justify-between items-center q-mt-md text-caption text-grey">

                <span>{{ post.date }}</span>
                <span>{{ post.read_time }}</span>

              </div>

            </q-card-section>

          </s-card>

        </div>

      </div>

    </div>



    <!-- MODAL ARTIGO -->
    <q-dialog v-model="postModal">

      <s-card class="post-modal">

        <q-img
          :src="selectedPost.image"
          height="200px"
        />

        <q-card-section>

          <div class="text-h5 text-weight-bold">
            {{ selectedPost.title }}
          </div>

          <div class="text-caption text-grey q-mt-xs">
            {{ selectedPost.category }} • {{ selectedPost.date }}
          </div>

        </q-card-section>

        <q-card-section class="text-body1">

          {{ selectedPost.content }}

        </q-card-section>

        <s-card-actions align="center">

          <q-btn
            flat
            label="Fechar"
            v-close-popup
          />

        </s-card-actions>

      </s-card>

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
        title:"Importância do Check-up Regular",
        category:"Prevenção",
        excerpt:"Realizar exames regulares ajuda a prevenir doenças...",
        content:"Check-ups permitem identificar problemas precocemente e aumentar as chances de tratamento eficaz.",
        date:"10 Mar 2026",
        read_time:"5 min",
        image:"https://images.unsplash.com/photo-1584515933487-779824d29309"
      },

      {
        id:2,
        title:"Cuidados com o Coração",
        category:"Cardiologia",
        excerpt:"Saiba como manter o seu coração saudável...",
        content:"Uma alimentação equilibrada e prática de exercícios físicos são fundamentais.",
        date:"05 Mar 2026",
        read_time:"4 min",
        image:"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d"
      },

      {
        id:3,
        title:"Saúde Mental no Dia-a-dia",
        category:"Psicologia",
        excerpt:"Dicas para cuidar da sua saúde mental...",
        content:"Dormir bem, evitar stress e procurar ajuda são essenciais.",
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

  padding-top:80px;
  padding-bottom:80px;

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

.post-modal{

  max-width:600px;

  border-radius:20px;

}

</style>
