// This application's right menus (saude). quasar_resaas only keeps the
// registry (useMenuStore().registerRightMenu); the application fills it.
import { useMenuStore } from 'quasar_resaas'
import { setupRightMenus } from 'src/core/rightMenus'

export default ({ app }) => {
  setupRightMenus(useMenuStore(app.config.globalProperties.$pinia))
}
