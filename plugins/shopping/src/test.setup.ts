import '@testing-library/jest-dom'

// jsdom has no ResizeObserver (Radix measurement reaches for it on mount) nor
// matchMedia — same stubs as chores' setup, same reasoning.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver

window.matchMedia ??= ((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener() {},
  removeEventListener() {},
  addListener() {},
  removeListener() {},
  dispatchEvent: () => false,
})) as unknown as typeof window.matchMedia

// jsdom implements no scrolling at all, so `scrollIntoView` is simply absent —
// the wide layout calls it when `Show lists` reveals content below the fold.
HTMLElement.prototype.scrollIntoView ??= function scrollIntoView() {}
