import '@testing-library/jest-dom'

// jsdom has no ResizeObserver; the widget's height-clamped lists (`useFitRows`)
// observe their slot, and Radix measurement (the Switch inside the create drawer)
// reaches for it on mount. A no-op stub is enough — jsdom has no layout either,
// so every row measures 0 and nothing is ever clamped.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver
