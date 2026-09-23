<template>
  <section id="guides" class="q-py-lg q-pa-md" style="padding-top:60px; padding-bottom:60px; background-color:#fff;">

    <div class="row justify-center">
      <div class="col-md-10 col-12">

        <div class="text-weight-bold text-grey-9 q-mb-md" style="font-size:24px">
          {{ tdc('Popular finance guides') }}
        </div>

        <div class="row q-col-gutter-md">
          <div v-for="guide in guides" :key="guide.slug" class="col-md-4 col-sm-6 col-12">
            <router-link class="guide-link" :to="{ name: 'guia', params: { slug: guide.slug } }">
              <q-icon name="menu_book" size="20px" color="primary" class="q-mr-sm" />
              {{ tdc(guide.title) }}
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

export default defineComponent({

  setup () {

    const guides = [
      { title: 'Dental implants finance', slug: 'dental-implants-finance' },
      { title: 'Treatment payment plans and credit checks', slug: 'treatment-payment-plans-credit-checks' },
      { title: 'Cosmetic surgery finance with bad credit', slug: 'cosmetic-surgery-finance-bad-credit' },
      { title: 'Treatment finance with bad credit', slug: 'treatment-finance-bad-credit' },
      { title: 'How treatment finance works', slug: 'how-treatment-finance-works' },
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
