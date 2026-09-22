<template>
  <section
    id="ffyt"
    class="blog-section q-py-xl q-pa-md"
    style=" padding-top:100px; padding-bottom: 100px;"
  >

    <!-- TITULO -->
    <div class="row justify-center q-mb-xl">

      <div class="text-center col-12">

        <div
          class="text-weight-bold text-white"
          style="font-size:40px"
        >
          {{ tdc('Finance for your treatment') }}
        </div>

        <div
          class="text-weight-bold text-white"
          style="font-size:20px"
        >
          {{ tdc('Mounthly Payment options across private Healfcare') }}
        </div>

      </div>

    </div>


    <!-- CATEGORIAS -->
    <div class="row justify-center ">

      <div class="col-md-10  col-12 row q-col-gutter-lg">

        <div
          v-for="category in categories"
          :key="category.id"
          class="col-md-3 col-sm-6 col-12"
        >

          <s-card
            class="blog-card text-center q-pa-lg"
            @click="go()"
          >

            <q-icon :name="category.icon" size="46px" color="primary" class="q-mb-md" />

            <div class="text-h6 text-weight-bold">
              {{ tdc(category.label) }}
            </div>

            <div class="row justify-center items-center q-mt-md text-caption text-primary">
              <span>{{ tdc('Explore finance options') }} -&gt;</span>
            </div>

          </s-card>

        </div>

      </div>

    </div>

  </section>
</template>


<script>
import { defineComponent } from "vue"
import { tdc } from "quasar_resaas"

export default defineComponent({

  setup () {

    const categories = [
      { id: 1, icon: 'hearing', label: 'Audiology' },
      { id: 2, icon: 'spa', label: 'Cosmetic surgery' },
      { id: 3, icon: 'biotech', label: 'Diagnostics' },
      { id: 4, icon: 'medical_services', label: 'Dental' },
      { id: 5, icon: 'visibility', label: 'Optometry' },
      { id: 6, icon: 'child_care', label: 'IVF & fertility' },
      { id: 7, icon: 'local_hospital', label: 'Medical' },
    ]

    // every category leads to the same finance FAQ / contact section - real
    // navigation, not a dead link.
    function go () {
      document.getElementById('faqs')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    return {
      tdc,
      categories,
      go,
    }

  }

})
</script>


<style scoped>

.blog-section{

  background:
  linear-gradient(
    135deg,
    #023f2b,
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

</style>
