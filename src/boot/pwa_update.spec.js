// A new version of the installed app is applied by itself, but only at a safe
// moment (src-pwa/update-policy.js): never while the user is typing or has a
// dialog open.
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createUpdatePolicy, OPENING_WINDOW_MS } from 'app/src-pwa/update-policy'

function setup ({ elapsed = 0 } = {}) {
  let clock = 1000
  const worker = { postMessage: vi.fn() }
  const serviceWorker = { addEventListener: vi.fn((event, cb) => { serviceWorker.onChange = cb }) }
  const reload = vi.fn()
  const policy = createUpdatePolicy({ doc: document, now: () => clock, reload, serviceWorker })
  clock += elapsed
  return { policy, worker, serviceWorker, reload, registration: { waiting: worker } }
}

describe('PWA update policy', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('applies at once when the app has just opened', () => {
    const { policy, worker, serviceWorker, reload, registration } = setup()
    policy.updated(registration)

    expect(worker.postMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' })
    expect(reload).not.toHaveBeenCalled()
    serviceWorker.onChange()
    expect(reload).toHaveBeenCalledOnce()
  })

  it('waits while the user works, then applies on the next route change', () => {
    const { policy, worker, registration } = setup({ elapsed: OPENING_WINDOW_MS + 1 })
    policy.updated(registration)
    expect(worker.postMessage).not.toHaveBeenCalled()
    expect(policy.pending).toBe(true)

    expect(policy.navigated()).toBe(true)
    expect(worker.postMessage).toHaveBeenCalledOnce()
  })

  it('applies when the app goes to the background', () => {
    const { policy, worker, registration } = setup({ elapsed: OPENING_WINDOW_MS + 1 })
    policy.updated(registration)

    expect(policy.hidden()).toBe(true)
    expect(worker.postMessage).toHaveBeenCalledOnce()
  })

  it('never applies while something was typed since the last route change', () => {
    const { policy, worker, registration } = setup()
    policy.typed()
    policy.updated(registration)

    expect(policy.hidden()).toBe(false)
    expect(worker.postMessage).not.toHaveBeenCalled()
    // leaving the page clears it
    expect(policy.navigated()).toBe(true)
  })

  it('never applies while a dialog is open or a field has the focus', () => {
    const { policy, worker, registration } = setup()
    document.body.innerHTML = '<div class="q-dialog"></div>'
    policy.updated(registration)
    expect(policy.navigated()).toBe(false)

    document.body.innerHTML = '<input id="f">'
    document.getElementById('f').focus()
    expect(policy.hidden()).toBe(false)
    expect(worker.postMessage).not.toHaveBeenCalled()
  })

  it('does nothing when no new version is waiting, and applies only once', () => {
    const { policy, worker, registration } = setup()
    expect(policy.navigated()).toBe(false)

    policy.updated(registration)
    expect(policy.navigated()).toBe(false)
    expect(worker.postMessage).toHaveBeenCalledOnce()
  })
})
