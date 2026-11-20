// The HTML of a lesson's text block, made safe to show (v-html): only the
// formatting tags the editor produces, no scripts, styles, event handlers or
// javascript: links. A teacher writes it; every student of the class sees it.
const ALLOWED = new Set(['P', 'BR', 'B', 'STRONG', 'I', 'EM', 'U', 'S', 'STRIKE', 'SUB', 'SUP', 'UL', 'OL', 'LI',
  'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE', 'PRE', 'CODE', 'A', 'SPAN', 'DIV', 'HR', 'TABLE', 'THEAD',
  'TBODY', 'TR', 'TH', 'TD', 'FONT'])
const ATTRIBUTES = { A: ['href'], FONT: ['color', 'size'], TD: ['colspan', 'rowspan'], TH: ['colspan', 'rowspan'] }

function clean (node) {
  for (const child of [...node.childNodes]) {
    if (child.nodeType === 1) {
      if (!ALLOWED.has(child.tagName)) {
        // a forbidden element: keep its text only (never its scripts)
        if (['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED'].includes(child.tagName)) child.remove()
        else child.replaceWith(...clean(child).childNodes)
        continue
      }
      for (const attr of [...child.attributes]) {
        const allowed = (ATTRIBUTES[child.tagName] || []).includes(attr.name.toLowerCase())
        const value = attr.value.trim().toLowerCase()
        if (!allowed || (attr.name.toLowerCase() === 'href' && !/^(https?:|mailto:|#|\/)/.test(value))) {
          child.removeAttribute(attr.name)
        }
      }
      if (child.tagName === 'A') {
        child.setAttribute('target', '_blank')
        child.setAttribute('rel', 'noopener noreferrer')
      }
      clean(child)
    } else if (child.nodeType !== 3) {
      child.remove()     // comments and the like
    }
  }
  return node
}

export function sanitizeHtml (html) {
  if (!html) return ''
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html')
  return clean(doc.body.firstChild).innerHTML
}
