<template>
  <section id="guides" class="q-py-lg q-pa-md" style="padding-top:60px; padding-bottom:60px; background-color:#fff;">

    <div class="row justify-center">
      <div class="col-md-10 col-12">

        <div class="text-weight-bold text-grey-9 q-mb-md" style="font-size:24px">
          {{ tdc('Popular finance guides') }}
        </div>

        <div class="row q-col-gutter-md">
          <div v-for="guide in guides" :key="guide.title" class="col-md-4 col-sm-6 col-12">
            <a class="guide-link" href="#faqs">
              <q-icon name="menu_book" size="20px" color="primary" class="q-mr-sm" />
              {{ tdc(guide.title) }}
            </a>
          </div>
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

    const guides = [
      { title: 'Dental implants finance' },
      { title: 'Treatment payment plans and credit checks' },
      { title: 'Cosmetic surgery finance with bad credit' },
      { title: 'Treatment finance with bad credit' },
      { title: 'How treatment finance works' },
    ]

    return {
      tdc,
      guides,
    }

  }

})
</script>

<style scoped>
.guide-link {
  display: flex;
  align-items: center;
  color: #185A9D;
  text-decoration: none;
  font-weight: 600;
}

.guide-link:hover {
  text-decoration: underline;
}
</style>
