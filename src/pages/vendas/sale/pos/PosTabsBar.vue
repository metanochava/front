<template>
  <div ref="barRef" class="pos-tabs row no-wrap items-center">
    <!-- the tables (hospitality), only when the caller may see them -->
    <button
      v-if="showTables"
      type="button"
      class="pos-tab"
      :class="{ 'pos-tab--active': tablesOpen, 'pos-tab--dark': $q.dark.isActive }"
      data-test="pos-tables"
      @click="emit('tables')"
    >
      <q-icon name="table_restaurant" size="18px" />
      <span class="pos-tab__label">{{ tdc('Tables') }}</span>
      <q-badge v-if="calling" color="warning" text-color="black" rounded data-test="pos-tables-calling">{{ calling }}</q-badge>
      <s-tooltip>{{ tdc('The tables and what their customers asked') }}</s-tooltip>
    </button>

    <button
      type="button"
      class="pos-tab"
      :class="{ 'pos-tab--active': !tablesOpen && modelValue === null, 'pos-tab--dark': $q.dark.isActive }"
      data-test="pos-quick-sale"
      @click="emit('update:modelValue', null)"
    >
      <q-icon name="bolt" size="18px" />
      <span class="pos-tab__label">{{ tdc('Quick sale') }}</span>
      <s-tooltip>{{ tdc('Sell and pay at once, without a tab') }}</s-tooltip>
    </button>

    <!-- the open tabs: only those that fit; the rest behind the expand button -->
    <div ref="stripRef" class="pos-tabs__strip row no-wrap items-center" data-test="pos-tabs-strip">
      <button
        v-for="t in visibleTabs" :key="t.id"
        type="button"
        class="pos-tab"
        :class="{ 'pos-tab--active': isActive(t), 'pos-tab--dark': $q.dark.isActive }"
        data-test="pos-tab"
        @click="emit('update:modelValue', t.id)"
      >
        <span v-if="isOld(t)" class="pos-tab__dot" />
        <span class="pos-tab__label">{{ t.tab_label }}</span>
        <span class="pos-tab__total">{{ money(t.total) }}</span>
        <s-tooltip>{{ details(t) }}</s-tooltip>
      </button>
    </div>

    <!-- every tab, invisible, only to measure their widths -->
    <div ref="measureRef" class="pos-tabs__measure row no-wrap" aria-hidden="true">
      <span v-for="t in tabs" :key="t.id" :data-id="t.id" class="pos-tab">
        <span v-if="isOld(t)" class="pos-tab__dot" />
        <span class="pos-tab__label">{{ t.tab_label }}</span>
        <span class="pos-tab__total">{{ money(t.total) }}</span>
      </span>
    </div>

    <s-btn
      v-if="hiddenCount"
      round unelevated color="grey-7" icon="expand_more" class="pos-tabs__more"
      data-test="pos-tabs-more"
      @click="allOpen = true"
    >
      <q-badge floating color="primary" rounded data-test="pos-tabs-more-count">+{{ hiddenCount }}</q-badge>
      <s-tooltip>{{ tdc('See every open tab') }}</s-tooltip>
    </s-btn>

    <s-btn
      round unelevated color="primary" icon="add" class="q-ml-xs pos-tabs__new"
      data-test="pos-new-tab"
      @click="emit('new')"
    >
      <s-tooltip>{{ tdc('New tab') }}</s-tooltip>
    </s-btn>

    <!-- every open tab; only the body scrolls when there are many -->
    <q-dialog v-model="allOpen">
      <s-modal-card :title="`${tdc('Open tabs')} (${tabs.length})`" icon="table_bar" width="460px">
        <q-list separator data-test="pos-tabs-all">
          <q-item
            v-for="t in tabs" :key="t.id"
            v-close-popup
            clickable
            :active="isActive(t)"
            active-class="pos-tabs__all-active"
            data-test="pos-tabs-all-item"
            @click="emit('update:modelValue', t.id)"
          >
            <q-item-section avatar>
              <q-icon :name="isOld(t) ? 'schedule' : 'receipt_long'" :color="isOld(t) ? 'warning' : 'primary'" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium">{{ t.tab_label }}</q-item-label>
              <q-item-label caption>{{ details(t) }}</q-item-label>
            </q-item-section>
            <q-item-section side class="text-weight-medium">{{ money(t.total) }}</q-item-section>
          </q-item>
        </q-list>

        <template #footer>
          <s-btn flat :label="tdc('Close')" data-test="pos-tabs-all-close" @click="allOpen = false">
            <s-tooltip>{{ tdc('Close without changing the tab') }}</s-tooltip>
          </s-btn>
        </template>
      </s-modal-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { tdc } from 'quasar_resaas'
import { fitTabs, GAP, MORE_WIDTH } from './posTabsFit'

// The point of sale's bar: the tables, the quick sale, the open tabs (any
// device of the branch adds to them) and "new tab". The open tabs live in
// their own container showing those that fit; when some do not, an expand
// button (+N) opens a dialog with every one of them (its body scrolls). The
// selected tab is always among the visible ones.
const props = defineProps({
  tabs: { type: Array, default: () => [] },
  modelValue: { type: String, default: null },   // null = quick sale
  showTables: { type: Boolean, default: false },
  tablesOpen: { type: Boolean, default: false },
  calling: { type: Number, default: 0 },          // customers' open requests
})
const emit = defineEmits(['update:modelValue', 'new', 'tables'])

const OLD_AFTER_MS = 3 * 60 * 60 * 1000   // open for more than 3 hours

const barRef = ref(null)
const stripRef = ref(null)
const measureRef = ref(null)
const allOpen = ref(false)
const visibleIds = ref(null)               // null = not measured yet: show all

const visibleTabs = computed(() =>
  visibleIds.value ? props.tabs.filter(t => visibleIds.value.has(t.id)) : props.tabs
)
const hiddenCount = computed(() => props.tabs.length - visibleTabs.value.length)

function isActive (tab) {
  return !props.tablesOpen && props.modelValue === tab.id
}

function measure () {
  const strip = stripRef.value
  const box = measureRef.value
  if (!strip || !box) return
  const widths = {}
  for (const el of box.children) widths[el.dataset.id] = el.offsetWidth
  // while the expand button shows the strip is narrower by it: count it back
  const room = strip.clientWidth + (hiddenCount.value ? MORE_WIDTH + GAP : 0)
  visibleIds.value = fitTabs(props.tabs, widths, room, props.modelValue)
}

let observer = null
onMounted(() => {
  nextTick(measure)
  if (typeof ResizeObserver !== 'undefined' && barRef.value) {
    observer = new ResizeObserver(() => measure())
    observer.observe(barRef.value)
  }
})
onBeforeUnmount(() => observer?.disconnect())
watch(() => [props.tabs, props.modelValue], () => nextTick(measure), { deep: true })

function isOld (tab) {
  return Date.now() - new Date(tab.created_at).getTime() > OLD_AFTER_MS
}

function time (value) {
  return new Date(value).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

function money (v) {
  return new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(v) || 0)
}

function details (t) {
  return `${t.customer_label ? t.customer_label + ' · ' : ''}${t.line_count || 0} ${tdc('Items')}`
    + ` · ${tdc('Open since')} ${time(t.created_at)}`
    + (isOld(t) ? ` · ${tdc('Open for a long time')}` : '')
}

defineExpose({ measure })
</script>

<style scoped>
.pos-tabs {
  position: relative;
  gap: 8px;
  padding: 2px 2px 8px;
}

/* the open tabs take the room left between "quick sale" and the buttons */
.pos-tabs__strip {
  flex: 1 1 auto;
  min-width: 0;
  gap: 8px;
  overflow: hidden;
}

.pos-tabs__measure {
  position: absolute;
  left: 0;
  top: 0;
  gap: 8px;
  height: 0;
  overflow: visible;
  visibility: hidden;
  pointer-events: none;
}

.pos-tab {
  position: relative;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid rgba(128, 128, 128, 0.25);
  background: #fff;
  color: inherit;
  font: inherit;
  font-size: 0.9rem;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s ease, color 0.15s ease;
  -webkit-tap-highlight-color: transparent;
}
.pos-tab--dark { background: #1f1f24; border-color: rgba(255, 255, 255, 0.1); }
.pos-tab--active { background: var(--q-primary); border-color: var(--q-primary); color: #fff; }
.pos-tab__label { font-weight: 600; max-width: 140px; overflow: hidden; text-overflow: ellipsis; }
.pos-tab__total { opacity: 0.75; font-size: 0.8rem; }
.pos-tab__dot { width: 8px; height: 8px; border-radius: 50%; background: var(--q-warning); }
.pos-tabs__more,
.pos-tabs__new { flex: 0 0 auto; }
.pos-tabs__all-active { background: rgba(25, 118, 210, 0.12); font-weight: 600; }
</style>
