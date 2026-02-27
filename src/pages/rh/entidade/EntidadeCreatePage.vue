<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="q-pa-xl welcome-card" flat>
      <!-- Avatar + Nome -->
      <div class="text-center">
        <q-avatar size="96px" class="q-mb-md shadow-4">
          <img :src="User?.perfil" />
        </q-avatar>

        <h4 class="text-primary">
          👋 {{ tdc('Welcome') }}, <b>{{ User?.username }}</b>
        </h4>

        <p class="text-grey-6 q-mt-sm">
          {{ tdc('You are successfully logged in.') }}
        </p>
      </div>

      <q-separator class="q-my-md" />

      <!-- Info Cards -->
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-4">
          <q-card flat bordered class="q-pa-sm bg-white text-center">
            <q-icon name="domain" size="32px" color="primary" />
            <div class="text-subtitle2">{{ tdc('Company') }}</div>
            <div class="text-bold">{{ User?.Entidade?.nome || 'N/A' }}</div>
          </q-card>
        </div>

        <div class="col-4">
          <q-card flat bordered class="q-pa-sm bg-white text-center">
            <q-icon name="verified_user" size="32px" color="positive" />
            <div class="text-subtitle2">{{ tdc('Role') }}</div>
            <div class="text-bold">{{ User?.Grupo?.name || 'User' }}</div>
          </q-card>
        </div>

        <div class="col-4">
          <q-card flat bordered class="q-pa-sm bg-white text-center">
            <q-icon name="schedule" size="32px" color="warning" />
            <div class="text-subtitle2">{{ tdc('Last Login') }}</div>
            <div class="text-bold">
              {{
                ds(User?.data?.last_login?.split('.')[0].split('T')[0]) +
                  ' ' +
                  User?.data?.last_login?.split('.')[0].split('T')[1] || '-'
              }}
            </div>
          </q-card>
        </div>
      </div>

      <q-separator class="q-my-md" />

      <!-- Actions -->
      <div class="row justify-center">
        <q-btn
          dense
          outline
          color="primary"
          icon="dashboard"
          :label="tdc('Go to Dashboard')"
          @click="router.push({ name: 'home' })"
        />
        &nbsp; &nbsp;
        <q-btn
          color="negative"
          icon="logout"
          :label="tdc('Logout')"
          dense
          outline
          @click="logout"
        />
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { UserStore } from '@metano/quasar_rest_auth'

import { useRouter } from 'vue-router'
import { tdc, ds } from '@metano/quasar_rest_auth' // ✅ IMPORT DO TDC

const router = useRouter()
const User = UserStore()

function logout() {
  User.logout() // ❗ CORREÇÃO (antes estava errado)
  router.push({ name: 'login' })
}
</script>

<style scoped>
/* Glassmorphism SaaS style */
.welcome-card {
  width: 100%;
  max-width: 720px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}
</style>
