const MAX_CAPTURED_ERRORS = 10
const MAX_ERROR_LENGTH = 1000

/** A ring of the most recent errors the app produced. Kept in memory only: this is
 * evidence for a report the user is filing right now, not telemetry, so it never
 * outlives the tab and is never sent anywhere until someone presses Send.
 */
const recentErrors: string[] = []

function record(entry: string) {
  recentErrors.push(entry.slice(0, MAX_ERROR_LENGTH))
  if (recentErrors.length > MAX_CAPTURED_ERRORS) recentErrors.shift()
}

function stringify(value: unknown): string {
  if (value instanceof Error) return `${value.name}: ${value.message}`
  if (typeof value === 'string') return value
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

/** Starts capturing errors for bug reports. Called once at boot.
 *
 * Wraps `console.error` rather than replacing it — the original is always called, so
 * devtools behaviour is unchanged and a broken capture can never swallow an error
 * message. Also catches what console misses: uncaught exceptions and rejected promises,
 * which are exactly the failures a user describes as "it just went blank".
 */
export function installErrorCapture() {
  const original = console.error
  console.error = (...args: unknown[]) => {
    record(args.map(stringify).join(' '))
    original.apply(console, args)
  }

  window.addEventListener('error', (event) => {
    record(`Uncaught ${stringify(event.error ?? event.message)}`)
  })

  window.addEventListener('unhandledrejection', (event) => {
    record(`Unhandled rejection: ${stringify(event.reason)}`)
  })
}

/** The build the reporter is actually running.
 *
 * Read off the entry script's filename rather than injected at build time, because the
 * content hash cannot be known before the content is hashed. This is the same hash
 * `stampServiceWorker` bakes into the SW cache name, so a report and a deployed build
 * can be matched up. Dev has no hash, and says so.
 */
export function getBuildHash(): string {
  const entry = document.querySelector<HTMLScriptElement>('script[type="module"][src*="/assets/"]')
  return entry?.src.match(/-([A-Za-z0-9_-]+)\.js$/)?.[1] ?? 'dev'
}

export type ReportContext = {
  route: string
  buildHash: string
  viewport: { width: number; height: number }
  userAgent: string
  consoleErrors: string[]
}

/** Everything the app attaches on the reporter's behalf. The point of the feature: a
    description alone is rarely reproducible, and none of this is something a user could
    reasonably be asked to find. */
export function captureContext(route: string): ReportContext {
  return {
    route,
    buildHash: getBuildHash(),
    viewport: { width: window.innerWidth, height: window.innerHeight },
    userAgent: navigator.userAgent,
    consoleErrors: [...recentErrors],
  }
}
