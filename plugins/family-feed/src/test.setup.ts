import '@testing-library/jest-dom'

// jsdom has no ResizeObserver; the widget's `useFitRows` observes its slot. jsdom has no
// layout either, so every row measures 0 and nothing is ever clamped.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver
