import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { quasar } from '@quasar/vite-plugin'
import AutoImport from 'unplugin-auto-import/vite'
import RESAAS_AUTO_IMPORTS from 'quasar_resaas/auto-imports'

// The test build resolves the application code the way `quasar build` does:
// the same path aliases as .quasar/tsconfig.json and the same auto-imports
// as quasar.config.js (vitePlugins), so a spec that imports a page fails
// exactly where the real build would.
const at = (path) => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  plugins: [
    vue(),
    quasar(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        {
          quasar: ['useQuasar', 'date', 'debounce', 'throttle'],
          quasar_resaas: RESAAS_AUTO_IMPORTS,
        },
      ],
      vueTemplate: true,
      dts: false,
    }),
  ],
  resolve: {
    alias: {
      // the client build, not the SSR one (no ssrContext in the tests)
      quasar: 'quasar/dist/quasar.client.js',
      src: at('./src'),
      app: at('./'),
      components: at('./src/components'),
      layouts: at('./src/layouts'),
      pages: at('./src/pages'),
      assets: at('./src/assets'),
      boot: at('./src/boot'),
      stores: at('./src/stores'),
    },
  },
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.spec.js'],
    // importing every page compiles a large part of the app
    testTimeout: 60000,
  },
})
