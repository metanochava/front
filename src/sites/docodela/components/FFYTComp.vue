<template>
  <section id="ffyt" class="categories" data-test="docodela-categories">

    <div class="row justify-center">
      <div class="col-12 col-md-10">

        <div class="text-center categories__head">
          <div class="section-eyebrow">{{ tdc('HEALTHCARE AND FINANCING') }}</div>
          <h2 class="section-title">
            {{ tdc('Find the care you need. Explore options to organise payment.') }}
          </h2>
          <p class="section-text">
            {{ tdc('Docodela24horas can make it easier to access different categories of private healthcare and, for eligible needs, help you look into financing options.') }}
          </p>
        </div>

        <!-- 4 + 3 care categories, then financing as a wide highlighted card:
             every row fills the 12 columns at md and up -->
        <div class="row q-col-gutter-lg">
          <div
            v-for="category in categories"
            :key="category.id"
            :class="category.featured ? 'col-12 col-md-6' : 'col-12 col-sm-6 col-md-3'"
          >
            <s-card
              class="category"
              :class="{ 'category--featured': category.featured }"
              tabindex="0"
              role="link"
              @click="go(category.slug)"
              @keyup.enter="go(category.slug)"
            >
              <div class="category__icon">
                <q-icon :name="category.icon" size="28px" />
              </div>

              <div class="category__title">{{ tdc(category.label) }}</div>
              <p class="category__text">{{ tdc(category.desc) }}</p>

              <div class="category__cta">
                {{ tdc(category.cta) }}
                <q-icon name="arrow_forward" size="16px" class="q-ml-xs" />
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
        slug: 'financiamento-saude',
        featured: true
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
.categories {
  padding: 88px 16px;
  background: #f4f8fc;
}

.categories__head {
  max-width: 760px;
  margin: 0 auto 40px;
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
  font-size: clamp(26px, 3vw, 38px);
  line-height: 1.2;
  font-weight: 800;
  color: #10233f;
}

.section-text {
  margin: 14px auto 0;
  max-width: 640px;
  font-size: 16px;
  line-height: 1.6;
  color: #4b5563;
}

.category {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 24px;
  border-radius: 20px !important;
  background: #fff;
  border: 1px solid #e3ebf5;
  cursor: pointer;
  transition: transform .25s, box-shadow .25s, border-color .25s;
}
.category:hover,
.category:focus-visible {
  transform: translateY(-4px);
  border-color: #b9d3ee;
  box-shadow: 0 18px 40px rgba(24, 90, 157, .14);
  outline: none;
}

.category__icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #185a9d;
  background: #e8f1fb;
}

.category__title {
  margin-top: 16px;
  font-size: 18px;
  font-weight: 700;
  color: #10233f;
}

.category__text {
  flex: 1;
  margin: 8px 0 0;
  font-size: 14px;
  line-height: 1.55;
  color: #4b5563;
}

.category__cta {
  display: inline-flex;
  align-items: center;
  margin-top: 16px;
  font-size: 14px;
  font-weight: 700;
  color: #185a9d;
}

.category--featured {
  color: #fff;
  border: 0;
  background: linear-gradient(135deg, #185a9d, #1f8f6b) !important;
}
.category--featured .category__icon {
  color: #fff;
  background: rgba(255, 255, 255, .18);
}
.category--featured .category__title,
.category--featured .category__cta {
  color: #fff;
}
.category--featured .category__text {
  color: rgba(255, 255, 255, .9);
}

@media (max-width: 599px) {
  .categories {
    padding: 56px 16px;
  }
}
</style>
