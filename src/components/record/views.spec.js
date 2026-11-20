// Every module's record pages (its views.js, components/record): each listed
// model gets its view_<model> route once (a custom view page keeps its own,
// so a model is never in both), and every tab is well formed - a person tab
// names its field, an action tab its columns, a related tab a model whose
// rows open a view route and the field that points at the parent.
import { describe, it, expect } from 'vitest'

// the modules' record pages: src/pages/<module>/views.js
const MODULES = import.meta.glob('../../pages/*/views.js', { eager: true })

async function appRoutes () {
  window.happyDOM.setURL('https://app.dev.mytech.co.mz/')
  const walk = (records, out = []) => {
    for (const r of records) { out.push(r); if (r.children) walk(r.children, out) }
    return out
  }
  return walk((await import('../../router/routes.js')).default)
}

const configs = Object.entries(MODULES).flatMap(([file, exports]) =>
  Object.entries(exports).filter(([name]) => name.endsWith('Views'))
    .flatMap(([name, views]) => Object.entries(views).map(([model, view]) => ({ file, app: name.slice(0, -5), model, view }))))

describe('record pages of every module', () => {
  it('has configurations', () => {
    expect(configs.length).toBeGreaterThan(50)
  })

  it('gives every model one view route', async () => {
    const names = (await appRoutes()).map(r => r.name).filter(Boolean)
    for (const { model } of configs) {
      const name = `view_${model.toLowerCase()}`
      expect(names.filter(n => n === name).length, name).toBe(1)
    }
  })

  it('has well-formed tabs', async () => {
    const names = new Set((await appRoutes()).map(r => r.name))
    for (const { file, model, view } of configs) {
      expect(view.label, `${file} ${model}`).toBeTruthy()
      const tabNames = (view.tabs || []).map(t => t.name)
      expect(new Set(tabNames).size, `${model} tab names`).toBe(tabNames.length)
      for (const tab of view.tabs || []) {
        const where = `${file} ${model}.${tab.name}`
        expect(tab.label, where).toBeTruthy()
        if (tab.person) { expect(tab.person, where).toMatch(/^[a-z_]+$/); continue }
        if (tab.action) { expect(tab.columns?.length, where).toBeTruthy(); continue }
        if (tab.slot) continue
        expect(tab.fk, where).toMatch(/^[a-z_]+$/)
        expect(names.has(`view_${tab.model.toLowerCase()}`), `${where} -> view_${tab.model.toLowerCase()}`).toBe(true)
      }
      if (view.defaultTab) expect(tabNames, `${model} defaultTab`).toContain(view.defaultTab)
    }
  })
})
