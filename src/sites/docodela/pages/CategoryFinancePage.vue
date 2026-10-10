<template>
  <div class="cat-page" style="padding-top:100px; padding-bottom:100px;">

    <div class="row justify-center q-px-md">
      <div class="col-md-6 col-12 text-center">

        <q-icon :name="category.icon" size="56px" color="white" class="q-mb-md" />

        <div class="text-weight-bold text-white" style="font-size:40px">
          {{ tdc(category.label) }}
        </div>

        <p class="text-white q-mt-md" style="font-size:20px; opacity:.9">
          {{ tdc(category.desc) }}
        </p>

        <div class="row justify-center q-gutter-md q-mt-lg">
          <s-btn
            color="white"
            text-color="primary"
            :label="tdc(category.primaryLabel)"
            :to="{ name: category.primaryRoute }"
          />
          <s-btn
            outline
            color="white"
            text-color="white"
            :label="tdc('Read FAQs')"
            :to="{ name: 'faqs' }"
          />
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { defineComponent, computed } from "vue"
import { useRoute } from "vue-router"
import { tdc } from "quasar_resaas"
import { categories } from "../categories"

export default defineComponent({

  setup () {

    const route = useRoute()

    const category = computed(() => categories[route.params.categoria] || categories['consultas-medicas'])

    return {
      tdc,
      category,
    }

  }

})
</script>

<style scoped>
.cat-page {
  background: linear-gradient(135deg, #023f2b, #185A9D);
  min-height: 60vh;
}
</style>
