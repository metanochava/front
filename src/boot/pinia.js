import { defineBoot } from '#q-app/wrappers'
import { createPinia, setActivePinia } from 'pinia'

export default defineBoot(() => {
  const pinia = createPinia()
  setActivePinia(pinia)
})
