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

    <!-- 📋 LISTA: newest first, 20 per page. Scrolling down appends the next
         (older) pages; near the top, the previous (newer) pages are prepended -
         the list reopens where the user was after F5. -->
    <q-infinite-scroll
      ref="scroller"
      :offset="200"
      :disable="!hasNext || !!loadError"
      style="margin-top: 98px;"
      @load="onLoad"
    >
      <div v-if="loadingPrevious" class="row justify-center q-my-sm" data-test="history-loading-previous">
        <q-spinner-dots color="primary" size="28px" />
      </div>
      <div v-else-if="firstPage > 1 && !loadError" class="row justify-center q-my-xs">
        <s-btn flat dense no-caps size="sm" icon="expand_less" color="primary"
               :label="tdc('Newer records')" data-test="history-load-previous" @click="loadPrevious" />
      </div>

      <q-list ref="listRef" separator>
        <HistoryItem
          v-for="i in filteredList"
          :key="i?.id"
          :item="i"
          :actions="actionsFor(i)"
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
import { tdc, sDialog, useUserStore, AlertSuccess, AlertError, getUserPreference, setUserPreference } from 'quasar_resaas'
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { scroll, debounce } from 'quasar'
import { useRouter } from 'vue-router'
import HistoryItem from './HistoryItem.vue'
import { canEditDocument } from './documentEditPolicy'
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
// Reprint needs a date to change AND the permission to change it. Edit and
// Reprint (a change of the document) are also only for its author within 24 h
// of its creation (documentEditPolicy.js / backend document_edit_policy.py).
const visibleActions = computed(() => props.actions.filter(action => {
  if (action === 'Edit') return !!props.routeKey && canDo('change')
  if (action === 'delete') return !!props.routeKey && canDo('delete')
  if (action === 'Reprint') return props.dateFields.length > 0 && canDo('change')
  return true
}))

const reprintOpen = ref(false)
const reprintItem = ref(null)

const EDITING = ['Edit', 'Reprint']

function actionsFor (item) {
  const editable = canEditDocument(item, User.data?.id)
  return visibleActions.value.filter(action => !EDITING.includes(action) || editable)
}

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
//
// Loaded pages form one window [firstPage, lastPage]. q-infinite-scroll
// extends it downwards (older records); near the top loadPrevious() extends it
// upwards (newer records), keeping the rows on screen where they were. The
// page and record at the top of the menu are kept per user/Entity/Branch
// (setUserPreference), so after F5 the menu reopens there instead of at page 1.
const PAGE_SIZE = 20
const HEADER_OFFSET = 98

const items = ref([])
const hasNext = ref(true)
const loaded = ref(false)
const loadError = ref(false)
const loadingPrevious = ref(false)
const scroller = ref(null)
const listRef = ref(null)

const positionName = computed(() => {
  const list = props.routeKey || props.store?.$id || 'history'
  return `history:${list}:${User.Entity?.id || '-'}:${User.Branch?.id || '-'}`
})

function readPosition() {
  try {
    const saved = JSON.parse(getUserPreference(User.data?.id, positionName.value) || 'null')
    return saved && Number.isInteger(saved.page) && saved.page > 0 ? saved : null
  } catch {
    return null
  }
}

const restored = readPosition()
const firstPage = ref(restored?.page || 1)
let nextPage = firstPage.value
let anchorId = restored?.id || null

async function fetch(page) {
  const result = await props.store.fetchPage({
    page,
    page_size: PAGE_SIZE,
    ordering: '-created_at',
    state: 'Active'
  })
  return { ...result, rows: result.rows.map(row => ({ ...row, _page: page })) }
}

// q-infinite-scroll calls this on mount and every time the user nears the
// bottom: the next (older) page is appended.
async function onLoad(_index, done) {
  try {
    let page = await fetch(nextPage)

    // a saved page that no longer exists (records deleted): start again at 1
    if (!page.rows.length && nextPage > 1 && !items.value.length) {
      firstPage.value = 1
      nextPage = 1
      anchorId = null
      page = await fetch(1)
    }

    const known = new Set(items.value.map(i => i?.id))
    items.value = [...items.value, ...page.rows.filter(i => !known.has(i?.id))]
    hasNext.value = page.hasNext
    loaded.value = true
    nextPage += 1

    if (anchorId) {
      const id = anchorId
      anchorId = null
      await nextTick()
      scrollToItem(id)
    }

    done(!page.hasNext)
  } catch {
    loadError.value = true
    loaded.value = true
    done(true)
  }
}

// The previous (newer) page, prepended without moving what is on screen.
async function loadPrevious() {
  if (loadingPrevious.value || firstPage.value <= 1) return
  loadingPrevious.value = true

  try {
    const target = scrollTarget()
    const before = target?.scrollHeight || 0
    const page = await fetch(firstPage.value - 1)

    const known = new Set(items.value.map(i => i?.id))
    items.value = [...page.rows.filter(i => !known.has(i?.id)), ...items.value]
    firstPage.value -= 1

    await nextTick()
    if (target) target.scrollTop += target.scrollHeight - before
  } catch {
    loadError.value = true
  } finally {
    loadingPrevious.value = false
  }
}

function retry() {
  loadError.value = false
  scroller.value?.resume()
  scroller.value?.trigger()
}

// ---------------- SCROLL POSITION ----------------
function scrollTarget() {
  const el = scroller.value?.$el
  return el ? scroll.getScrollTarget(el) : null
}

function itemElements() {
  const list = listRef.value?.$el
  return list ? Array.from(list.querySelectorAll(':scope > .q-item')) : []
}

function scrollToItem(id) {
  const index = filteredList.value.findIndex(i => i?.id === id)
  const el = itemElements()[index]
  const target = scrollTarget()
  if (!el || !target || !target.getBoundingClientRect) return
  target.scrollTop += el.getBoundingClientRect().top - target.getBoundingClientRect().top - HEADER_OFFSET
}

// the first record visible below the header
function topVisibleItem() {
  const target = scrollTarget()
  if (!target?.getBoundingClientRect) return null
  const top = target.getBoundingClientRect().top + HEADER_OFFSET
  const index = itemElements().findIndex(el => el.getBoundingClientRect().bottom > top)
  return index >= 0 ? filteredList.value[index] : null
}

const savePosition = debounce(() => {
  if (search.value) return // a filtered view is not a position
  const item = topVisibleItem()
  if (!item) return
  setUserPreference(User.data?.id, positionName.value, JSON.stringify({ page: item._page, id: item.id }))
}, 300)

function onScroll() {
  const target = scrollTarget()
  if (target && target.scrollTop < 60 && firstPage.value > 1 && !search.value) loadPrevious()
  savePosition()
}

// already at the top there is no 'scroll' event: pulling up (wheel/touch)
// is what asks for the newer pages
let touchY = null
function onWheel(event) {
  if (event.deltaY < 0 && (scrollTarget()?.scrollTop || 0) <= 0 && !search.value) loadPrevious()
}
function onTouchStart(event) { touchY = event.touches?.[0]?.clientY ?? null }
function onTouchMove(event) {
  const y = event.touches?.[0]?.clientY
  if (touchY !== null && y - touchY > 30 && (scrollTarget()?.scrollTop || 0) <= 0 && !search.value) loadPrevious()
}

let scrollEl = null
onMounted(() => {
  scrollEl = scrollTarget()
  scrollEl?.addEventListener('scroll', onScroll, { passive: true })
  scrollEl?.addEventListener('wheel', onWheel, { passive: true })
  scrollEl?.addEventListener('touchstart', onTouchStart, { passive: true })
  scrollEl?.addEventListener('touchmove', onTouchMove, { passive: true })
})
onBeforeUnmount(() => {
  scrollEl?.removeEventListener('scroll', onScroll)
  scrollEl?.removeEventListener('wheel', onWheel)
  scrollEl?.removeEventListener('touchstart', onTouchStart)
  scrollEl?.removeEventListener('touchmove', onTouchMove)
})
</script>
