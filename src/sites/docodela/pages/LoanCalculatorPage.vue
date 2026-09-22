<template>
  <div id="calculadora" class="calc-page" style="padding-top:100px; padding-bottom:100px;">

    <div class="row justify-center q-px-md">
      <div class="col-md-6 col-12">

        <div class="text-weight-bold text-white text-center" style="font-size:40px">
          {{ tdc('Loan calculator') }}
        </div>

        <p class="text-white text-center q-mb-xl" style="font-size:20px; opacity:.9">
          {{ tdc('Spread the cost of your treatment') }}
        </p>

        <s-card class="q-pa-lg calc-card">

          <s-input
            v-model.number="cost"
            type="number"
            filled
            :label="tdc('Treatment cost (MZN)')"
            class="q-mb-md"
          />

          <s-select
            v-model="months"
            filled
            emit-value
            map-options
            :options="monthsOptions"
            :label="tdc('Number of months')"
            class="q-mb-lg"
          />

          <q-separator class="q-mb-lg" />

          <div class="text-center">
            <div class="text-caption text-grey-7">
              {{ tdc('Estimated monthly payment') }}
            </div>
            <div class="text-h3 text-weight-bold text-primary">
              {{ monthlyPayment }} MZN
            </div>
            <div class="text-caption text-grey-6 q-mt-sm">
              {{ tdc('This is an estimate. Final terms depend on approval.') }}
            </div>
          </div>

          <div class="text-center q-mt-lg">
            <s-btn
              color="primary"
              :label="tdc('Enquire now')"
              icon="chat"
              :href="enquireLink"
              target="_blank"
            />
          </div>

        </s-card>

      </div>
    </div>

  </div>
</template>

<script>
import { defineComponent, ref, computed } from "vue"
import { tdc } from "quasar_resaas"

export default defineComponent({

  setup () {

    const cost = ref(10000)
    const months = ref(6)

    const monthsOptions = [
      { label: '3', value: 3 },
      { label: '6', value: 6 },
      { label: '12', value: 12 },
      { label: '24', value: 24 },
    ]

    const monthlyPayment = computed(() => {
      const value = Number(cost.value) || 0
      const n = Number(months.value) || 1
      return Math.round(value / n).toLocaleString('pt-PT')
    })

    const enquireLink = computed(() => {
      const message = encodeURIComponent(
        `Olá, gostaria de saber mais sobre financiamento de ${cost.value} MZN em ${months.value} meses.`
      )
      return `https://wa.me/258860555999?text=${message}`
    })

    return {
      tdc,
      cost,
      months,
      monthsOptions,
      monthlyPayment,
      enquireLink,
    }

  }

})
</script>

<style scoped>
.calc-page {
  background: linear-gradient(135deg, #43CEA2, #185A9D);
  min-height: 60vh;
}

.calc-card {
  border-radius: 20px;
}
</style>
