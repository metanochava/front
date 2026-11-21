import { describe, it, expect } from 'vitest'
import { nextField, typeableFields } from './fieldCycle'

function form () {
  const root = document.createElement('div')
  root.innerHTML = `
    <input id="a" type="number"><button id="btn">x</button>
    <input id="toggle" type="checkbox"><input id="b" type="number">
    <input id="off" disabled><textarea id="notes"></textarea>`
  document.body.appendChild(root)
  return root
}

describe('Enter / Tab cycle over the inputs only', () => {
  it('skips buttons, checkboxes and disabled inputs', () => {
    expect(typeableFields(form()).map(el => el.id)).toEqual(['a', 'b', 'notes'])
  })

  it('goes to the next one and from the last back to the first', () => {
    const root = form()
    const [a, b, notes] = typeableFields(root)
    expect(nextField(root, a)).toBe(b)
    expect(nextField(root, notes)).toBe(a)
    expect(nextField(root, a, -1)).toBe(notes)   // Shift+Tab from the first: the last
  })
})
