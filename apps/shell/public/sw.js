const CACHE = 'family-os-v1'

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['/', '/index.html'])))
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  )
  self.clients.claim()
})

self.addEventListener('fetch', (e) => {
  const { pathname } = new URL(e.request.url)
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/events') ||
    pathname.startsWith('/plugins/')
  ) {
    e.respondWith(networkFirst(e.request))
  } else {
    e.respondWith(cacheFirst(e.request))
  }
})

async function cacheFirst(request) {
  const cached = await caches.match(request)
  if (cached) return cached
  const response = await fetch(request)
  if (response.ok) caches.open(CACHE).then((c) => c.put(request, response.clone()))
  return response
}

async function networkFirst(request) {
  try {
    const response = await fetch(request)
    if (response.ok) caches.open(CACHE).then((c) => c.put(request, response.clone()))
    return response
  } catch {
    return (await caches.match(request)) ?? Response.error()
  }
}
