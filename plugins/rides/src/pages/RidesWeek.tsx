import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import {
  Button,
  Input,
  ListRow,
  SectionLabel,
  SegmentedControl,
  TabBar,
  identityToken,
  resolveHue,
} from '@family-os/ui'
import { WEEKDAYS, formatMinutes, runWhat, type RunKind, type SchoolRun } from '../lib/runs'

export type RidesMember = { id: string; name: string; identityHue?: string | null; tier: number }

export type NewRun = { weekday: number; kind: RunKind; place: string | null; minutes: number }

const OPEN = 'open'

/* The usual week, one kid at a time (D-092): a tab per kid, each school day
   listing that kid's runs with the driver beside each. */
export function RidesWeek({
  runs,
  kids,
  drivers,
  canEdit,
  onDriver,
  onAdd,
  onRemove,
}: {
  runs: SchoolRun[]
  kids: RidesMember[]
  drivers: RidesMember[]
  canEdit: boolean
  onDriver: (run: SchoolRun, driverId: string | null) => void
  onAdd: (kidId: string, run: NewRun) => void
  onRemove: (run: SchoolRun) => void
}) {
  const [kidId, setKidId] = useState(kids[0]?.id ?? '')
  const [adding, setAdding] = useState<number | null>(null)
  const kid = kids.find((k) => k.id === kidId) ?? kids[0]
  if (!kid) return <p className="text-base-token text-muted-foreground">No kids to drive yet.</p>

  const name = (id: string | null) => drivers.find((d) => d.id === id)?.name ?? 'Nobody yet'
  const driverOptions = [
    ...drivers.map((d) => ({ value: d.id, label: d.name })),
    { value: OPEN, label: 'Open' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <TabBar
        aria-label="Kid"
        idBase="rides-kid"
        options={kids.map((k) => ({ value: k.id, label: k.name }))}
        value={kid.id}
        onChange={(id) => {
          setKidId(id)
          setAdding(null)
        }}
      />
      <div
        role="tabpanel"
        aria-labelledby={`rides-kid-tab-${kid.id}`}
        className="flex flex-col gap-6"
      >
        {WEEKDAYS.map(({ weekday, label }) => {
          const day = runs.filter((r) => r.kidId === kid.id && r.weekday === weekday)
          return (
            <section key={weekday} aria-label={label}>
              <SectionLabel as="h2">{label}</SectionLabel>
              <div className="rounded-panel border border-border bg-card shadow-[var(--shadow-card)]">
                {day.length === 0 && (
                  <p className="px-4 py-3 text-sm-token text-muted-foreground">No runs</p>
                )}
                {day.map((run) => (
                  <ListRow
                    key={run.id}
                    className="flex-wrap gap-y-2 py-2 last:border-b-0"
                    trailing={
                      canEdit ? (
                        <Button
                          size="icon"
                          variant="ghost-destructive"
                          aria-label={`Remove ${label} ${runWhat(run).toLowerCase()}`}
                          onClick={() => onRemove(run)}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden />
                        </Button>
                      ) : undefined
                    }
                  >
                    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-2">
                      <span className="w-16 shrink-0 text-sm-token tabular-nums text-muted-foreground">
                        {formatMinutes(run.minutes)}
                      </span>
                      <span className="min-w-0 flex-1 text-base-token">{runWhat(run)}</span>
                      {canEdit ? (
                        <SegmentedControl
                          aria-label={`Who drives ${label} ${runWhat(run).toLowerCase()}`}
                          options={driverOptions}
                          value={run.driverId ?? OPEN}
                          onChange={(v) => onDriver(run, v === OPEN ? null : v)}
                        />
                      ) : (
                        <DriverName
                          member={drivers.find((d) => d.id === run.driverId)}
                          name={name(run.driverId)}
                        />
                      )}
                    </div>
                  </ListRow>
                ))}
                {canEdit &&
                  (adding === weekday ? (
                    <AddRunForm
                      day={label}
                      onCancel={() => setAdding(null)}
                      onAdd={(input) => {
                        onAdd(kid.id, { weekday, ...input })
                        setAdding(null)
                      }}
                    />
                  ) : (
                    <div className="px-2 py-1">
                      <Button variant="ghost" size="sm" onClick={() => setAdding(weekday)}>
                        <Plus className="h-4 w-4" aria-hidden /> Add a run
                        <span className="sr-only"> on {label}</span>
                      </Button>
                    </div>
                  ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

function DriverName({ member, name }: { member?: RidesMember; name: string }) {
  if (!member) return <span className="text-sm-token text-error">{name}</span>
  const hue = resolveHue(member.name, member.identityHue)
  return (
    <span className="flex items-center gap-1.5 text-sm-token">
      <span
        aria-hidden
        className="h-3 w-3 rounded-full"
        style={{ backgroundColor: identityToken(hue, 'base') }}
      />
      {name}
    </span>
  )
}

function AddRunForm({
  day,
  onAdd,
  onCancel,
}: {
  day: string
  onAdd: (run: Omit<NewRun, 'weekday'>) => void
  onCancel: () => void
}) {
  const [kind, setKind] = useState<RunKind>('dropoff')
  const [place, setPlace] = useState('')
  const [time, setTime] = useState('08:00')
  const [h, m] = time.split(':').map(Number)
  const valid = Number.isFinite(h) && Number.isFinite(m)
  return (
    <form
      aria-label={`New run on ${day}`}
      className="flex flex-wrap items-end gap-3 border-t border-border px-4 py-3"
      onSubmit={(e) => {
        e.preventDefault()
        if (valid) onAdd({ kind, place: place.trim() || null, minutes: h * 60 + m })
      }}
    >
      <SegmentedControl
        aria-label="Kind"
        options={[
          { value: 'dropoff', label: 'Drop-off' },
          { value: 'pickup', label: 'Pickup' },
        ]}
        value={kind}
        onChange={setKind}
      />
      <label className="flex flex-col gap-1 text-sm-token">
        Where
        <Input value={place} placeholder="School" onChange={(e) => setPlace(e.target.value)} />
      </label>
      <label className="flex flex-col gap-1 text-sm-token">
        Time
        <Input type="time" value={time} required onChange={(e) => setTime(e.target.value)} />
      </label>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={!valid}>
          Add
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
