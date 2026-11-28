<template>
  <q-page class="menu-manager q-pa-md">
    <!-- HEADER -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold">{{ tdc('Menu manager') }}</div>
        <div class="text-caption text-grey-7">
          {{ tdc('Choose what appears in the sidebar, for which modules and which profiles.') }}
        </div>
      </div>
      <div class="row q-gutter-sm">
        <q-chip dense square outline icon="menu" color="primary">
          {{ menus.length }} {{ tdc('Menus') }}
        </q-chip>
        <q-chip v-if="selected" dense square outline icon="account_tree" color="primary">
          {{ items.length }} {{ tdc('Items') }}
        </q-chip>
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <!-- MENUS -->
      <div class="col-12 col-md-4">
        <s-card :title="tdc('Menus')" icon="menu" class="menu-card">
          <template #actions>
            <s-btn flat round icon="rule" color="primary" :loading="validating" @click="runValidation">
              <s-tooltip>{{ tdc('Check the menu configuration') }}</s-tooltip>
            </s-btn>
            <s-btn flat round icon="add" color="primary" @click="openMenuDialog(null)">
              <s-tooltip>{{ tdc('New menu') }}</s-tooltip>
            </s-btn>
          </template>

          <div v-if="loadingMenus" class="flex flex-center q-pa-lg">
            <q-spinner color="primary" size="32px" />
          </div>
          <q-list v-else class="menu-list">
            <q-item
              v-for="menu in menus"
              :key="menu.id"
              clickable
              v-ripple
              :active="selected?.id === menu.id"
              active-class="menu-item-active"
              class="rounded-borders q-mb-xs"
              @click="selectMenu(menu)"
            >
              <q-item-section avatar>
                <q-avatar rounded size="36px" :color="menu.state === 'Active' ? 'primary' : 'grey-5'" text-color="white" :icon="menu.icon || 'menu'" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-medium">{{ menu.label }}</q-item-label>
                <q-item-label caption lines="2">
                  <code class="text-grey-7">{{ menu.code }}</code>
                </q-item-label>
                <div class="row q-gutter-xs q-mt-xs">
                  <q-chip v-for="app in menu.apps || []" :key="app" dense square outline size="sm" color="primary">{{ app }}</q-chip>
                  <q-chip v-if="!(menu.apps || []).length" dense square outline size="sm" color="grey-7">{{ tdc('All modules') }}</q-chip>
                  <q-chip v-if="menu.is_direct_link" dense square outline size="sm" color="secondary">{{ tdc('Direct link') }}</q-chip>
                  <q-chip v-if="menu.is_system" dense square size="sm" icon="lock" outline color="grey-7">{{ tdc('Framework menu') }}</q-chip>
                  <q-chip v-if="menu.state !== 'Active'" dense square size="sm" outline color="warning">{{ tdc('Inactive') }}</q-chip>
                </div>
              </q-item-section>
              <q-item-section side>
                <s-btn flat round size="sm" icon="edit" color="primary" @click.stop="openMenuDialog(menu)">
                  <s-tooltip>{{ tdc('Edit') }}</s-tooltip>
                </s-btn>
              </q-item-section>
            </q-item>
            <div v-if="!menus.length" class="empty-state">
              <q-icon name="menu" size="40px" color="grey-5" />
              <div class="text-grey-7 q-mt-sm">{{ tdc('No menus yet') }}</div>
            </div>
          </q-list>
        </s-card>

        <s-card v-if="issues !== null" class="q-mt-md" :title="tdc('Configuration problems')" icon="rule">
          <div v-if="issues.length">
            <div
              v-for="(issue, index) in issues"
              :key="index"
              class="row items-start no-wrap q-py-xs"
            >
              <q-icon
                :name="issue.severity === 'error' ? 'error' : 'warning'"
                :color="issue.severity === 'error' ? 'negative' : 'warning'"
                class="q-mr-sm q-mt-xs"
              />
              <div>
                <div :class="issue.severity === 'error' ? 'text-negative' : 'text-warning'">{{ issue.message }}</div>
                <div class="text-caption text-grey-7">{{ issue.code }} · {{ issue.menu_code }}</div>
              </div>
            </div>
          </div>
          <div v-else class="row items-center text-positive q-pa-sm">
            <q-icon name="check_circle" class="q-mr-sm" />{{ tdc('No problems found.') }}
          </div>
        </s-card>
      </div>

      <!-- ITEMS OF THE SELECTED MENU -->
      <div class="col-12 col-md-8">
        <s-card v-if="selected" :title="selected.label" icon="account_tree" class="menu-card">
          <template #actions>
            <s-btn
              flat round icon="create_new_folder" color="accent"
              :disable="selected.is_direct_link"
              @click="openItemDialog(null, null, 'group')"
            >
              <s-tooltip>{{ tdc('New group') }}</s-tooltip>
            </s-btn>
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

          <div v-if="loadingItems" class="flex flex-center q-pa-lg">
            <q-spinner color="primary" size="32px" />
          </div>
          <q-list v-else class="item-list">
            <q-item
              v-for="row in flatItems"
              :key="row.item.id"
              class="item-row rounded-borders"
              :style="{ marginLeft: row.depth * 24 + 'px' }"
            >
              <q-item-section avatar>
                <q-icon
                  :name="row.item.icon || (row.item.item_type === 'group' ? 'folder' : 'article')"
                  :color="row.item.item_type === 'group' ? 'accent' : 'primary'"
                  size="22px"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-medium">{{ row.item.label }}</q-item-label>
                <q-item-label caption>
                  <code v-if="row.item.route_name" class="text-grey-7">{{ row.item.route_name }}</code>
                  <span v-if="row.item.permission_code" class="q-ml-xs text-grey-6">· {{ row.item.permission_code }}</span>
                </q-item-label>
              </q-item-section>
              <q-item-section side class="gt-xs">
                <q-chip
                  dense square size="sm"
                  outline
                  :color="row.item.item_type === 'group' ? 'accent' : 'primary'"
                >{{ itemTypeLabel(row.item.item_type) }}</q-chip>
              </q-item-section>
              <q-item-section side>
                <div class="row no-wrap items-center">
                  <s-btn flat round size="sm" icon="arrow_upward" color="grey-8" :disable="!canMove(row, -1)" @click="moveItem(row, -1)">
                    <s-tooltip>{{ tdc('Move up') }}</s-tooltip>
                  </s-btn>
                  <s-btn flat round size="sm" icon="arrow_downward" color="grey-8" :disable="!canMove(row, 1)" @click="moveItem(row, 1)">
                    <s-tooltip>{{ tdc('Move down') }}</s-tooltip>
                  </s-btn>
                  <s-btn
                    v-if="row.item.item_type === 'group'"
                    flat round size="sm" icon="add_circle" color="accent"
                    @click="openItemDialog(null, row.item.id)"
                  >
                    <s-tooltip>{{ tdc('Add inside this group') }}</s-tooltip>
                  </s-btn>
                  <s-btn flat round size="sm" icon="edit" color="primary" @click="openItemDialog(row.item)">
                    <s-tooltip>{{ tdc('Edit') }}</s-tooltip>
                  </s-btn>
                  <s-btn flat round size="sm" icon="delete" color="negative" @click="confirmDeleteItem(row.item)">
                    <s-tooltip>{{ tdc('Delete') }}</s-tooltip>
                  </s-btn>
                </div>
              </q-item-section>
            </q-item>
            <div v-if="!items.length" class="empty-state">
              <q-icon name="account_tree" size="40px" color="grey-5" />
              <div class="text-grey-7 q-mt-sm">{{ tdc('This menu has no items yet') }}</div>
              <q-btn unelevated no-caps color="primary" icon="add" class="q-mt-md" :label="tdc('New item')" @click="openItemDialog(null)" />
            </div>
          </q-list>
        </s-card>
        <div v-else class="empty-state big">
          <q-icon name="touch_app" size="48px" color="grey-5" />
          <div class="text-grey-7 q-mt-sm">{{ tdc('Choose a menu to see its items') }}</div>
        </div>
      </div>
    </div>

    <!-- MENU DIALOG -->
    <q-dialog v-model="menuDialog" persistent>
      <s-modal-card :title="menuForm.id ? tdc('Edit menu') : tdc('New menu')" icon="menu" width="500px">
        <q-input v-model="menuForm.code" outlined dense :label="tdc('Code')" :hint="tdc('A short unique name, e.g. ops.main')" :disable="!!menuForm.id" />
        <q-input v-model="menuForm.label" outlined dense :label="tdc('Label')" class="q-mt-sm" :hint="tdc('The text shown in the sidebar')" />
        <q-input v-model="menuForm.name" outlined dense :label="tdc('Name')" class="q-mt-sm" />
        <q-select
          v-model="menuForm.icon"
          outlined dense use-input fill-input hide-selected input-debounce="0"
          :options="iconOptions" :label="tdc('Icon')" class="q-mt-sm"
          @filter="filterIcons"
        >
          <template #option="{ opt, itemProps }">
            <q-item v-bind="itemProps"><q-item-section avatar><q-icon :name="opt" /></q-item-section><q-item-section>{{ opt }}</q-item-section></q-item>
          </template>
        </q-select>
        <q-select
          v-model="menuForm.app_ids"
          outlined dense multiple use-chips emit-value map-options
          :options="moduleOptions" :label="tdc('Modules')" class="q-mt-sm"
          :hint="tdc('Where the menu is shown. Empty means every module.')"
        />
        <q-input v-model.number="menuForm.order" outlined dense type="number" :label="tdc('Order')" class="q-mt-sm" :hint="tdc('Lower numbers come first')" />
        <q-toggle v-model="menuForm.active" :label="tdc('Active')" class="q-mt-sm" />
        <template #footer>
          <s-btn flat :label="tdc('Cancel')" v-close-popup />
          <s-btn color="primary" :label="tdc('Save')" :loading="saving" @click="saveMenu" />
        </template>
      </s-modal-card>
    </q-dialog>

    <!-- ITEM DIALOG -->
    <q-dialog v-model="itemDialog" persistent>
      <s-modal-card :title="itemForm.id ? tdc('Edit item') : tdc('New item')" icon="article" width="540px">
        <q-input v-model="itemForm.label" outlined dense :label="tdc('Label')" :hint="tdc('The text shown in the sidebar')" />
        <q-select
          v-model="itemForm.item_type"
          outlined dense emit-value map-options
          :options="itemTypeOptions"
          :label="tdc('Type')"
          class="q-mt-sm"
          :hint="tdc('Page opens a screen; Group holds other items')"
        />
        <q-select
          v-model="itemForm.parent"
          outlined dense clearable emit-value map-options
          :options="parentOptions"
          :label="tdc('Inside')"
          class="q-mt-sm"
          :hint="tdc('Put this item inside a group of the same menu')"
        />
        <q-select
          v-if="itemForm.item_type === 'page'"
          v-model="itemForm.route_name"
          outlined dense use-input fill-input hide-selected input-debounce="0"
          :options="routeOptions" :label="tdc('Route')" class="q-mt-sm"
          :hint="tdc('The screen this item opens')"
          @filter="filterRoutes"
        />
        <q-select
          v-model="itemForm.permission_code"
          outlined dense use-input clearable new-value-mode="add-unique" input-debounce="0"
          :options="permissionOptions" :label="tdc('Permission (shows the item)')" class="q-mt-sm"
          :hint="tdc('Only profiles with this permission see the item')"
          @filter="filterPermissions"
        />
        <q-select
          v-if="itemForm.item_type === 'page'"
          v-model="itemForm.add_route_name"
          outlined dense use-input clearable input-debounce="0"
          :options="routeOptions" :label="tdc('Create route (optional)')" class="q-mt-sm"
          @filter="filterRoutes"
        />
        <q-select
          v-if="itemForm.add_route_name"
          v-model="itemForm.add_permission_code"
          outlined dense use-input clearable new-value-mode="add-unique" input-debounce="0"
          :options="permissionOptions" :label="tdc('Create permission')" class="q-mt-sm"
          @filter="filterPermissions"
        />
        <q-input v-model.number="itemForm.order" outlined dense type="number" :label="tdc('Order')" class="q-mt-sm" :hint="tdc('Lower numbers come first')" />
        <template #footer>
          <s-btn flat :label="tdc('Cancel')" v-close-popup />
          <s-btn color="primary" :label="tdc('Save')" :loading="saving" @click="saveItem" />
        </template>
      </s-modal-card>
    </q-dialog>
  </q-page>
</template>

<style scoped>
.menu-manager .menu-card {
  border-radius: 12px;
}
.menu-item-active {
  background: color-mix(in srgb, var(--q-primary) 12%, transparent);
}
.item-row {
  border-left: 3px solid transparent;
  transition: background 0.15s ease, border-color 0.15s ease;
}
.item-row:hover {
  background: color-mix(in srgb, var(--q-primary) 6%, transparent);
  border-left-color: var(--q-primary);
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  text-align: center;
}
.empty-state.big {
  min-height: 240px;
}
</style>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { tdc, url, HTTPAuth, sDialog } from 'quasar_resaas'

// Menu Manager (platform administration, Root only): the API is
// /api/django_resaas/menus/ and /menuitems/ (phase 13). The backend decides
// every permission; these controls only offer what the server accepts.

const router = useRouter()

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

// choice lists: the routes this frontend has, the permission codes the server
// knows, the modules (apps) and a few icons
const allRoutes = router.getRoutes().map((route) => route.name).filter((name) => typeof name === 'string').sort()
const routeOptions = ref(allRoutes)
const permissionAll = ref([])
const permissionOptions = ref([])
const moduleAll = ref([])
const moduleOptions = ref([])
const ICONS = ['menu', 'folder', 'article', 'account_tree', 'dashboard', 'people', 'receipt_long', 'inventory_2',
  'local_hospital', 'school', 'settings', 'admin_panel_settings', 'bar_chart', 'shopping_cart', 'event', 'build', 'rule', 'extension']
const iconOptions = ref(ICONS)

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

function filterFrom(all, val, update, target) {
  update(() => {
    const needle = (val || '').toLowerCase()
    target.value = needle ? all.filter((option) => option.toLowerCase().includes(needle)) : all
  })
}

function filterRoutes(val, update) {
  filterFrom(allRoutes, val, update, routeOptions)
}

function filterPermissions(val, update) {
  filterFrom(permissionAll.value, val, update, permissionOptions)
}

function filterIcons(val, update) {
  filterFrom(ICONS, val, update, iconOptions)
}

async function loadChoices() {
  const [perms, apps] = await Promise.all([
    HTTPAuth.get(api('menus/permissions/')),
    HTTPAuth.get(api('apps/', { page_size: 0 })),
  ])
  permissionAll.value = ROWS(perms.data)
  permissionOptions.value = permissionAll.value
  moduleAll.value = ROWS(apps.data)
  moduleOptions.value = moduleAll.value.map((app) => ({ label: app.name, value: app.id }))
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

// up/down: swap the order with the neighbour inside the same parent
function siblingsOf(row) {
  return items.value
    .filter((item) => (item.parent ?? null) === (row.item.parent ?? null))
    .sort((a, b) => (a.order - b.order) || a.label.localeCompare(b.label))
}

function canMove(row, direction) {
  const siblings = siblingsOf(row)
  const index = siblings.findIndex((item) => item.id === row.item.id)
  return index + direction >= 0 && index + direction < siblings.length
}

async function moveItem(row, direction) {
  const siblings = siblingsOf(row)
  const index = siblings.findIndex((item) => item.id === row.item.id)
  const other = siblings[index + direction]
  if (!other) return
  // swap the two order values (they may not be 0..n, so the values are exchanged)
  const mine = row.item.order
  const theirs = other.order
  await HTTPAuth.patch(api(`menuitems/${row.item.id}/`), { order: theirs })
  await HTTPAuth.patch(api(`menuitems/${other.id}/`), { order: mine })
  await loadItems()
}

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
        order: menu.order, active: menu.state === 'Active',
        app_ids: moduleAll.value.filter((app) => (menu.apps || []).includes(app.name)).map((app) => app.id) }
    : { code: '', name: '', label: '', icon: 'menu', order: 0, active: true, app_ids: [] }
  menuDialog.value = true
}

async function saveMenu() {
  saving.value = true
  const body = {
    code: menuForm.value.code, name: menuForm.value.name || menuForm.value.code,
    label: menuForm.value.label, icon: menuForm.value.icon, order: menuForm.value.order || 0,
    state: menuForm.value.active ? 'Active' : 'Inactive',
    app_ids: menuForm.value.app_ids || [],
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

// a new item can be placed inside a group directly (parentId); editing keeps its parent
function openItemDialog(item, parentId = null, type = 'page') {
  itemForm.value = item
    ? { id: item.id, label: item.label, icon: item.icon, item_type: item.item_type,
        parent: item.parent, route_name: item.route_name, permission_code: item.permission_code,
        add_route_name: item.add_route_name, add_permission_code: item.add_permission_code, order: item.order }
    : { label: '', icon: type === 'group' ? 'folder' : '', item_type: type, parent: parentId, route_name: '', permission_code: '',
        add_route_name: '', add_permission_code: '',
        order: itemsIn(parentId).length }
  itemDialog.value = true
}

// how many items already sit under this parent (new ones go to the end)
function itemsIn(parentId) {
  return items.value.filter((item) => (item.parent ?? null) === (parentId ?? null))
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

onMounted(async () => {
  await loadChoices()
  await loadMenus()
})
</script>
