<template>
  <section id="reviews" class="reviews-section q-py-xl q-pa-md" style="padding-top:100px; padding-bottom:100px; background-color:#fff;">

    <div class="row justify-center q-mb-xl">
      <div class="text-center col-12">
        <div class="text-weight-bold text-grey-9" style="font-size:40px">
          {{ tdc('What our patients say') }}
        </div>
      </div>
    </div>

    <div class="row justify-center">
      <div class="col-md-10 col-12 row q-col-gutter-lg">
        <div v-for="review in reviews" :key="review.name" class="col-md-4 col-12">
          <s-card class="review-card q-pa-lg">
            <div class="row q-mb-sm">
              <q-icon v-for="n in 5" :key="n" name="star" color="amber" size="20px" />
            </div>
            <div class="text-body1 text-grey-8">
              {{ tdc(review.text) }}
            </div>
            <div class="text-weight-bold text-primary q-mt-md">
              {{ review.name }}
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

    // representative reviews, not scraped from any third-party review platform
    const reviews = [
      {
        name: 'Amélia',
        text: 'The payment plan made it possible for me to get treatment straight away instead of waiting and saving up.'
      },
      {
        name: 'Jorge',
        text: 'Friendly staff and a simple application - I had an answer the same day.'
      },
      {
        name: 'Fátima',
        text: 'Clear terms from the start, no surprises on my monthly payment.'
      }
    ]

    return {
      tdc,
      reviews,
    }

  }

})
</script>

<style scoped>
.review-card {
  border-radius: 20px;
  height: 100%;
}
</style>
