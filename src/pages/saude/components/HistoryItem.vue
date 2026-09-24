<template>

<DoctorProfileDialog
  v-model="dialog"
  :employee="item?.employee"
  :fallback-name="item?.medico?.name"
/>

  <q-item dense clickable v-ripple @click="emit('action', item, null)" :class="$q.dark.isActive ? 'bg-dark text-white ' : 'bg-primary text-white'">

    <!-- 📷 FOTO -->
    <q-item-section avatar v-if="item?.medico">
      <q-avatar @click.stop="handleImageClick(item)" class="cursor-pointer">
        <img :src="item.medico.profile?.url || User.defaultprofile" />
      </q-avatar>
    </q-item-section>


    <!-- 🧾 CONTEÚDO -->
    <q-item-section>
      <q-item-label>{{ ds(item?.created_at ) }}</q-item-label>
      <q-item-label caption v-if="item?.medico?.name" :class="$q.dark.isActive ? 'bg-dark text-white ' : 'bg-primary text-white'">
        {{ item?.medico?.name }}
      </q-item-label>
    </q-item-section>

    <!-- ➡️ MENU -->
    <q-item-section side >
      <q-btn flat round icon="more_vert" @click.stop :class="$q.dark.isActive ? 'bg-dark text-white ' : 'bg-primary text-white'">
        <q-menu>
          <q-list dense style="min-width: 160px">
            <q-item
              v-for="act in actions"
              :key="act"
              clickable
              v-close-popup
              @click.stop="emit('action', item, act)"
            >
              <q-item-section>
                <label>{{ tdc(actionLabels[act] || act) }}</label>
              </q-item-section>
            </q-item>

          </q-list>
        </q-menu>

      </q-btn>
    </q-item-section>

  </q-item>
</template>

<script setup>
import { ref } from "vue"
import { tdc, ds, useUserStore } from "quasar_resaas"
import DoctorProfileDialog from "./DoctorProfileDialog.vue"

const User = useUserStore()

const dialog = ref(false)

// action ids -> the canonical English label shown in the menu
const actionLabels = { pdf: 'PDF', delete: 'Delete' }

defineProps({
  item: {
    type: Object,
    required: true
  },
  actions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(["action"])

function handleImageClick(item) {

  emit("action", item, "foto")

  dialog.value = true
}
</script>
