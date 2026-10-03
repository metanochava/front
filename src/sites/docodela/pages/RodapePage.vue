<template>

<div class="footer-wrapper col-md-12">

  <!-- MAPA -->
  <!-- <div class="map-container">

    <iframe
      width="100%"
      height="380"
      style="border:0"
      loading="lazy"
      allowfullscreen
      src="https://www.google.com/maps?q=-25.9639738,31.5866938&z=17&output=embed"
    ></iframe>

  </div> -->


  <!-- FOOTER -->
  <div class="footer-glass q-pa-xl text-white">

    <div class="row q-col-gutter-xl">

      <!-- each column: a title and its links (routes of this site; an anchor
           scrolls to that section of the page) -->
      <div v-for="column in columns" :key="column.title" class="col-6 col-md-3" :data-test="`footer-${column.key}`">
        <div class="footer-title q-mb-md">{{ column.brand ? column.title : tdc(column.title) }}</div>

        <div v-for="link in column.links" :key="link.label" class="footer-link-row">
          <a
            v-if="link.href"
            :href="link.href"
            :target="link.external ? '_blank' : undefined"
            :rel="link.external ? 'noopener noreferrer' : undefined"
            class="footer-link"
          >
            <q-icon v-if="link.icon" :name="link.icon" size="16px" class="q-mr-xs" />{{ tdc(link.label) }}
            <span v-if="link.detail" class="footer-link__detail">{{ link.detail }}</span>
          </a>
          <a v-else href="#" class="footer-link" @click.prevent="open(link)">{{ tdc(link.label) }}</a>
        </div>
      </div>

    </div>

    <!-- FRASE DE MARCA -->
    <div class="footer-tagline text-center q-mt-xl" data-test="footer-tagline">
      {{ tdc('Healthcare with access. Financing with purpose.') }}
    </div>

    <!-- REDES SOCIAIS -->
    <div class="row justify-center q-mt-xl social">

      <q-btn flat round icon="fab fa-facebook"/>
      <q-btn flat round icon="fab fa-instagram"/>
      <q-btn flat round icon="fab fa-twitter"/>
      <q-btn flat round icon="fab fa-linkedin"/>

    </div>

    <!-- COPYRIGHT -->
    <div class="text-center q-mt-xl text-caption">

      © {{ new Date().getFullYear() }}
      {{ tdc('All rights reserved') }}

    </div>

  </div>
</div>

</template>


<script>
import { defineComponent, nextTick } from "vue"
import { useRouter } from "vue-router"
import { tdc } from "quasar_resaas"

const PHONE = '+258 86 055 5999'
const EMAIL = 'info@docodela.co.mz'

// Docodela 24horas / Clients / Partners / Contact. `route` is a route name of
// this site (routes.js); `anchor` a section id on that page to scroll to.
const columns = [
  {
    key: 'docodela', title: 'Docodela 24horas', brand: true,
    links: [
      { label: 'About Docodela', route: 'sobrenos' },
      { label: 'How it works', route: 'home', anchor: 'como-funciona' },
      { label: 'Care', route: 'utentes' },
      { label: 'Financing', route: 'categoria-financiamento', params: { categoria: 'financiamento-saude' } },
    ],
  },
  {
    key: 'clients', title: 'Clients',
    links: [
      { label: 'Start now', route: 'contacto' },
      { label: 'Find care', route: 'home', anchor: 'ffyt' },
      { label: 'Assess financing', route: 'calculadora' },
      { label: 'Frequently asked questions', route: 'faqs' },
      { label: 'Guides', route: 'home', anchor: 'guides' },
    ],
  },
  {
    key: 'partners', title: 'Partners',
    links: [
      { label: 'Become a partner', route: 'parceiros' },
      { label: 'For clinics', route: 'parceiros' },
      { label: 'For professionals', route: 'parceiros' },
      { label: 'Contact us', route: 'contacto' },
    ],
  },
  {
    key: 'contact', title: 'Contact',
    links: [
      { label: 'Phone', icon: 'phone', detail: PHONE, href: `tel:${PHONE.replace(/\s/g, '')}` },
      { label: 'WhatsApp', icon: 'fab fa-whatsapp', detail: PHONE, href: 'https://wa.me/258860555999', external: true },
      { label: 'Email', icon: 'mail', detail: EMAIL, href: `mailto:${EMAIL}` },
    ],
  },
]

export default defineComponent({

  setup(){
    const router = useRouter()

    async function open (link) {
      await router.push({ name: link.route, params: link.params || {} })
      if (!link.anchor) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      await nextTick()
      document.getElementById(link.anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    return{
      tdc,
      columns,
      open
    }
  }

})
</script>


<style scoped>

/* GRADIENTE MEDICO */

.footer-wrapper{

  background:
  linear-gradient(
    135deg,
    #43CEA2,
    #185A9D
  );

}


/* MAPA */

.map-container iframe{

  /* border-bottom-left-radius:60px;
  border-bottom-right-radius:60px; */

  filter:contrast(1.1) saturate(1.1);

}


/* GLASS EFFECT */

.footer-glass{

  backdrop-filter: blur(14px);
  background: rgba(255,255,255,0.08);

  border-top:1px solid rgba(255,255,255,.15);

  box-shadow:
  0 8px 32px rgba(0,0,0,.15);

}


/* COLUNAS */

.footer-title{
  font-weight:700;
  font-size:15px;
  letter-spacing:.06em;
  text-transform:uppercase;
}

.footer-link-row{
  margin-bottom:8px;
}

.footer-link{
  color:rgba(255,255,255,.85);
  text-decoration:none;
  font-size:13px;
  letter-spacing:.04em;
  text-transform:uppercase;
  transition:color .2s;
}

.footer-link:hover{
  color:#fff;
  text-decoration:underline;
}

.footer-link__detail{
  display:block;
  text-transform:none;
  letter-spacing:0;
  opacity:.75;
  margin-left:20px;
}

/* FRASE DE MARCA */

.footer-tagline{
  font-size:18px;
  font-style:italic;
  font-weight:500;
  opacity:.95;
}

/* REDES SOCIAIS */

.social q-btn{

  margin:0 8px;

}

.social q-btn:hover{

  transform:scale(1.2);
  transition:.2s;

}


/* WHATSAPP */

.whatsapp-btn{

  box-shadow:0 8px 25px rgba(0,0,0,.3);

}

.whatsapp-btn:hover{

  transform:scale(1.1);
  transition:.2s;

}

</style>
