// What the browser can show of a stored result file (resultadoexamemedico or
// any {file: <url or {url, mime_type}>, mime_type, extensao, nome}): shared by
// the explorer's thumbnails and the file preview.

// url / name / extension / kind of a stored file are the shared ones
// (quasar_resaas utils/fileKind.js, also used by the file preview card)
export { fileUrl, fileName, fileExtension, fileKind, KIND_ICONS } from 'quasar_resaas'

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
