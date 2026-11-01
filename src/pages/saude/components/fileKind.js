// What the browser can show of a stored result file (resultadoexamemedico or
// any {file: <url or {url, mime_type}>, mime_type, extensao, nome}): shared by
// the explorer's thumbnails and the file preview.

const IMAGE = /^(png|jpe?g|gif|webp|bmp|svg|avif)$/
const VIDEO = /^(mp4|webm|ogv|mov)$/
const AUDIO = /^(mp3|wav|ogg|oga|m4a|aac)$/
const TEXT = /^(txt|csv|json|xml|log|md)$/

export function fileUrl (item) {
  const value = item?.file
  const raw = typeof value === 'string' ? value : value?.url
  // https page: never load an http file (mixed content is blocked)
  return raw && window.location.protocol === 'https:' ? raw.replace(/^http:\/\//, 'https://') : raw || null
}

// the name the user gave (nome) before the stored one (a generated uuid)
export function fileName (item) {
  return item?.nome || item?.filename || item?.file?.name || ''
}

export function fileExtension (item) {
  const name = fileName(item)
  const ext = item?.extensao || (name.includes('.') ? name.split('.').pop() : '')
  return String(ext || '').replace(/^\./, '').toLowerCase()
}

// 'image' | 'pdf' | 'video' | 'audio' | 'text' | 'other' | 'none' (no file)
export function fileKind (item) {
  if (!fileUrl(item)) return 'none'
  const mime = String(item?.mime_type || item?.file?.mime_type || '').toLowerCase()
  const ext = fileExtension(item)
  if (mime.startsWith('image/') || IMAGE.test(ext)) return 'image'
  if (mime === 'application/pdf' || ext === 'pdf') return 'pdf'
  if (mime.startsWith('video/') || VIDEO.test(ext)) return 'video'
  if (mime.startsWith('audio/') || AUDIO.test(ext)) return 'audio'
  if (mime.startsWith('text/') || TEXT.test(ext)) return 'text'
  return 'other'
}

export const KIND_ICONS = { image: 'image', pdf: 'picture_as_pdf', video: 'movie', audio: 'audiotrack', text: 'description' }

const isFolder = (item) => (item?.tipo?.id ?? item?.tipo) === 'Folder'

// the extension with its dot (stored like ".pdf"); folders have none
function dottedExtension (item) {
  if (isFolder(item)) return ''
  const ext = item?.extensao || item?.file?.ext || ''
  return ext && !ext.startsWith('.') ? `.${ext}` : ext
}

// a file's name always shows its extension, even when it was renamed without it
export function fullFileName (item) {
  const name = String(item?.nome || '')
  const ext = dottedExtension(item)
  return ext && !name.toLowerCase().endsWith(ext.toLowerCase()) ? `${name}${ext}` : name
}

// one line: a long name is cut in the middle ("..."), keeping the extension
export function shortFileName (item, max = 16) {
  const name = fullFileName(item)
  if (name.length <= max) return name
  const ext = dottedExtension(item)
  const base = ext ? name.slice(0, -ext.length) : name
  // room left for the base name around the "..."
  const room = Math.max(max - ext.length - 3, 2)
  const head = Math.ceil(room / 2)
  const tail = room - head
  return `${base.slice(0, head)}...${tail ? base.slice(-tail) : ''}${ext}`
}
