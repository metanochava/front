<script setup>
import { onMounted, ref } from 'vue'
import { tdc } from 'quasar_resaas'

import { syncedAt, versions } from '../docs'

const copied = ref('')

const installs = [
  { key: 'back', label: 'django_resaas', command: 'pip install django_resaas' },
  { key: 'front', label: 'quasar_resaas', command: 'npm install github:metanochava/quasar_resaas' }
]

const libraries = [
  {
    key: 'django-resaas',
    name: 'django_resaas',
    icon: 'dns',
    kicker: 'Backend · Django REST',
    text: 'Tenants (Entity → Branch), users, groups and permissions, a CRUD engine, a JSON schema of every model, dashboards, notifications and PDF.',
    links: [
      { label: 'Installation', to: '/docs/django-resaas/getting-started/installation' },
      { label: 'Quick start', to: '/docs/django-resaas/getting-started/quick-start' },
      { label: 'BaseAPIView', to: '/docs/django-resaas/api/base-api-view' },
      { label: 'All backend docs', to: '/docs/django-resaas/README' }
    ]
  },
  {
    key: 'quasar-resaas',
    name: 'quasar_resaas',
    icon: 'bolt',
    kicker: 'Frontend · Vue 3 + Quasar',
    text: 'Reads that schema and renders forms, tables, filters, permission-aware menus and dashboards — with stores, dialogs and translations ready to use.',
    links: [
      { label: 'Installation', to: '/docs/quasar-resaas/getting-started/installation' },
      { label: 'Quick start', to: '/docs/quasar-resaas/getting-started/quick-start' },
      { label: 'BaseStore', to: '/docs/quasar-resaas/stores/base-store' },
      { label: 'All frontend docs', to: '/docs/quasar-resaas/README' }
    ]
  }
]

const features = [
  { icon: 'domain', title: 'Multi-tenant by default', text: 'Every query is scoped to the signed Entity and Branch of the request. Knowing an id never crosses a tenant.' },
  { icon: 'verified_user', title: 'Fail-closed permissions', text: 'Each action needs its permission. Missing metadata means 403, never an open endpoint.' },
  { icon: 'schema', title: 'Schema-driven UI', text: 'The backend describes fields, actions and filters; the frontend renders the screen from it.' },
  { icon: 'dashboard', title: 'Dashboards per module', text: 'Each app registers its own widgets; users only see what their permissions allow.' },
  { icon: 'translate', title: 'Four languages', text: 'English, Portuguese, Spanish and French, from the database and each app\'s own files.' },
  { icon: 'notifications', title: 'Notifications & PDF', text: 'Domain events feed a notifications outbox; list and detail PDFs come with the CRUD.' }
]

const flow = [
  { n: '1', title: 'Model', code: 'class Product(BaseModel):' },
  { n: '2', title: 'Serializer', code: 'class ProductSerializer(BaseSerializer):' },
  { n: '3', title: 'View', code: '@registerView(module="catalog")' },
  { n: '4', title: 'Screen', code: '<s-auto-crud app="catalog" model="Product" />' }
]

function copy (item) {
  navigator.clipboard?.writeText(item.command).then(() => {
    copied.value = item.key
    setTimeout(() => { copied.value = '' }, 1400)
  }).catch(() => {})
}

const syncedDate = syncedAt ? syncedAt.slice(0, 10) : null

onMounted(() => { document.title = 'RESAAS — documentation' })
</script>

<template>
  <div class="rs-home">
    <!-- hero -->
    <section class="rs-hero">
      <div class="rs-hero__glow" aria-hidden="true" />
      <div class="rs-wrap">
        <div class="rs-hero__badge">
          <span class="rs-dot" /> {{ tdc('Open-source SaaS framework') }}
        </div>
        <h1 class="rs-hero__title">
          {{ tdc('Build multi-tenant business systems') }}
          <span class="rs-grad">{{ tdc('without rebuilding the platform') }}</span>
        </h1>
        <p class="rs-hero__lead">
          {{ tdc('RESAAS is two libraries that work together: django_resaas describes your models, permissions and tenants; quasar_resaas renders them as a complete application.') }}
        </p>
        <div class="rs-hero__actions">
          <router-link to="/docs/guide/start-here" class="rs-btn rs-btn--primary" data-test="start-here">
            <q-icon name="rocket_launch" size="18px" /> {{ tdc('Start here') }}
          </router-link>
          <router-link to="/docs/django-resaas/README" class="rs-btn">{{ tdc('Backend docs') }}</router-link>
          <router-link to="/docs/quasar-resaas/README" class="rs-btn">{{ tdc('Frontend docs') }}</router-link>
        </div>

        <div class="rs-install">
          <div v-for="item in installs" :key="item.key" class="rs-install__row">
            <span class="rs-install__label" :class="`rs-install__label--${item.key}`">{{ item.label }}</span>
            <code><span class="rs-install__prompt">$</span> {{ item.command }}</code>
            <button type="button" class="rs-install__copy" :aria-label="tdc('Copy')" @click="copy(item)">
              <q-icon :name="copied === item.key ? 'check' : 'content_copy'" size="16px" />
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- the two libraries -->
    <section class="rs-section">
      <div class="rs-wrap">
        <h2 class="rs-section__title">{{ tdc('Two libraries, one contract') }}</h2>
        <p class="rs-section__lead">{{ tdc('Backend describes. Frontend renders. Each one can be installed and documented on its own.') }}</p>
        <div class="rs-libs">
          <article v-for="lib in libraries" :key="lib.key" class="rs-lib" :class="`rs-lib--${lib.key}`">
            <div class="rs-lib__head">
              <span class="rs-lib__icon"><q-icon :name="lib.icon" size="22px" /></span>
              <div>
                <h3>{{ lib.name }}</h3>
                <small>{{ tdc(lib.kicker) }}</small>
              </div>
              <span v-if="versions?.[lib.key]" class="rs-lib__version">{{ versions[lib.key].commit }}</span>
            </div>
            <p>{{ tdc(lib.text) }}</p>
            <div class="rs-lib__links">
              <router-link v-for="l in lib.links" :key="l.to" :to="l.to">
                {{ tdc(l.label) }} <q-icon name="arrow_forward" size="14px" />
              </router-link>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- flow -->
    <section class="rs-section rs-section--alt">
      <div class="rs-wrap">
        <h2 class="rs-section__title">{{ tdc('From a model to a screen') }}</h2>
        <p class="rs-section__lead">{{ tdc('A tenant-scoped, permission-checked CRUD API and its page, in four steps.') }}</p>
        <ol class="rs-flow">
          <li v-for="step in flow" :key="step.n" class="rs-flow__step">
            <span class="rs-flow__n">{{ step.n }}</span>
            <strong>{{ tdc(step.title) }}</strong>
            <code>{{ step.code }}</code>
          </li>
        </ol>
        <div class="rs-center">
          <router-link to="/docs/guide/start-here" class="rs-btn rs-btn--primary">
            {{ tdc('Follow the full guide') }} <q-icon name="arrow_forward" size="18px" />
          </router-link>
        </div>
      </div>
    </section>

    <!-- features -->
    <section class="rs-section">
      <div class="rs-wrap">
        <h2 class="rs-section__title">{{ tdc('What you get out of the box') }}</h2>
        <div class="rs-features">
          <div v-for="f in features" :key="f.title" class="rs-feature">
            <q-icon :name="f.icon" size="22px" class="rs-feature__icon" />
            <h3>{{ tdc(f.title) }}</h3>
            <p>{{ tdc(f.text) }}</p>
          </div>
        </div>
      </div>
    </section>

    <footer class="rs-footer">
      <div class="rs-wrap rs-footer__inner">
        <span>RESAAS · {{ tdc('Documentation generated from the libraries\' own docs') }}<template v-if="syncedDate"> · {{ syncedDate }}</template></span>
        <span class="rs-footer__links">
          <a href="https://github.com/metanochava/django_resaas" target="_blank" rel="noopener noreferrer">django_resaas</a>
          <a href="https://github.com/metanochava/quasar_resaas" target="_blank" rel="noopener noreferrer">quasar_resaas</a>
          <a href="https://mytech.co.mz" target="_blank" rel="noopener noreferrer">MyTech</a>
        </span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.rs-wrap { max-width: 1120px; margin: 0 auto; padding: 0 20px; }
.rs-center { text-align: center; margin-top: 36px; }

.rs-hero { position: relative; overflow: hidden; padding: 88px 0 72px; text-align: center; }
.rs-hero__glow {
  position: absolute; inset: -30% -10% auto; height: 620px; pointer-events: none;
  background:
    radial-gradient(40% 50% at 30% 40%, color-mix(in srgb, var(--rs-back) 22%, transparent), transparent 70%),
    radial-gradient(40% 50% at 70% 35%, color-mix(in srgb, var(--rs-front) 22%, transparent), transparent 70%);
  filter: blur(20px);
}
.rs-hero .rs-wrap { position: relative; }
.rs-hero__badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border: 1px solid var(--rs-line); border-radius: 999px; font-size: 13.5px; color: var(--rs-muted); background: var(--rs-bg); }
.rs-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--rs-back); box-shadow: 0 0 0 4px color-mix(in srgb, var(--rs-back) 20%, transparent); }
.rs-hero__title { font-family: var(--rs-font-display); font-size: clamp(34px, 5.6vw, 62px); line-height: 1.06; letter-spacing: -0.03em; margin: 22px auto 18px; max-width: 900px; font-weight: 800; }
.rs-grad { display: block; background: linear-gradient(90deg, var(--rs-back), var(--rs-front)); -webkit-background-clip: text; background-clip: text; color: transparent; }
.rs-hero__lead { font-size: clamp(16px, 1.8vw, 19px); color: var(--rs-muted); max-width: 700px; margin: 0 auto 30px; }
.rs-hero__actions { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }

.rs-install { margin: 40px auto 0; max-width: 640px; display: grid; gap: 10px; text-align: left; }
.rs-install__row { display: flex; align-items: center; gap: 12px; padding: 10px 10px 10px 14px; border-radius: 12px; background: var(--rs-code-bg); color: var(--rs-code-text); border: 1px solid var(--rs-line); }
.rs-install__label { font-family: var(--rs-mono); font-size: 11.5px; padding: 3px 8px; border-radius: 6px; flex: 0 0 auto; }
.rs-install__label--back { background: rgba(52, 211, 153, .15); color: #34d399; }
.rs-install__label--front { background: rgba(96, 165, 250, .15); color: #60a5fa; }
.rs-install__row code { font-family: var(--rs-mono); font-size: 13.5px; flex: 1; min-width: 0; overflow-x: auto; white-space: nowrap; }
.rs-install__prompt { color: #64748b; }
.rs-install__copy { border: 0; background: transparent; color: #94a3b8; cursor: pointer; padding: 6px; border-radius: 6px; }
.rs-install__copy:hover { color: #fff; background: rgba(255, 255, 255, .08); }

.rs-section { padding: 80px 0; }
.rs-section--alt { background: var(--rs-surface); border-top: 1px solid var(--rs-line); border-bottom: 1px solid var(--rs-line); }
.rs-section__title { font-family: var(--rs-font-display); font-size: clamp(26px, 3.4vw, 36px); letter-spacing: -0.02em; text-align: center; margin: 0 0 10px; line-height: 1.2; }
.rs-section__lead { text-align: center; color: var(--rs-muted); margin: 0 auto 40px; max-width: 620px; }

.rs-libs { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
.rs-lib { padding: 26px; border-radius: 16px; border: 1px solid var(--rs-line); background: var(--rs-bg); position: relative; overflow: hidden; }
.rs-lib::before { content: ''; position: absolute; inset: 0 0 auto; height: 3px; background: var(--c); }
.rs-lib--django-resaas { --c: var(--rs-back); }
.rs-lib--quasar-resaas { --c: var(--rs-front); }
.rs-lib__head { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }
.rs-lib__head h3 { margin: 0; font-family: var(--rs-mono); font-size: 19px; }
.rs-lib__head small { color: var(--rs-muted); }
.rs-lib__icon { width: 44px; height: 44px; border-radius: 12px; display: grid; place-items: center; color: var(--c); background: color-mix(in srgb, var(--c) 12%, transparent); }
.rs-lib__version { margin-left: auto; font-family: var(--rs-mono); font-size: 12px; color: var(--rs-muted); padding: 2px 8px; border: 1px solid var(--rs-line); border-radius: 999px; }
.rs-lib p { color: var(--rs-muted); margin: 0 0 18px; }
.rs-lib__links { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 16px; }
.rs-lib__links a { display: inline-flex; align-items: center; gap: 6px; color: var(--c); font-weight: 600; font-size: 14.5px; }
.rs-lib__links a:hover { text-decoration: underline; }

.rs-flow { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; counter-reset: none; }
.rs-flow__step { display: grid; gap: 8px; padding: 20px; border-radius: 14px; background: var(--rs-bg); border: 1px solid var(--rs-line); }
.rs-flow__n { width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; font-weight: 700; font-size: 14px; color: #fff; background: linear-gradient(135deg, var(--rs-back), var(--rs-front)); }
.rs-flow__step code { font-family: var(--rs-mono); font-size: 12.5px; color: var(--rs-muted); word-break: break-word; }

.rs-features { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }
.rs-feature { padding: 22px; border-radius: 14px; border: 1px solid var(--rs-line); background: var(--rs-bg); transition: border-color .15s ease, transform .15s ease; }
.rs-feature:hover { border-color: var(--rs-accent); transform: translateY(-2px); }
.rs-feature__icon { color: var(--rs-accent); }
.rs-feature h3 { font-size: 16.5px; margin: 10px 0 6px; }
.rs-feature p { margin: 0; color: var(--rs-muted); font-size: 14.5px; }

.rs-footer { border-top: 1px solid var(--rs-line); padding: 26px 0; color: var(--rs-muted); font-size: 13.5px; }
.rs-footer__inner { display: flex; flex-wrap: wrap; gap: 12px; justify-content: space-between; }
.rs-footer__links { display: flex; gap: 18px; }
.rs-footer__links a:hover { color: var(--rs-text); }

@media (max-width: 900px) {
  .rs-libs, .rs-features { grid-template-columns: 1fr; }
  .rs-flow { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 560px) {
  .rs-hero { padding: 56px 0 48px; }
  .rs-flow, .rs-lib__links { grid-template-columns: 1fr; }
  .rs-section { padding: 56px 0; }
}
</style>
