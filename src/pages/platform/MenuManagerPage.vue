<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <!-- MENUS -->
      <div class="col-12 col-md-4">
        <s-card :title="tdc('Menus')" icon="menu">
          <template #actions>
            <s-btn flat round icon="add" color="primary" @click="openMenuDialog(null)">
              <s-tooltip>{{ tdc('New menu') }}</s-tooltip>
            </s-btn>
            <s-btn flat round icon="rule" color="primary" :loading="validating" @click="runValidation">
              <s-tooltip>{{ tdc('Check the menu configuration') }}</s-tooltip>
            </s-btn>
          </template>

          <div v-if="loadingMenus" class="flex flex-center q-pa-md">
            <q-spinner size="32px" />
          </div>
          <q-list v-else separator>
            <q-item
              v-for="menu in menus"
              :key="menu.id"
              clickable
              :active="selected?.id === menu.id"
              @click="selectMenu(menu)"
            >
              <q-item-section avatar>
                <q-icon :name="menu.icon || 'menu'" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ menu.label }}</q-item-label>
                <q-item-label caption>
                  {{ menu.code }}
                  <span v-if="menu.is_direct_link">· {{ tdc('Direct link') }}</span>
                  <span v-if="menu.is_system">· {{ tdc('Framework menu') }}</span>
                  <span v-if="menu.state !== 'Active'">· {{ tdc('Inactive') }}</span>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <s-btn flat round size="sm" icon="edit" color="primary" @click.stop="openMenuDialog(menu)">
                  <s-tooltip>{{ tdc('Edit') }}</s-tooltip>
                </s-btn>
              </q-item-section>
            </q-item>
            <div v-if="!menus.length" class="text-caption text-grey-6 q-pa-md text-center">
              {{ tdc('No menus yet') }}
            </div>
          </q-list>
        </s-card>

        <s-card v-if="issues !== null" class="q-mt-md" :title="tdc('Configuration problems')" icon="rule">
          <q-list v-if="issues.length" separator dense>
            <q-item v-for="(issue, index) in issues" :key="index">
              <q-item-section>
                <q-item-label :class="issue.severity === 'error' ? 'text-negative' : 'text-warning'">
                  {{ issue.message }}
                </q-item-label>
                <q-item-label caption>{{ issue.code }} · {{ issue.menu_code }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <div v-else class="text-caption text-positive q-pa-md">{{ tdc('No problems found.') }}</div>
        </s-card>
      </div>

      <!-- ITEMS OF THE SELECTED MENU -->
      <div class="col-12 col-md-8">
        <s-card v-if="selected" :title="selected.label" icon="account_tree">
          <template #actions>
            <s-btn
              flat round icon="add" color="primary"
              :disable="selected.is_direct_link && items.length >= 1"
              @click="openItemDialog(null)"
            >
              <s-tooltip>{{ tdc('New item') }}</s-tooltip>
            </s-btn>
            <s-btn
              flat round icon="delete" color="negative"
              :disable="selected.is_system"
              @click="confirmDeleteMenu"
            >
              <s-tooltip>{{ selected.is_system ? tdc('A framework menu cannot be deleted') : tdc('Delete menu') }}</s-tooltip>
            </s-btn>
          </template>

          <div v-if="loadingItems" class="flex flex-center q-pa-md">
            <q-spinner size="32px" />
          </div>
          <q-list v-else separator>
            <q-item v-for="row in flatItems" :key="row.item.id" :style="{ paddingLeft: 16 + row.depth * 24 + 'px' }">
              <q-item-section avatar>
                <q-icon :name="row.item.icon || (row.item.item_type === 'group' ? 'folder' : 'article')" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ row.item.label }}</q-item-label>
                <q-item-label caption>
                  {{ itemTypeLabel(row.item.item_type) }}
                  <span v-if="row.item.route_name">· {{ row.item.route_name }}</span>
                  <span v-if="row.item.permission_code">· {{ tdc('Permission') }}: {{ row.item.permission_code }}</span>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="row no-wrap">
                  <s-btn flat round size="sm" icon="edit" color="primary" @click="openItemDialog(row.item)">
                    <s-tooltip>{{ tdc('Edit') }}</s-tooltip>
                  </s-btn>
                  <s-btn flat round size="sm" icon="delete" color="negative" @click="confirmDeleteItem(row.item)">
                    <s-tooltip>{{ tdc('Delete') }}</s-tooltip>
                  </s-btn>
                </div>
              </q-item-section>
            </q-item>
            <div v-if="!items.length" class="text-caption text-grey-6 q-pa-md text-center">
              {{ tdc('This menu has no items yet') }}
            </div>
          </q-list>
        </s-card>
        <div v-else class="text-caption text-grey-6 q-pa-md text-center">
          {{ tdc('Choose a menu to see its items') }}
        </div>
      </div>
    </div>

    <!-- MENU DIALOG -->
    <q-dialog v-model="menuDialog" persistent>
      <s-modal-card :title="menuForm.id ? tdc('Edit menu') : tdc('New menu')" icon="menu" width="460px">
        <q-input v-model="menuForm.code" outlined dense :label="tdc('Code')" :disable="!!menuForm.id" />
        <q-input v-model="menuForm.name" outlined dense :label="tdc('Name')" class="q-mt-sm" />
        <q-input v-model="menuForm.label" outlined dense :label="tdc('Label')" class="q-mt-sm" />
        <q-input v-model="menuForm.icon" outlined dense :label="tdc('Icon')" class="q-mt-sm" />
        <q-input v-model.number="menuForm.order" outlined dense type="number" :label="tdc('Order')" class="q-mt-sm" />
        <q-toggle v-model="menuForm.active" :label="tdc('Active')" class="q-mt-sm" />
        <template #footer>
          <s-btn flat :label="tdc('Cancel')" v-close-popup />
          <s-btn color="primary" :label="tdc('Save')" :loading="saving" @click="saveMenu" />
        </template>
      </s-modal-card>
    </q-dialog>

    <!-- ITEM DIALOG -->
    <q-dialog v-model="itemDialog" persistent>
      <s-modal-card :title="itemForm.id ? tdc('Edit item') : tdc('New item')" icon="article" width="520px">
        <q-input v-model="itemForm.label" outlined dense :label="tdc('Label')" />
        <q-input v-model="itemForm.icon" outlined dense :label="tdc('Icon')" class="q-mt-sm" />
        <q-select
          v-model="itemForm.item_type"
          outlined dense emit-value map-options
          :options="itemTypeOptions"
          :label="tdc('Type')"
          class="q-mt-sm"
        />
        <q-select
          v-model="itemForm.parent"
          outlined dense clearable emit-value map-options
          :options="parentOptions"
          :label="tdc('Inside')"
          class="q-mt-sm"
        />
        <q-input v-if="itemForm.item_type === 'page'" v-model="itemForm.route_name" outlined dense :label="tdc('Route')" class="q-mt-sm" />
        <q-input v-model="itemForm.permission_code" outlined dense :label="tdc('Permission (shows the item)')" class="q-mt-sm" />
        <q-input v-model="itemForm.add_route_name" outlined dense :label="tdc('Create route (optional)')" class="q-mt-sm" />
        <q-input v-model="itemForm.add_permission_code" outlined dense :label="tdc('Create permission')" class="q-mt-sm" />
        <q-input v-model.number="itemForm.order" outlined dense type="number" :label="tdc('Order')" class="q-mt-sm" />
        <template #footer>
          <s-btn flat :label="tdc('Cancel')" v-close-popup />
          <s-btn color="primary" :label="tdc('Save')" :loading="saving" @click="saveItem" />
        </template>
      </s-modal-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { tdc, url, HTTPAuth, sDialog } from 'quasar_resaas'

// Menu Manager (platform administration, Root only): the API is
// /api/django_resaas/menus/ and /api/django_resaas/menuitems/ (phase 13).
// The backend decides every permission; these buttons only hide what the
// server would refuse.

const menus = ref([])
const items = ref([])
const selected = ref(null)
const issues = ref(null)
const loadingMenus = ref(false)
const loadingItems = ref(false)
const validating = ref(false)
const saving = ref(false)

const menuDialog = ref(false)
const itemDialog = ref(false)
const menuForm = ref({})
const itemForm = ref({})

const itemTypeOptions = [
  { label: tdc('Group'), value: 'group' },
  { label: tdc('Page'), value: 'page' },
  { label: tdc('Resource'), value: 'resource' },
]

const ROWS = (data) => (Array.isArray(data) ? data : data?.results || [])

// the project's endpoint helper (same as the other pages): url({ type: 'u', url, params })
function api(path, params) {
  return url({ type: 'u', url: `django_resaas/${path}`, params })
}

async function loadMenus() {
  loadingMenus.value = true
  try {
    const { data } = await HTTPAuth.get(api('menus/', { page_size: 0 }))
    menus.value = ROWS(data)
  } finally {
    loadingMenus.value = false
  }
}

async function loadItems() {
  if (!selected.value) return
  loadingItems.value = true
  try {
    const { data } = await HTTPAuth.get(api('menuitems/', { menu: selected.value.id, page_size: 0 }))
    items.value = ROWS(data)
  } finally {
    loadingItems.value = false
  }
}

function selectMenu(menu) {
  selected.value = menu
  loadItems()
}

// the item tree, depth first, in the order the server returned (order, label)
const flatItems = computed(() => {
  const byParent = new Map()
  for (const item of items.value) {
    const key = item.parent ?? null
    if (!byParent.has(key)) byParent.set(key, [])
    byParent.get(key).push(item)
  }
  const out = []
  const visit = (parentId, depth, seen) => {
    for (const item of byParent.get(parentId) || []) {
      if (seen.has(item.id)) continue // a cycle in the data is shown once, never looped
      out.push({ item, depth })
      visit(item.id, depth + 1, new Set([...seen, item.id]))
    }
  }
  visit(null, 0, new Set())
  return out
})

const parentOptions = computed(() =>
  items.value
    .filter((item) => item.item_type === 'group' && item.id !== itemForm.value.id)
    .map((item) => ({ label: item.label, value: item.id }))
)

function itemTypeLabel(type) {
  return itemTypeOptions.find((option) => option.value === type)?.label || type
}

function openMenuDialog(menu) {
  menuForm.value = menu
    ? { id: menu.id, code: menu.code, name: menu.name, label: menu.label, icon: menu.icon,
        order: menu.order, active: menu.state === 'Active' }
    : { code: '', name: '', label: '', icon: 'menu', order: 0, active: true }
  menuDialog.value = true
}

async function saveMenu() {
  saving.value = true
  const body = {
    code: menuForm.value.code, name: menuForm.value.name || menuForm.value.code,
    label: menuForm.value.label, icon: menuForm.value.icon, order: menuForm.value.order || 0,
    state: menuForm.value.active ? 'Active' : 'Inactive',
  }
  try {
    if (menuForm.value.id) {
      await HTTPAuth.patch(api(`menus/${menuForm.value.id}/`), body)
    } else {
      await HTTPAuth.post(api('menus/'), body)
    }
    menuDialog.value = false
    await loadMenus()
  } finally {
    saving.value = false
  }
}

function openItemDialog(item) {
  itemForm.value = item
    ? { id: item.id, label: item.label, icon: item.icon, item_type: item.item_type,
        parent: item.parent, route_name: item.route_name, permission_code: item.permission_code,
        add_route_name: item.add_route_name, add_permission_code: item.add_permission_code, order: item.order }
    : { label: '', icon: '', item_type: 'page', parent: null, route_name: '', permission_code: '',
        add_route_name: '', add_permission_code: '', order: items.value.length }
  itemDialog.value = true
}

async function saveItem() {
  saving.value = true
  const body = {
    menu: selected.value.id, parent: itemForm.value.parent || null,
    label: itemForm.value.label, icon: itemForm.value.icon || '', order: itemForm.value.order || 0,
    item_type: itemForm.value.item_type, route_name: itemForm.value.route_name || '',
    permission_code: itemForm.value.permission_code || '',
    add_route_name: itemForm.value.add_route_name || '',
    add_permission_code: itemForm.value.add_permission_code || '',
  }
  try {
    if (itemForm.value.id) {
      await HTTPAuth.patch(api(`menuitems/${itemForm.value.id}/`), body)
    } else {
      await HTTPAuth.post(api('menuitems/'), body)
    }
    itemDialog.value = false
    await loadItems()
  } finally {
    saving.value = false
  }
}

function confirmDeleteMenu() {
  sDialog({
    title: tdc('Delete menu'),
    message: tdc('Delete this menu and its items from the navigation?'),
    cancel: { flat: true, label: tdc('No') },
    ok: { color: 'negative', label: tdc('Delete') },
    persistent: true,
  }).onOk(async () => {
    await HTTPAuth.delete(api(`menus/${selected.value.id}/`))
    selected.value = null
    items.value = []
    await loadMenus()
  })
}

function confirmDeleteItem(item) {
  sDialog({
    title: tdc('Delete item'),
    message: tdc('Delete this item from the menu?'),
    cancel: { flat: true, label: tdc('No') },
    ok: { color: 'negative', label: tdc('Delete') },
    persistent: true,
  }).onOk(async () => {
    await HTTPAuth.delete(api(`menuitems/${item.id}/`))
    await loadItems()
  })
}

async function runValidation() {
  validating.value = true
  try {
    const { data } = await HTTPAuth.get(api('menus/validate/'))
    issues.value = Array.isArray(data) ? data : []
  } finally {
    validating.value = false
  }
}

onMounted(loadMenus)
</script>
