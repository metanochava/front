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

export default defineComponent({

  setup () {

    const route = useRoute()

    const categories = {
      'consultas-medicas': {
        icon: 'medical_information',
        label: 'Medical appointments',
        desc: 'Find providers and specialists available in our network and arrange your care more easily.',
        primaryLabel: 'Get in touch',
        primaryRoute: 'contacto'
      },
      'exames-diagnostico': {
        icon: 'biotech',
        label: 'Exams and diagnostics',
        desc: 'Arrange lab work, imaging and other diagnostic procedures available through our network of providers.',
        primaryLabel: 'Get in touch',
        primaryRoute: 'contacto'
      },
      'saude-dentaria': {
        icon: 'health_and_safety',
        label: 'Dental health',
        desc: 'Explore options for eligible dental consultations, treatments and procedures.',
        primaryLabel: 'Get in touch',
        primaryRoute: 'contacto'
      },
      'procedimentos-tratamentos': {
        icon: 'healing',
        label: 'Procedures and treatments',
        desc: 'We make it easier to access different procedures and treatments carried out by partner providers.',
        primaryLabel: 'Get in touch',
        primaryRoute: 'contacto'
      },
      'saude-mulher-homem': {
        icon: 'wc',
        label: "Women's and men's health",
        desc: 'Find specialised care and treatment options suited to your needs.',
        primaryLabel: 'Get in touch',
        primaryRoute: 'contacto'
      },
      'cuidados-especializados': {
        icon: 'volunteer_activism',
        label: 'Specialised care',
        desc: 'For specific needs, we help guide your path through the options available in our network.',
        primaryLabel: 'Get in touch',
        primaryRoute: 'contacto'
      },
      'financiamento-saude': {
        icon: 'payments',
        label: 'Healthcare financing',
        desc: 'When your care is eligible, Docodela24horas can help you look into a solution to organise payment more predictably, suited to your circumstances.',
        primaryLabel: 'Assess financing',
        primaryRoute: 'calculadora'
      },
    }

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
