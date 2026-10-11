// Code blocks of the RESAAS docs, rendered with the same editor as the
// Scaffold IDE (quasar_resaas components/scaffold/CodeEditor.vue): CodeMirror 6 -
// syntax colours per language, line numbers, active line, code folding - read
// only. Like the IDE, the theme follows the site: light by default
// (CodeMirror's defaultHighlightStyle), One Dark under Quasar's body--dark,
// switched live when the visitor toggles the theme. render.js emits each block as
// <div class="rs-code" data-lang="..."><bar/><pre><code>raw</code></pre></div>;
// the <pre> stays in the DOM (hidden) as the source for "copy" and as the
// fallback when the editor cannot be created.
import { Compartment, EditorState } from '@codemirror/state'
import {
  EditorView, lineNumbers, highlightActiveLine, highlightActiveLineGutter,
  highlightSpecialChars, drawSelection
} from '@codemirror/view'
import {
  StreamLanguage, foldGutter, codeFolding, bracketMatching, syntaxHighlighting, defaultHighlightStyle
} from '@codemirror/language'
import { python } from '@codemirror/lang-python'
import { javascript } from '@codemirror/lang-javascript'
import { json } from '@codemirror/lang-json'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { shell } from '@codemirror/legacy-modes/mode/shell'
import { oneDark } from '@codemirror/theme-one-dark'

// fence language of the markdown -> CodeMirror language (anything else: plain
// text, still with line numbers)
const LANGUAGES = {
  python: () => python(),
  py: () => python(),
  js: () => javascript(),
  javascript: () => javascript(),
  mjs: () => javascript(),
  ts: () => javascript({ typescript: true }),
  typescript: () => javascript({ typescript: true }),
  json: () => json(),
  jsonc: () => json(),
  vue: () => html(),
  html: () => html(),
  xml: () => html(),
  css: () => css(),
  scss: () => css(),
  bash: () => StreamLanguage.define(shell),
  sh: () => StreamLanguage.define(shell),
  shell: () => StreamLanguage.define(shell),
  console: () => StreamLanguage.define(shell)
}

export function languageOf (fence) {
  const factory = LANGUAGES[String(fence || '').toLowerCase()]
  return factory ? factory() : []
}

// layout shared by both themes; colours come from the site's CSS variables
// (css/resaas.css: --rs-code-*, light by default, dark under .body--dark)
const docsTheme = EditorView.theme({
  '&': { fontSize: '13.5px', color: 'var(--rs-code-text)', backgroundColor: 'var(--rs-code-bg)' },
  '.cm-scroller': { fontFamily: 'var(--rs-mono)', lineHeight: '1.6' },
  '.cm-gutters': {
    color: 'var(--rs-code-bar-text)',
    backgroundColor: 'var(--rs-code-bg)',
    borderRight: '1px solid var(--rs-code-gutter-line)'
  },
  '.cm-activeLine, .cm-activeLineGutter': { backgroundColor: 'var(--rs-code-hover)' },
  '.cm-content': { padding: '12px 0' },
  '&.cm-focused': { outline: 'none' }
})

// editors alive on the page
let views = []

const isDark = () => document.body.classList.contains('body--dark')
const themeFor = (dark) => dark ? [oneDark, docsTheme] : [syntaxHighlighting(defaultHighlightStyle), docsTheme]
const themeCompartment = new Compartment()

// Quasar toggles body--dark: re-theme every editor on the page
let themeObserver = null
function watchTheme () {
  if (themeObserver || typeof MutationObserver === 'undefined') return
  let dark = isDark()
  themeObserver = new MutationObserver(() => {
    if (isDark() === dark) return
    dark = isDark()
    views.forEach(view => view.dispatch({ effects: themeCompartment.reconfigure(themeFor(dark)) }))
  })
  themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] })
}

// destroys the editors whose block left the page (the markdown was replaced),
// then mounts one in every block of `root` that has none yet. Safe to call
// again for the same page (e.g. only the anchor changed).
export function mountCodeBlocks (root) {
  views = views.filter(view => {
    if (view.dom.isConnected) return true
    view.destroy()
    return false
  })
  if (!root) return
  watchTheme()

  root.querySelectorAll('.rs-code:not([data-mounted])').forEach(block => {
    const pre = block.querySelector('pre')
    const source = pre?.querySelector('code')?.textContent ?? ''
    try {
      const host = document.createElement('div')
      host.className = 'rs-code__editor'
      block.appendChild(host)

      const view = new EditorView({
        parent: host,
        state: EditorState.create({
          doc: source.replace(/\n$/, ''),
          extensions: [
            lineNumbers(),
            highlightActiveLineGutter(),
            highlightSpecialChars(),
            drawSelection(),
            codeFolding(),
            foldGutter(),
            bracketMatching(),
            highlightActiveLine(),
            EditorState.readOnly.of(true),
            EditorState.tabSize.of(4),
            languageOf(block.dataset.lang),
            themeCompartment.of(themeFor(isDark()))
          ]
        })
      })

      pre.hidden = true
      block.dataset.mounted = 'true'
      views.push(view)
    } catch (error) {
      // the plain <pre> stays visible
      console.error('docs code block', error)
    }
  })

}

export function destroyCodeBlocks () {
  views.forEach(view => view.destroy())
  views = []
  themeObserver?.disconnect()
  themeObserver = null
}
