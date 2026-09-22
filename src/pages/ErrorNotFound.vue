<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">404</div>

      <div class="text-h2" style="opacity: 0.4">{{ tdc('Oops. Nothing here...') }}</div>

      <s-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        :label="tdc('Go home')"
        no-caps
      />
    </div>
  </div>
</template>

<script setup>
import { tdc } from 'quasar_resaas'
//
</script>





