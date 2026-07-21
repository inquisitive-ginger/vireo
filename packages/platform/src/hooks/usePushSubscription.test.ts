import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { usePushSubscription } from './usePushSubscription'

type Permission = 'default' | 'granted' | 'denied'

function setup(opts: {
  permission?: Permission
  requestResult?: Permission
  registration?: unknown
  subscription?: unknown
  pushManager?: boolean
  notification?: boolean
}) {
  const {
    permission = 'default',
    requestResult = 'granted',
    registration = undefined,
    subscription = null,
    pushManager = true,
    notification = true,
  } = opts

  const requestPermission = vi.fn().mockResolvedValue(requestResult)
  const subscribe = vi.fn().mockResolvedValue({
    toJSON: () => ({ endpoint: 'https://push.example/abc', keys: { p256dh: 'p', auth: 'a' } }),
  })
  const unsubscribe = vi.fn().mockResolvedValue(true)

  const reg =
    registration === undefined
      ? {
          active: {},
          pushManager: {
            getSubscription: vi.fn().mockResolvedValue(subscription),
            subscribe,
          },
        }
      : registration

  const activeReg = {
    active: {},
    pushManager: { getSubscription: vi.fn().mockResolvedValue(subscription), subscribe },
  }
  const register = vi.fn().mockResolvedValue(activeReg)

  vi.stubGlobal('navigator', {
    serviceWorker: {
      getRegistration: vi.fn().mockResolvedValue(reg),
      register,
      // A `.ready` that never settles is the real-browser behaviour when install
      // fails; any test that hangs on it has found a regression.
      ready: reg ? Promise.resolve(reg) : new Promise(() => {}),
    },
  })
  if (pushManager) vi.stubGlobal('PushManager', class {})
  if (notification) vi.stubGlobal('Notification', { permission, requestPermission })
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ json: async () => ({ publicKey: btoa('key') }) })
  )

  return { requestPermission, subscribe, unsubscribe, register }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('usePushSubscription', () => {
  beforeEach(() => {
    vi.stubGlobal('atob', globalThis.atob)
  })

  it('reports the live subscription off the registration', async () => {
    setup({ permission: 'granted', subscription: { endpoint: 'https://push.example/abc' } })
    const { result } = renderHook(() => usePushSubscription())
    await waitFor(() => expect(result.current.state).toBe('subscribed'))
  })

  it('is unsubscribed, not unknown, when no service worker is registered', async () => {
    setup({ registration: null })
    const { result } = renderHook(() => usePushSubscription())
    await waitFor(() => expect(result.current.state).toBe('unsubscribed'))
  })

  it('reports unsupported when Notification is missing', async () => {
    setup({ notification: false })
    const { result } = renderHook(() => usePushSubscription())
    await waitFor(() => expect(result.current.state).toBe('unsupported'))
  })

  it('stays retryable when the permission prompt is dismissed', async () => {
    setup({ requestResult: 'default' })
    const { result } = renderHook(() => usePushSubscription())
    await waitFor(() => expect(result.current.state).toBe('unsubscribed'))

    await act(async () => {
      await result.current.subscribe()
    })

    expect(result.current.state).toBe('unsubscribed')
    expect(result.current.isLoading).toBe(false)
  })

  it('reports denied only when permission is actually refused', async () => {
    setup({ requestResult: 'denied' })
    const { result } = renderHook(() => usePushSubscription())
    await waitFor(() => expect(result.current.state).toBe('unsubscribed'))

    await act(async () => {
      await result.current.subscribe()
    })

    expect(result.current.state).toBe('denied')
  })

  it('registers the worker itself when boot did not manage to', async () => {
    const { register } = setup({ requestResult: 'granted', registration: null })
    const { result } = renderHook(() => usePushSubscription())

    await act(async () => {
      await result.current.subscribe()
    })

    expect(register).toHaveBeenCalledWith('/sw.js')
    expect(result.current.state).toBe('subscribed')
  })

  it('surfaces a registration failure as itself, not as a missing worker', async () => {
    const { register } = setup({ requestResult: 'granted', registration: null })
    register.mockRejectedValue(
      Object.assign(new Error('script evaluation failed'), { name: 'SecurityError' })
    )
    const { result } = renderHook(() => usePushSubscription())

    await act(async () => {
      await result.current.subscribe()
    })

    expect(result.current.error).toBe('SecurityError: script evaluation failed')
    expect(result.current.isLoading).toBe(false)
  })

  it('does not hang unsubscribing when no service worker is registered', async () => {
    setup({ registration: null })
    const { result } = renderHook(() => usePushSubscription())

    await act(async () => {
      await result.current.unsubscribe()
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.state).toBe('unsubscribed')
  })

  it('surfaces why the browser refused instead of failing silently', async () => {
    setup({ requestResult: 'granted' })
    const reg = await navigator.serviceWorker.getRegistration()
    vi.mocked(
      (reg as { pushManager: { subscribe: () => Promise<unknown> } }).pushManager.subscribe
    ).mockRejectedValue(Object.assign(new Error('Registration failed'), { name: 'AbortError' }))
    const { result } = renderHook(() => usePushSubscription())

    await act(async () => {
      await result.current.subscribe()
    })

    expect(result.current.error).toBe('AbortError: Registration failed')
    expect(result.current.state).toBe('unsubscribed')
  })

  it('registers the subscription with the server on success', async () => {
    const { subscribe } = setup({ requestResult: 'granted' })
    const { result } = renderHook(() => usePushSubscription())

    await act(async () => {
      await result.current.subscribe()
    })

    expect(subscribe).toHaveBeenCalled()
    expect(result.current.state).toBe('subscribed')
    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      '/api/push/subscribe',
      expect.objectContaining({ method: 'POST' })
    )
  })
})
