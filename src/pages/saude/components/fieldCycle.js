// The inputs a form's Enter / Tab cycle through: text, number and textarea
// fields that can be typed in - never buttons, toggles or sliders.
const SELECTOR = 'input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=button]):not([type=submit]), textarea'

export function typeableFields (root) {
  if (!root) return []
  return [...root.querySelectorAll(SELECTOR)].filter(el => !el.disabled && !el.readOnly && el.tabIndex !== -1)
}

// the field after (step 1) or before (step -1) `current`, wrapping around;
// from outside the list, the first (or the last)
export function nextField (root, current, step = 1) {
  const fields = typeableFields(root)
  if (!fields.length) return null
  const index = fields.indexOf(current)
  if (index === -1) return step > 0 ? fields[0] : fields[fields.length - 1]
  return fields[(index + step + fields.length) % fields.length]
}
