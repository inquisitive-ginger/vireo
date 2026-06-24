import '@testing-library/jest-dom'

// jsdom has no ResizeObserver; Radix popover/measurement (the date picker) reaches
// for it on mount. A no-op stub is enough for the DOM tests.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver
