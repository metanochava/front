<script setup>
import { tdc } from 'quasar_resaas'

// A small language switcher for the PUBLIC sites (see useSiteLanguage.js).
defineProps({
  languages: { type: Array, default: () => [] },
  current: { type: Object, default: null }
})

defineEmits(['choose'])
</script>

<template>
  <q-btn flat round dense icon="translate" :aria-label="tdc('Language')" data-test="site-language">
    <q-menu>
      <q-list dense style="min-width: 150px">
        <q-item
          v-for="language in languages"
          :key="language.id"
          v-close-popup
          clickable
          :active="current?.id === language.id"
          @click="$emit('choose', language)"
        >
          <q-item-section>{{ language.name }}</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
    <q-tooltip>{{ tdc('Language') }}</q-tooltip>
  </q-btn>
</template>
