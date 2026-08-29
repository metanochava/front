import js from '@eslint/js'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import pluginQuasar from '@quasar/app-vite/eslint'
import prettierSkipFormatting from '@vue/eslint-config-prettier/skip-formatting'

import fs from 'node:fs'


// =========================================================
// AUTO IMPORT GLOBALS
// =========================================================

let autoImportGlobals = {}

try {

  const content = fs.readFileSync(
    './.eslintrc-auto-import.json',
    'utf-8'
  )

  autoImportGlobals =
    JSON.parse(content)?.globals || {}

} catch {

  autoImportGlobals = {}

}


export default [

  {
    // ignores
  },


  ...pluginQuasar.configs.recommended(),

  js.configs.recommended,

  ...pluginVue.configs['flat/essential'],


  // =========================================================
  // GLOBAL CONFIG
  // =========================================================

  {

    languageOptions: {

      ecmaVersion: 'latest',

      sourceType: 'module',

      globals: {

        ...globals.browser,

        ...globals.node,


        // =====================================
        // AUTO IMPORT
        // =====================================

        ...autoImportGlobals,


        // =====================================
        // CUSTOM
        // =====================================

        process: 'readonly',

        ga: 'readonly',

        cordova: 'readonly',

        Capacitor: 'readonly',

        chrome: 'readonly',

        browser: 'readonly',
      },
    },


    rules: {

      'prefer-promise-reject-errors': 'off',

      'no-debugger':
        process.env.NODE_ENV === 'production'
          ? 'error'
          : 'off',
    },
  },


  // =========================================================
  // SERVICE WORKER
  // =========================================================

  {
    files: [
      'src-pwa/custom-service-worker.js'
    ],

    languageOptions: {

      globals: {

        ...globals.serviceworker,

      },
    },
  },


  prettierSkipFormatting,
]
