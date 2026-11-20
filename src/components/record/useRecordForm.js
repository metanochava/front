// The plumbing every manual add_/change_ page shares (one page serves both):
// load the record (change) or a fresh form (add), save through the model's
// BaseStore, field errors at their fields (store.errors), then the record's
// page or the list. Each page keeps its own template - which fields, in
// which sections, shown when.
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { tdc, useUserStore } from 'quasar_resaas'

export function useRecordForm (store, { model, defaults = () => ({}) }) {
  const route = useRoute()
  const router = useRouter()
  const User = useUserStore()

  const name = model.toLowerCase()
  const ready = ref(false)
  const saving = ref(false)
  const generalError = ref('')

  const isEdit = computed(() => Boolean(route.params.id))
  const canSave = computed(() => User.can(isEdit.value ? `change_${name}` : `add_${name}`))

  // the value of a choice / relation as the API reads it ({value, label} or {id, ...})
  const valueOf = (value) => (value && typeof value === 'object') ? (value.value ?? value.id) : value

  function fieldOf (fieldName) {
    return (store.fields || []).find(f => f.name === fieldName) || { name: fieldName, type: 'CharField', label: fieldName }
  }

  // why a field cannot change on this record (serializer locked_fields), if it cannot
  function locked (fieldName) {
    const reasons = store.row?.locked_fields
    return (reasons && typeof reasons === 'object' && reasons[fieldName]) || ''
  }

  async function load () {
    ready.value = false
    await store.init()
    if (route.params.id) {
      store.row = await store.getById(route.params.id)
      store.form = { ...store.row }
    } else {
      store.resetForm()
      store.form = { ...store.form, ...defaults() }
    }
    ready.value = true
  }

  function back () {
    if (window.history.length > 1) router.back()
    else router.push({ name: `list_${name}` })
  }

  async function save () {
    if (!canSave.value || saving.value) return
    saving.value = true
    generalError.value = ''
    try {
      const data = await store.save()
      const id = data?.id || route.params.id
      if (id && router.hasRoute(`view_${name}`) && User.can(`view_${name}`)) router.push({ name: `view_${name}`, params: { id } })
      else router.push({ name: `list_${name}` })
    } catch (error) {
      // field errors are at their fields; anything else here
      const failure = error?.response?.data?.error
      if (!Object.keys(store.errors || {}).length) generalError.value = failure?.message || tdc('Could not save.')
    } finally {
      saving.value = false
    }
  }

  watch(() => route.params.id, (now, before) => { if (now !== before) load() })

  return { ready, saving, generalError, isEdit, canSave, valueOf, fieldOf, locked, load, back, save }
}
