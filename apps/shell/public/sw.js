const VERSION = '__SW_VERSION__'
const CACHE = `family-os-${VERSION}`
const APP_SHELL = ['/', '/index.html']

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(APP_SHELL)))
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return

  // Dynamic surfaces, and navigations (HTML): network-first so a new deploy's
  // index.html — and the content-hashed bundles it points at — is always picked
  // up. Hashed assets are immutable, so they alone are safe to serve cache-first.
  const dynamic =
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/events') ||
    url.pathname.startsWith('/plugins/')

  if (dynamic || req.mode === 'navigate') {
    e.respondWith(networkFirst(req))
  } else {
    e.respondWith(cacheFirst(req))
  }
})

async function networkFirst(request) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const clone = response.clone()
      caches.open(CACHE).then((c) => c.put(request, clone))
    }
    return response
  } catch {
    const cached = await caches.match(request)
    if (cached) return cached
    if (request.mode === 'navigate') return (await caches.match('/index.html')) ?? Response.error()
    return Response.error()
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request)
  if (cached) return cached
  const response = await fetch(request)
  if (response.ok) {
    const clone = response.clone()
    caches.open(CACHE).then((c) => c.put(request, clone))
  }
  return response
}

self.addEventListener('push', (e) => {
  let data = { title: 'Vireo', body: '' }
  try {
    data = e.data ? e.data.json() : data
  } catch {
    data.body = e.data ? e.data.text() : ''
  }
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
    })
  )
})
