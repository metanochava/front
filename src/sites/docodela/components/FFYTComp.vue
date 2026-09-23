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
          {{ tdc('HEALTHCARE AND FINANCING') }}
        </div>

        <div
          class="text-weight-bold text-white"
          style="font-size:20px"
        >
          {{ tdc('Find the care you need. Explore options to organise payment.') }}
        </div>

        <p class="text-white q-mt-md" style="max-width:640px; margin-inline:auto; opacity:.9">
          {{ tdc('Docodela24horas can make it easier to access different categories of private healthcare and, for eligible needs, help you look into financing options.') }}
        </p>

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
            @click="go(category.slug)"
          >

            <q-icon :name="category.icon" size="46px" color="primary" class="q-mb-md" />

            <div class="text-h6 text-weight-bold">
              {{ tdc(category.label) }}
            </div>

            <p class="text-body2 text-grey-8 q-mt-sm">
              {{ tdc(category.desc) }}
            </p>

            <div class="row justify-center items-center q-mt-md text-caption text-primary">
              <span>{{ tdc(category.cta) }} -&gt;</span>
            </div>

          </s-card>

        </div>

      </div>

    </div>

  </section>
</template>


<script>
import { defineComponent } from "vue"
import { useRouter } from "vue-router"
import { tdc } from "quasar_resaas"

export default defineComponent({

  setup () {

    const router = useRouter()

    const categories = [
      {
        id: 1,
        icon: 'medical_information',
        label: 'Medical appointments',
        desc: 'Find providers and specialists available in our network and arrange your care more easily.',
        cta: 'Explore options',
        slug: 'consultas-medicas'
      },
      {
        id: 2,
        icon: 'biotech',
        label: 'Exams and diagnostics',
        desc: 'Arrange lab work, imaging and other diagnostic procedures available through our network of providers.',
        cta: 'Explore options',
        slug: 'exames-diagnostico'
      },
      {
        id: 3,
        icon: 'health_and_safety',
        label: 'Dental health',
        desc: 'Explore options for eligible dental consultations, treatments and procedures.',
        cta: 'Explore options',
        slug: 'saude-dentaria'
      },
      {
        id: 4,
        icon: 'healing',
        label: 'Procedures and treatments',
        desc: 'We make it easier to access different procedures and treatments carried out by partner providers.',
        cta: 'Explore options',
        slug: 'procedimentos-tratamentos'
      },
      {
        id: 5,
        icon: 'wc',
        label: "Women's and men's health",
        desc: 'Find specialised care and treatment options suited to your needs.',
        cta: 'Explore options',
        slug: 'saude-mulher-homem'
      },
      {
        id: 6,
        icon: 'volunteer_activism',
        label: 'Specialised care',
        desc: 'For specific needs, we help guide your path through the options available in our network.',
        cta: 'Explore options',
        slug: 'cuidados-especializados'
      },
      {
        id: 7,
        icon: 'payments',
        label: 'Healthcare financing',
        desc: 'When your care is eligible, Docodela24horas can help you look into a solution to organise payment more predictably, suited to your circumstances.',
        cta: 'Assess financing',
        slug: 'financiamento-saude'
      },
    ]

    // each category leads to its own finance page - see routes.js "categoria-financiamento"
    function go (slug) {
      router.push({ name: 'categoria-financiamento', params: { categoria: slug } })
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
