import '@testing-library/jest-dom'

// jsdom has no ResizeObserver; Radix measurement (the Switch inside the create
// drawer) reaches for it on mount. A no-op stub is enough for the DOM tests.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver
