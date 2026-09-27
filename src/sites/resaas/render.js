// Markdown -> HTML for one document of the RESAAS site, plus its table of contents.
// Links are rewritten here: to another page of this site (data-to, handled by the page
// with the router - the app uses hash routing, so no raw "#/..." hrefs), to a heading
// of the same page (data-hash), or to the library's source on GitHub (new tab).
import { marked } from 'marked'

import { docOfGithubUrl, githubUrl, resolveSlug } from './docs'

const escapeHtml = (text) => String(text)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// GitHub's heading ids (the docs link to them: "#when-view_registry-is-actually-populated")
export function headingId (text) {
  return String(text)
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z]+;/g, '')
    .replace(/[^\w\- ]+/g, '')
    .trim()
    .replace(/ /g, '-')
}

export function renderDoc (raw, product, slug) {
  const toc = []
  const renderer = new marked.Renderer()

  renderer.heading = (text, level, rawText) => {
    const id = headingId(rawText)
    if (level === 2 || level === 3) toc.push({ id, text: rawText.replace(/`/g, ''), level })
    return `<h${level} id="${id}">${text}</h${level}>`
  }

  renderer.code = (code, lang) => {
    const language = (lang || '').split(/\s/)[0]
    return `<div class="rs-code"><div class="rs-code__bar"><span>${escapeHtml(language || 'text')}</span>` +
      '<button type="button" class="rs-code__copy" data-copy>copy</button></div>' +
      `<pre><code>${escapeHtml(code)}</code></pre></div>`
  }

  // GitHub alerts: > [!NOTE] / [!TIP] / [!WARNING] / [!IMPORTANT] / [!CAUTION]
  renderer.blockquote = (quote) => {
    const match = quote.match(/^\s*<p>\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]\s*/)
    if (!match) return `<blockquote>${quote}</blockquote>`
    const kind = match[1].toLowerCase()
    const body = quote.replace(match[0], '<p>')
    return `<div class="rs-callout rs-callout--${kind}"><span class="rs-callout__title">${kind}</span>${body}</div>`
  }

  renderer.link = (href, title, text) => {
    const t = title ? ` title="${escapeHtml(title)}"` : ''
    if (!href) return text

    // a GitHub link into the other library's docs (it works on GitHub too): kept on this site
    const own = docOfGithubUrl(href)
    if (own) {
      const path = `/docs/${own.product}/${own.slug}`
      return `<a href="#${path}" data-to="${escapeHtml(path)}" data-anchor="${escapeHtml(own.hash)}"${t}>${text}</a>`
    }

    if (/^(https?:|mailto:)/.test(href)) {
      return `<a href="${href}"${t} target="_blank" rel="noopener noreferrer">${text}</a>`
    }
    if (href.startsWith('#')) {
      return `<a href="${href}" data-hash="${escapeHtml(href.slice(1))}"${t}>${text}</a>`
    }
    // absolute site paths (the site's own guide): "/docs/django-resaas/..."
    if (href.startsWith('/')) {
      const [path, hash] = href.split('#')
      return `<a href="#${path}" data-to="${escapeHtml(path)}" data-anchor="${escapeHtml(hash || '')}"${t}>${text}</a>`
    }

    const [target, hash] = href.split('#')
    const doc = target.endsWith('.md') || target === '' ? resolveSlug(product, slug, target || `${slug.split('/').pop()}.md`) : null
    if (doc) {
      const path = `/docs/${doc.product}/${doc.slug}`
      return `<a href="#${path}" data-to="${escapeHtml(path)}" data-anchor="${escapeHtml(hash || '')}"${t}>${text}</a>`
    }

    // a file of the library outside its docs (source, tests, example app): on GitHub
    const url = githubUrl(product, slug, target)
    if (url) return `<a href="${url}${hash ? '#' + hash : ''}"${t} target="_blank" rel="noopener noreferrer">${text}</a>`
    return text
  }

  const html = marked.parse(raw || '', { renderer, gfm: true })
  return { html, toc }
}
