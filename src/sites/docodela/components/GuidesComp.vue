<template>
  <section id="guides" class="guides">

    <div class="row justify-center">
      <div class="col-md-10 col-12">

        <div class="guides__title">
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
.guides {
  padding: 56px 16px 72px;
  background: #fff;
}

.guides__title {
  margin-bottom: 16px;
  font-size: 22px;
  font-weight: 800;
  color: #10233f;
}

.guide-link {
  display: flex;
  height: 100%;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid #e3ebf5;
  transition: border-color .2s, background .2s;
  align-items: center;
  color: #185A9D;
  text-decoration: none;
  font-weight: 600;
}

.guide-link:hover {
  border-color: #b9d3ee;
  background: #f4f8fc;
}
</style>
