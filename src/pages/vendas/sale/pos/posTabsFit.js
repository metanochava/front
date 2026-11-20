// Which open tabs fit in the point of sale's bar (PosTabsBar.vue).
export const GAP = 8          // .pos-tabs gap, px
export const MORE_WIDTH = 42  // the expand button, px

// tabs: in their order; widths: {id: px}; room: the px the tabs may use when
// the expand button is NOT shown. Returns the Set of ids to show: all of them
// when they fit, else those that fit beside the expand button - the selected
// tab (activeId) always among them.
export function fitTabs (tabs, widths, room, activeId = null) {
  const width = t => widths[t.id] || 0
  const total = tabs.reduce((sum, t, i) => sum + width(t) + (i ? GAP : 0), 0)
  if (total <= room) return new Set(tabs.map(t => t.id))

  const space = room - MORE_WIDTH - GAP
  const fitted = []
  let used = 0
  for (const t of tabs) {
    const need = width(t) + (fitted.length ? GAP : 0)
    if (used + need > space) break
    fitted.push(t)
    used += need
  }

  const active = tabs.find(t => t.id === activeId)
  if (active && !fitted.includes(active)) {
    // room for the selected tab: drop the last ones
    while (fitted.length && used + GAP + width(active) > space) {
      const last = fitted.pop()
      used -= width(last) + (fitted.length ? GAP : 0)
    }
    fitted.push(active)
  }

  const ids = new Set(fitted.map(t => t.id))
  return new Set(tabs.filter(t => ids.has(t.id)).map(t => t.id))
}
