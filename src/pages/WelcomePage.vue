<template>
  <q-page
    class="welcome-page"
    :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-grey-2'"
  >
    <div class="full-width q-pa-md">

      <!-- ===================================================== -->
      <!-- WELCOME CARD -->
      <!-- ===================================================== -->

      <s-card
        flat
        bordered
        class="welcome-card q-pa-lg q-mx-auto"
        :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-white'"
      >

        <!-- =================================================== -->
        <!-- USER -->
        <!-- =================================================== -->

        <div class="text-center">

          <q-avatar
            size="96px"
            class="q-mb-md shadow-1"
          >
            <img
              v-if="User?.perfil"
              :src="User.perfil"
              :alt="User?.username || 'User'"
            />

            <q-icon
              v-else
              name="person"
              size="64px"
              color="grey-6"
            />
          </q-avatar>

          <div class="text-h5 text-primary text-weight-medium">

            👋 {{ tdc('Welcome') }},

            <span class="text-weight-bold">
              {{ User?.username || tdc('User') }}
            </span>

          </div>

          <div
            class="q-mt-sm"
            :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-7'"
          >
            {{ tdc('You are successfully logged in.') }}
          </div>

        </div>


        <q-separator class="q-my-lg" />


        <!-- =================================================== -->
        <!-- CONTEXT INFORMATION -->
        <!-- =================================================== -->

        <div class="row q-col-gutter-md">


          <!-- ENTITY -->

          <div
            class="
              col-12
              col-sm-6
              col-md-3
            "
          >

            <s-card
              flat
              bordered
              class="info-card q-pa-md text-center full-height"
            >

              <q-icon
                name="domain"
                size="32px"
                color="primary"
              />

              <div class="text-caption text-grey-6 q-mt-sm">
                {{ tdc('Company') }}
              </div>

              <div class="text-subtitle1 text-weight-bold q-mt-xs">

                {{
                  User?.Entity?.name
                    ? tdc(User.Entity.name)
                    : tdc('N/A')
                }}

              </div>

            </s-card>

          </div>


          <!-- BRANCH -->

          <div
            class="
              col-12
              col-sm-6
              col-md-3
            "
          >

            <s-card
              flat
              bordered
              class="info-card q-pa-md text-center full-height"
            >

              <q-icon
                name="account_tree"
                size="32px"
                color="accent"
              />

              <div class="text-caption text-grey-6 q-mt-sm">
                {{ tdc('Branch') }}
              </div>

              <div class="text-subtitle1 text-weight-bold q-mt-xs">

                {{
                  User?.Branch?.name
                    ? tdc(User.Branch.name)
                    : tdc('N/A')
                }}

              </div>

            </s-card>

          </div>


          <!-- ROLE / GROUP -->

          <div
            class="
              col-12
              col-sm-6
              col-md-3
            "
          >

            <s-card
              flat
              bordered
              class="info-card q-pa-md text-center full-height"
            >

              <q-icon
                name="verified_user"
                size="32px"
                color="positive"
              />

              <div class="text-caption text-grey-6 q-mt-sm">
                {{ tdc('Role') }}
              </div>

              <div class="text-subtitle1 text-weight-bold q-mt-xs">

                {{
                  User?.Group?.name
                    ? tdc(User.Group.name)
                    : tdc('User')
                }}

              </div>

            </s-card>

          </div>


          <!-- LAST LOGIN -->

          <div
            class="
              col-12
              col-sm-6
              col-md-3
            "
          >

            <s-card
              flat
              bordered
              class="info-card q-pa-md text-center full-height"
            >

              <q-icon
                name="schedule"
                size="32px"
                color="warning"
              />

              <div class="text-caption text-grey-6 q-mt-sm">
                {{ tdc('Last Login') }}
              </div>

              <div class="text-subtitle2 text-weight-bold q-mt-xs">

                {{ lastLogin }}

              </div>

            </s-card>

          </div>

        </div>


        <q-separator class="q-my-lg" />


        <!-- =================================================== -->
        <!-- TENANT CONTEXT -->
        <!-- =================================================== -->

        <div
          v-if="hasTenantContext"
          class="tenant-context q-pa-md q-mb-lg rounded-borders"
          :class="
            $q.dark.isActive
              ? 'bg-grey-10'
              : 'bg-blue-1'
          "
        >

          <div class="row items-center">

            <q-icon
              name="hub"
              color="primary"
              size="24px"
              class="q-mr-sm"
            />

            <div>

              <div class="text-weight-medium">
                {{ tdc('Active Context') }}
              </div>

              <div class="text-caption text-grey-6">

                {{ activeContextLabel }}

              </div>

            </div>

          </div>

        </div>


        <!-- =================================================== -->
        <!-- ACTIONS -->
        <!-- =================================================== -->

        <div class="row q-col-gutter-sm justify-center">


          <!-- DASHBOARD -->

          <div class="col-auto">

            <s-btn
              dense
              outline
              color="primary"
              icon="dashboard"
              :label="tdc('Go to Dashboard')"
              @click="goToDashboard"
            />

          </div>


          <!-- LOGOUT -->

          <div class="col-auto">

            <s-btn
              dense
              outline
              color="negative"
              icon="logout"
              :label="tdc('Logout')"
              :loading="logoutLoading"
              @click="logout"
            />

          </div>

        </div>

      </s-card>

    </div>
  </q-page>
</template>


<script setup>

import {
  computed,
  ref,
} from 'vue'

import {
  useRouter,
} from 'vue-router'

import {
  useUserStore,
  tdc,
  ds,
} from 'quasar_resaas'


// =============================================================
// ROUTER
// =============================================================

const router = useRouter()


// =============================================================
// STORES
// =============================================================

const User = useUserStore()


// =============================================================
// STATE
// =============================================================

const logoutLoading = ref(false)


// =============================================================
// COMPUTED
// =============================================================

const lastLogin = computed(() => {

  const value = User?.data?.last_login

  if (!value) {
    return '-'
  }

  try {

    const cleanValue = value.split('.')[0]

    const [
      date,
      time,
    ] = cleanValue.split('T')

    const formattedDate = date
      ? ds(date)
      : ''

    const formattedTime = time
      ? time.substring(0, 8)
      : ''

    return `${formattedDate} ${formattedTime}`.trim() || '-'

  } catch (error) {

    console.error(
      '[Welcome] Error formatting last login:',
      error,
    )

    return '-'
  }

})


const hasTenantContext = computed(() => {

  return Boolean(
    User?.Entity?.id ||
    User?.Branch?.id ||
    User?.Group?.id
  )

})


const activeContextLabel = computed(() => {

  const parts = []

  if (User?.Entity?.name) {
    parts.push(
      tdc(User.Entity.name),
    )
  }

  if (User?.Branch?.name) {
    parts.push(
      tdc(User.Branch.name),
    )
  }

  if (User?.Group?.name) {
    parts.push(
      tdc(User.Group.name),
    )
  }

  return parts.join(' • ')
})


// =============================================================
// DASHBOARD
// =============================================================

function goToDashboard() {

  /*
   * Nesta fase continuamos compatíveis
   * com a rota actual "home".
   *
   * Quando DashboardStore +
   * DashboardRenderer estiverem integrados,
   * esta função poderá resolver dinamicamente
   * o dashboard autorizado.
   */

  router.push({
    name: 'home',
  })

}


// =============================================================
// LOGOUT
// =============================================================

async function logout() {

  if (logoutLoading.value) {
    return
  }

  logoutLoading.value = true

  try {

    await User.logout()

    await router.replace({
      name: 'login',
    })

  } catch (error) {

    console.error(
      '[Welcome] Logout error:',
      error,
    )

  } finally {

    logoutLoading.value = false

  }

}

</script>


<style scoped>

/* ============================================================
   PAGE
============================================================ */

.welcome-page {
  min-height: 100%;
  display: flex;
  align-items: center;
}


/* ============================================================
   MAIN CARD
============================================================ */

.welcome-card {
  width: 100%;
  max-width: 1050px;

  border-radius: 20px;

  backdrop-filter: blur(12px);

  box-shadow:
    0 10px 35px
    rgba(0, 0, 0, 0.08);
}


/* ============================================================
   INFO CARDS
============================================================ */

.info-card {
  border-radius: 14px;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}


.info-card:hover {
  transform: translateY(-2px);

  box-shadow:
    0 6px 18px
    rgba(0, 0, 0, 0.08);
}


/* ============================================================
   TENANT
============================================================ */

.tenant-context {
  border-radius: 12px;
}


/* ============================================================
   MOBILE
============================================================ */

@media (max-width: 599px) {

  .welcome-card {
    padding: 16px !important;
    border-radius: 14px;
  }

}

</style>
