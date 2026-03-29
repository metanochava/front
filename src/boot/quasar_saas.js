import { setPinia } from 'quasar_resaas/core/context'

export default ({ app }) => {
  const pinia = app.config.globalProperties.$pinia
  setPinia(pinia)
}
