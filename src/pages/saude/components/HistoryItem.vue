<template>

<q-dialog v-model="dialog">
  <s-modal-card :title="tdc('Doctor')" icon="create_new_folder" width="700px">
    {{ data }}


    <template #footer>
      <s-btn
          flat
          :label="tdc('Cancel')"
          v-close-popup
      />

      <s-btn
          color="primary"
          icon="create_new_folder"
          :label="tdc('Create folder')"
          @click="guardar"
      />


    </template>
  </s-modal-card>
</q-dialog>

  <q-item dense clickable v-ripple @click="emit('action', item, null)" :class="$q.dark.isActive ? 'bg-dark text-white ' : 'bg-primary text-white'">

    <!-- 📷 FOTO -->
    <q-item-section avatar v-if="item?.medico?.profile">
      <q-avatar @click.stop="handleImageClick(item)" class="cursor-pointer">
        <img v-if="item?.medico?.profile.url" :src="item?.medico?.profile.url" />
        <img v-else :src="User.defaultprofile" />
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
                <label>{{ act }}</label>
              </q-item-section>
            </q-item>

          </q-list>
        </q-menu>

      </q-btn>
    </q-item-section>

  </q-item>
</template>

<script setup>
import { tdc } from 'quasar_resaas'
import { ref } from "vue"
import { ds, useUserStore } from "quasar_resaas"

const User = useUserStore()

const dialog = ref(false)
const data = ref(null)

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

  data.value = item

  dialog.value = true
}
</script>
