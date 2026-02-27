import { setPinia } from '@metano/quasar_rest_auth/core/context'

export default ({ app }) => {
  const pinia = app.config.globalProperties.$pinia
  setPinia(pinia)
}
