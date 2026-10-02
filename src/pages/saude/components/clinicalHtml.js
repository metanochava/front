// Rich text of clinical documents (s-editor) shown back as HTML, safely.
// Allowlist: only the formatting tags the editor produces survive, with NO
// attributes at all (no on*=, style, href, src...). script/style/iframe and
// the like are dropped with their content; any other unknown tag is replaced
// by its text. Use it for every v-html of user-written clinical text.

const ALLOWED = new Set([
  'B', 'STRONG', 'I', 'EM', 'U', 'S', 'STRIKE', 'DEL',
  'P', 'DIV', 'SPAN', 'BR', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
])

const DROP_WITH_CONTENT = new Set([
  'SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'TEMPLATE', 'NOSCRIPT', 'SVG', 'MATH', 'LINK', 'META',
])

function cleanChildren (node, doc) {
  for (const child of Array.from(node.childNodes)) {
    if (child.nodeType === 3) continue // text

    if (child.nodeType !== 1) { // comments, processing instructions...
      child.remove()
      continue
    }

    const tag = child.tagName.toUpperCase()

    if (DROP_WITH_CONTENT.has(tag)) {
      child.remove()
      continue
    }

    cleanChildren(child, doc)

    if (ALLOWED.has(tag)) {
      for (const attribute of Array.from(child.attributes)) child.removeAttribute(attribute.name)
    } else {
      child.replaceWith(...Array.from(child.childNodes))
    }
  }
}

export function sanitizeClinicalHtml (html) {
  if (!html) return ''
  const doc = new DOMParser().parseFromString(`<body>${String(html)}</body>`, 'text/html')
  cleanChildren(doc.body, doc)
  return doc.body.innerHTML
}

// true when the text has something to show besides tags / spaces
export function hasClinicalText (html) {
  return String(html || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/gi, ' ').trim().length > 0
}
