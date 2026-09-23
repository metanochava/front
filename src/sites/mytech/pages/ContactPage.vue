<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { tdc } from 'quasar_resaas'
import { contact } from '../mytech.config'

const route = useRoute()

const services = [
  { label: tdc('Management systems'), value: 'management-systems' },
  { label: tdc('Digital forensics'), value: 'digital-forensics' },
  { label: tdc('Website / software development'), value: 'development' },
  { label: tdc('Training'), value: 'training' },
  { label: tdc('IT equipment'), value: 'equipment' },
  { label: tdc('General enquiry'), value: 'general' },
]

const form = ref({
  name: '',
  email: '',
  service: services.find(s => s.value === route.query.service)?.value || 'general',
  message: ''
})

const sent = ref(false)
const formRef = ref(null)

const canSend = computed(() => !!(contact.email || contact.whatsapp))
const isForensics = computed(() => form.value.service === 'digital-forensics')

async function submit() {
  const valid = await formRef.value.validate()
  if (!valid) return

  const serviceLabel = services.find(s => s.value === form.value.service)?.label || ''
  const body = `${tdc('Service')}: ${serviceLabel}\n${tdc('Name')}: ${form.value.name}\n${tdc('Email')}: ${form.value.email}\n\n${form.value.message}`

  if (contact.email) {
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(`MyTech - ${serviceLabel}`)}&body=${encodeURIComponent(body)}`
  } else if (contact.whatsapp) {
    window.open(`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(body)}`, '_blank')
  }

  sent.value = true
}
</script>

<template>
  <div class="contact-page">
    <section class="mt-section" style="padding-top: calc(var(--mt-nav) + 48px)">
      <div class="mt-wrap contact-inner">

        <div>
          <p class="mt-eyebrow">{{ tdc('Contact') }}</p>
          <h1 class="mt-title" style="max-width:20ch">{{ tdc('Talk to MyTech') }}</h1>
          <p class="mt-lead">{{ tdc('Tell us what you need and we will get back to you.') }}</p>

          <p v-if="isForensics" class="contact-note">
            <q-icon name="info" size="18px" />
            {{ tdc('For digital forensics, this form is for an initial case enquiry only - please do not attach sensitive evidence here. We will confirm a secure way to proceed once we understand your case.') }}
          </p>

          <p v-if="!canSend" class="contact-note contact-note--warn">
            <q-icon name="engineering" size="18px" />
            {{ tdc('Contact details for MyTech are being finalised. In the meantime, please reach out through the client area or check back soon.') }}
          </p>
        </div>

        <q-form ref="formRef" class="mt-card contact-form" @submit.prevent="submit">
          <template v-if="!sent">
            <s-input
              v-model="form.name"
              filled
              :label="tdc('Name')"
              :rules="[v => !!v || tdc('This field is required')]"
              class="q-mb-md"
            />
            <s-input
              v-model="form.email"
              filled
              type="email"
              :label="tdc('Email')"
              :rules="[v => !!v || tdc('This field is required'), v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || tdc('Invalid format')]"
              class="q-mb-md"
            />
            <s-select
              v-model="form.service"
              filled
              emit-value
              map-options
              :options="services"
              :label="tdc('Service')"
              class="q-mb-md"
            />
            <s-input
              v-model="form.message"
              filled
              type="textarea"
              rows="5"
              :label="tdc('Message')"
              :rules="[v => !!v || tdc('This field is required')]"
              class="q-mb-lg"
            />

            <s-btn
              type="submit"
              color="primary"
              :disable="!canSend"
              :label="tdc('Send message')"
              icon-right="send"
            />
          </template>

          <div v-else class="contact-success">
            <q-icon name="check_circle" size="40px" color="positive" />
            <div class="text-h6 q-mt-md">{{ tdc('Thank you') }}</div>
            <p class="q-mt-sm">{{ tdc("We'll be in touch shortly.") }}</p>
          </div>
        </q-form>

      </div>
    </section>
  </div>
</template>

<style scoped>
.contact-inner { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(32px,5vw,72px); align-items: start; }
.contact-note {
  display: flex; align-items: flex-start; gap: 10px; margin-top: 24px;
  padding: 14px 16px; border-radius: var(--mt-radius-sm); background: var(--mt-surface-2);
  color: var(--mt-muted); font-size: 14px; line-height: 1.6;
}
.contact-note--warn { border: 1px solid var(--mt-line); }
.contact-form { padding: 32px; }
.contact-success { text-align: center; padding: 20px 0; color: var(--mt-muted); }
@media (max-width: 860px) { .contact-inner { grid-template-columns: 1fr; } }
</style>
