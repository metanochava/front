// A lesson's text is written by a teacher and shown to every student of the
// class: only formatting survives - no scripts, handlers, styles or
// javascript: links.
import { describe, it, expect } from 'vitest'
import { sanitizeHtml } from './sanitizeHtml'

describe('sanitizeHtml', () => {
  it('keeps the formatting', () => {
    expect(sanitizeHtml('<p>To add <b>fractions</b> <i>carefully</i></p><ul><li>one</li></ul>'))
      .toBe('<p>To add <b>fractions</b> <i>carefully</i></p><ul><li>one</li></ul>')
  })

  it('drops scripts, event handlers, styles and iframes', () => {
    const out = sanitizeHtml('<p onclick="steal()" style="color:red">Hi<script>steal()</script></p><iframe src="x"></iframe><img src=x onerror=steal()>')
    expect(out).toBe('<p>Hi</p>')
  })

  it('keeps safe links only, opened apart', () => {
    expect(sanitizeHtml('<a href="javascript:steal()">x</a>')).toBe('<a target="_blank" rel="noopener noreferrer">x</a>')
    expect(sanitizeHtml('<a href="https://e.x/page">y</a>')).toBe('<a href="https://e.x/page" target="_blank" rel="noopener noreferrer">y</a>')
  })

  it('keeps the text of an unknown element', () => {
    expect(sanitizeHtml('<article><p>kept</p></article>')).toBe('<p>kept</p>')
    expect(sanitizeHtml('')).toBe('')
  })
})
