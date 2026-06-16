import { useState, useEffect } from 'react'
import { useAuth, TierGate, useEventBus } from '@family-os/platform'
import { Button } from '@family-os/ui'

export function Plugin() {
  const { name, tier } = useAuth()
  const { publish, subscribe } = useEventBus()
  const [greetings, setGreetings] = useState<string[]>([])

  useEffect(() => {
    return subscribe('demo.greeting.sent', (payload) => {
      const p = payload as { from: string; tier: number }
      setGreetings((prev) => [`${p.from} (tier ${p.tier})`, ...prev].slice(0, 10))
    })
  }, [subscribe])

  function sendGreeting() {
    publish('demo.greeting.sent', { from: name, tier })
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '480px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Demo Plugin</h1>
      <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
        Active: {name} · Tier {tier}
      </p>

      <TierGate
        min={4}
        fallback={
          <div
            style={{
              background: '#f5f5f5',
              borderRadius: '6px',
              padding: '1rem',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
            }}
          >
            Child view — limited access. Some features require a parent profile.
          </div>
        }
      >
        <div
          style={{
            background: '#e8f0fe',
            border: '1px solid #c6d8fb',
            borderRadius: '6px',
            padding: '1rem',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          Parent view — full access enabled.
        </div>
      </TierGate>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Button onClick={sendGreeting}>Send Greeting Event</Button>

        <div>
          <h2 style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
            Received greetings ({greetings.length})
          </h2>
          {greetings.length === 0 ? (
            <p style={{ fontSize: '0.75rem', color: '#888' }}>
              No greetings yet — click the button above.
            </p>
          ) : (
            <ul
              style={{
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                listStyle: 'none',
                padding: 0,
                margin: 0,
              }}
            >
              {greetings.map((g, i) => (
                <li key={i} style={{ padding: '0.25rem 0', borderBottom: '1px solid #eee' }}>
                  {g}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default Plugin
