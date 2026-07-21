import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'

// The capture module holds a module-level ring buffer, so each test gets a fresh copy
// rather than inheriting the previous test's errors.
async function freshModule() {
  vi.resetModules()
  return import('./report-context')
}

const originalConsoleError = console.error

afterEach(() => {
  console.error = originalConsoleError
  document.head.innerHTML = ''
})

describe('error capture', () => {
  beforeEach(() => {
    console.error = vi.fn()
  })

  it('captures console errors into the report context', async () => {
    const { installErrorCapture, captureContext } = await freshModule()
    installErrorCapture()

    console.error('something broke')

    expect(captureContext('/chores').consoleErrors).toEqual(['something broke'])
  })

  // Wrapping, not replacing: a broken capture must never swallow an error message.
  it('still calls the original console.error', async () => {
    const { installErrorCapture } = await freshModule()
    const spy = vi.fn()
    console.error = spy
    installErrorCapture()

    console.error('passed through')

    expect(spy).toHaveBeenCalledWith('passed through')
  })

  it('serializes Error objects rather than storing "[object Object]"', async () => {
    const { installErrorCapture, captureContext } = await freshModule()
    installErrorCapture()

    console.error(new TypeError('x is not a function'))

    expect(captureContext('/').consoleErrors[0]).toBe('TypeError: x is not a function')
  })

  it('keeps only the most recent errors', async () => {
    const { installErrorCapture, captureContext } = await freshModule()
    installErrorCapture()

    for (let i = 0; i < 15; i++) console.error(`error ${i}`)

    const captured = captureContext('/').consoleErrors
    expect(captured).toHaveLength(10)
    expect(captured[0]).toBe('error 5')
    expect(captured[9]).toBe('error 14')
  })

  it('captures unhandled rejections, which console never sees', async () => {
    const { installErrorCapture, captureContext } = await freshModule()
    installErrorCapture()

    window.dispatchEvent(
      Object.assign(new Event('unhandledrejection'), { reason: new Error('fetch died') })
    )

    expect(captureContext('/').consoleErrors[0]).toBe('Unhandled rejection: Error: fetch died')
  })
})

describe('build hash', () => {
  it('reads the hash off the entry script so a report names the build it came from', async () => {
    const script = document.createElement('script')
    script.type = 'module'
    script.src = 'https://vireohome.app/assets/index-a3f10c4.js'
    document.head.appendChild(script)

    const { getBuildHash } = await freshModule()
    expect(getBuildHash()).toBe('a3f10c4')
  })

  it('says "dev" when there is no hashed bundle', async () => {
    const { getBuildHash } = await freshModule()
    expect(getBuildHash()).toBe('dev')
  })
})

describe('captureContext', () => {
  it('attaches the things a reporter should never be asked to find', async () => {
    const { captureContext } = await freshModule()
    const context = captureContext('/calendar')

    expect(context.route).toBe('/calendar')
    expect(context.viewport).toEqual({ width: window.innerWidth, height: window.innerHeight })
    expect(context.userAgent).toBe(navigator.userAgent)
  })
})
