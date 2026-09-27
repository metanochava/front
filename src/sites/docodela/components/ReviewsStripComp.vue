<template>
  <section id="reviews" class="reviews" data-test="docodela-reviews">
    <div class="row justify-center">
      <div class="col-12 col-md-10">

        <div class="text-center q-mb-xl">
          <div class="section-eyebrow">{{ tdc('Testimonials') }}</div>
          <h2 class="section-title">{{ tdc('What our patients say') }}</h2>
        </div>

        <div class="row q-col-gutter-lg">
          <div v-for="review in reviews" :key="review.name" class="col-12 col-md-4">
            <s-card class="review">
              <q-icon name="format_quote" size="36px" class="review__quote" />
              <div class="row q-mb-sm">
                <q-icon v-for="n in 5" :key="n" name="star" color="amber" size="18px" />
              </div>
              <p class="review__text">{{ tdc(review.text) }}</p>
              <div class="review__author">
                <div class="review__avatar">{{ review.name.charAt(0) }}</div>
                <div class="review__name">{{ review.name }}</div>
              </div>
            </s-card>
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
.reviews {
  padding: 88px 16px;
  background: #f4f8fc;
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

.review {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 28px;
  border-radius: 20px !important;
  background: #fff;
  border: 1px solid #e3ebf5;
  box-shadow: 0 12px 30px rgba(16, 35, 63, .06) !important;
}

.review__quote {
  position: absolute;
  top: 18px;
  right: 20px;
  color: #d7e6f6;
}

.review__text {
  flex: 1;
  margin: 8px 0 20px;
  font-size: 16px;
  line-height: 1.6;
  color: #374151;
}

.review__author {
  display: flex;
  align-items: center;
  gap: 12px;
}
.review__avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(135deg, #185a9d, #1f8f6b);
}
.review__name {
  font-weight: 700;
  color: #10233f;
}

@media (max-width: 599px) {
  .reviews {
    padding: 56px 16px;
  }
}
</style>
