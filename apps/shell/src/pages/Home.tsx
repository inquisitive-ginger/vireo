import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useEventBus } from '@/hooks/useEventBus'
import type { BusMessage } from '@family-os/platform'

type LogEntry = BusMessage & { receivedAt: number }

export function Home() {
  const [events, setEvents] = useState<LogEntry[]>([])

  useEventBus((msg) => {
    setEvents((prev) => [{ ...msg, receivedAt: Date.now() }, ...prev].slice(0, 20))
  })

  async function sendEvent() {
    await fetch('/api/trigger-event', { method: 'POST' })
  }

  return (
    <div className="flex flex-col h-full p-8 gap-6">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-semibold">Home</h1>
        <p className="text-sm text-muted-foreground max-w-sm">
          Family OS home screen — widget grid coming in M1.
        </p>
        <Button variant="outline" size="sm">
          Get Started
        </Button>
      </div>

      <div className="max-w-lg mx-auto w-full">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium">Event Bus</h2>
          <Button size="sm" onClick={sendEvent}>
            Send platform.ping.sent
          </Button>
        </div>
        <div className="rounded-md border bg-muted/40 min-h-[120px] max-h-[320px] overflow-y-auto">
          {events.length === 0 ? (
            <p className="text-xs text-muted-foreground p-4 text-center">
              No events yet — click the button to emit one.
            </p>
          ) : (
            <ul className="divide-y text-xs font-mono">
              {events.map((e) => (
                <li key={e.receivedAt} className="px-4 py-2 flex gap-3">
                  <span className="text-muted-foreground shrink-0">
                    {new Date(e.receivedAt).toLocaleTimeString()}
                  </span>
                  <span className="text-foreground">{e.event}</span>
                  <span className="text-muted-foreground truncate">
                    {JSON.stringify(e.payload)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
