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
    alias: [
      // the client build, not the SSR one (no ssrContext in the tests); exact
      // match only, so 'quasar/wrappers' etc. keep resolving normally
      { find: /^quasar$/, replacement: 'quasar/dist/quasar.client.js' },
      ...Object.entries({
        src: './src',
        app: './',
        components: './src/components',
        layouts: './src/layouts',
        pages: './src/pages',
        assets: './src/assets',
        boot: './src/boot',
        stores: './src/stores',
      }).map(([name, path]) => ({ find: new RegExp(`^${name}(?=/|$)`), replacement: at(path) })),
    ],
  },
  test: {
    environment: 'happy-dom',
    // quasar_resaas ships source (.vue, extensionless imports) for Vite to
    // compile, exactly as the app build does - never as a plain Node module
    server: { deps: { inline: ['quasar_resaas'] } },
    include: ['src/**/*.spec.js'],
    // importing every page compiles a large part of the app
    testTimeout: 60000,
  },
})
