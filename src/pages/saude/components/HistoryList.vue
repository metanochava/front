<template>
  <div class=" ">
     <!-- 🏷️ TÍTULO -->
    <div class="row top fixed-top  header-fixe ">

      <s-card flat square class="col-12 text-center text-h6 text-weight-medium q-mb-sm q-pa-sm bg-transparen">
        <label
          style="
            display: block;
            max-width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          "
        >
          {{ title || 'Histórico'}}
        </label>

        <q-input
          v-model="search"
          type="search"
          label="Pesquisar por nome ou data"
          outlined
          dense
          clearable
          class=" col-12 q-mb-sm"
        />
      </s-card>

      <!-- 🔍 SEARCH -->

    </div >

    <!-- 📋 LISTA -->
    <q-list  separator style="margin-top: 98px;">

      <HistoryItem
        v-for="i in filteredList"
        :key="i?.id"
        :item="i"
        :actions="actions"
        @action="onAction"
      />

    </q-list>

  </div>
</template>

<style >
  .top {
    height: 80px;
    z-index: 10;
  }
</style>

<script setup>
import { ref, computed, onMounted } from 'vue'
import HistoryItem from './HistoryItem.vue'

// props
const props = defineProps({
  store: {
    type: Object,
    required: true
  },
  title: {
    type: Object,
    required: true
  },
  actions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['action'])

// 🔍 estado de busca
const search = ref('')

// 🔥 filtro inteligente
const filteredList = computed(() => {
  if (!search.value) return props.store.rows

  const term = search.value.toLowerCase()

  return props.store.rows.filter(item => {
    return (
      item.created_at?.toLowerCase().includes(term) ||
      item.medico.name?.toLowerCase().includes(term)
    )
  })
})

// evento
function onAction(item, action) {
  emit('action', item, action)
}


// ---------------- INIT ----------------
async function init() {
  props.store.setFilters({ status: 'ativo' })

  await  props.store.loadData()
}



// ---------------- LIFECYCLE ----------------
onMounted(init)
</script>
