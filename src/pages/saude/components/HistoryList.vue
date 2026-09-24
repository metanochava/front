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
          :label="tdc('Search by name or date')"
          outlined
          dense
          clearable
          class=" col-12 q-mb-sm"
        />
      </s-card>

      <!-- 🔍 SEARCH -->

    </div >

    <!-- 📋 LISTA: newest first, 20 per page, pages are appended while scrolling down -->
    <q-infinite-scroll
      ref="scroller"
      :offset="200"
      :disable="!hasNext || !!loadError"
      style="margin-top: 98px;"
      @load="onLoad"
    >
      <q-list separator>
        <HistoryItem
          v-for="i in filteredList"
          :key="i?.id"
          :item="i"
          :actions="visibleActions"
          @action="onAction"
        />
      </q-list>

      <div v-if="loaded && !items.length && !loadError" class="text-center text-grey q-pa-md">
        {{ tdc('No records found') }}
      </div>

      <div v-if="loadError" class="text-center q-pa-md">
        <div class="text-negative q-mb-sm">{{ tdc('Could not load the results.') }}</div>
        <s-btn flat dense color="primary" icon="refresh" :label="tdc('Try again')" @click="retry" />
      </div>

      <template #loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="32px" />
        </div>
      </template>
    </q-infinite-scroll>

    <ReprintDialog
      v-model="reprintOpen"
      :store="store"
      :item="reprintItem"
      :fields="dateFields"
      @done="onReprinted"
    />

  </div>
</template>

<style >
  .top {
    height: 80px;
    z-index: 10;
  }
</style>

<script setup>
import { tdc, sDialog, useUserStore, AlertSuccess, AlertError } from 'quasar_resaas'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import HistoryItem from './HistoryItem.vue'
import ReprintDialog from './ReprintDialog.vue'

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
  },
  // model key of the listed records ('atestadomedico'): drives the change_/delete_
  // permissions and the change_ route used by Edit
  routeKey: {
    type: String,
    default: ''
  },
  // editable date fields of the model, [{ name, label, type: 'date' | 'time' }].
  // A model without any has no Reprint: there is no date to change.
  dateFields: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['action'])

// 🔍 estado de busca
const search = ref('')

// 🔥 filtro inteligente
const filteredList = computed(() => {
  if (!search.value) return items.value

  const term = search.value.toLowerCase()

  return items.value.filter(item => {
    return (
      item.created_at?.toLowerCase().includes(term) ||
      item.medico?.name?.toLowerCase().includes(term)
    )
  })
})

// ---------------- ACTIONS ----------------
const router = useRouter()
const User = useUserStore()

const canDo = (verb) => !props.routeKey || User.can(`${verb}_${props.routeKey}`)

// Conditions: Edit/Delete need the permission (UX only - the backend enforces it),
// Reprint needs a date to change AND the permission to change it.
const visibleActions = computed(() => props.actions.filter(action => {
  if (action === 'Edit') return !!props.routeKey && canDo('change')
  if (action === 'delete') return !!props.routeKey && canDo('delete')
  if (action === 'Reprint') return props.dateFields.length > 0 && canDo('change')
  return true
}))

const reprintOpen = ref(false)
const reprintItem = ref(null)

function onAction(item, action) {
  if (action === 'Edit') {
    router.push({ name: `change_${props.routeKey}`, params: { id: item.id } })
  } else if (action === 'delete') {
    confirmDelete(item)
  } else if (action === 'Reprint') {
    reprintItem.value = item
    reprintOpen.value = true
  } else {
    emit('action', item, action)
  }
}

function confirmDelete(item) {
  sDialog({
    title: tdc('Delete'),
    message: tdc('Are you sure you want to delete this record?'),
    cancel: { flat: true, label: tdc('Cancel') },
    ok: { color: 'negative', label: tdc('Delete') },
    persistent: true
  }).onOk(async () => {
    try {
      await props.store.removeById(item.id)
      items.value = items.value.filter(i => i?.id !== item.id)
      AlertSuccess(tdc('Record deleted.'))
    } catch (e) {
      AlertError(e)
    }
  })
}

// after the dates were saved: refresh the row in the list, then print it
function onReprinted(updated) {
  items.value = items.value.map(i => (i?.id === updated.id ? { ...i, ...updated } : i))
  emit('action', updated, 'pdf')
}


// ---------------- PAGING ----------------
// The list lives here, not in props.store.rows: that array (and the store's
// pagination) belongs to the page's own list and must not be replaced by this
// side menu. store.fetchPage() only reads.
const PAGE_SIZE = 20

const items = ref([])
const hasNext = ref(true)
const loaded = ref(false)
const loadError = ref(false)
const scroller = ref(null)

// q-infinite-scroll calls this on mount (index 1) and every time the user
// nears the bottom; pages are appended, never replaced, so scrolling back up
// still shows everything already loaded.
async function onLoad(index, done) {
  try {
    const page = await props.store.fetchPage({
      page: index,
      page_size: PAGE_SIZE,
      ordering: '-created_at',
      state: 'Active'
    })

    const known = new Set(items.value.map(i => i?.id))
    items.value = [...items.value, ...page.rows.filter(i => !known.has(i?.id))]
    hasNext.value = page.hasNext
    loaded.value = true

    done(!page.hasNext)
  } catch {
    loadError.value = true
    loaded.value = true
    done(true)
  }
}

function retry() {
  loadError.value = false
  scroller.value?.resume()
  scroller.value?.trigger()
}
</script>
