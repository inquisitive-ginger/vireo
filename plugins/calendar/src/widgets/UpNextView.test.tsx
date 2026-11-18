import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import type { DayMark } from '@family-os/platform/types'
import { localDateKey } from '../lib/grid'
import { MemoryRouter } from 'react-router-dom'
import type { CalendarEvent, CalendarMember } from '../types'
import { UpNextView, type UpNextFraming, type WidgetSize } from './UpNextView'

/* jsdom has no layout, so the height-aware `DayList` sees clientHeight 0 and
   renders every row (no truncation) — which is exactly what we want for content
   assertions. The "+N more" clamp depends on real measurement and is verified in
   Storybook / the live app, not here. */

const MEMBERS = new Map<string, CalendarMember>([
  ['zach', { name: 'Zach' }],
  ['hallie', { name: 'Hallie' }],
  ['zoe', { name: 'Zoe' }],
  ['teddy', { name: 'Teddy' }],
])
const NOW = new Date('2026-07-11T13:20:00') // Saturday afternoon

function mk(
  p: Pick<CalendarEvent, 'id' | 'title' | 'startsAt' | 'attendeeIds'> & Partial<CalendarEvent>
): CalendarEvent {
  return {
    seriesId: p.id,
    occurrenceDate: null,
    isOccurrence: false,
    description: null,
    ownerId: p.attendeeIds[0] ?? null,
    createdBy: 'seed',
    seriesStartsAt: p.startsAt,
    endsAt: null,
    allDay: false,
    location: null,
    recurrence: null,
    recurrenceInterval: 1,
    recurrenceWeekdays: [],
    recurrenceMonthWeek: null,
    recurrenceUntil: null,
    isActivity: false,
    status: 'confirmed',
    source: 'manual',
    reminderMinutes: null,
    createdAt: '',
    updatedAt: '',
    ...p,
  }
}

const EVENTS: CalendarEvent[] = [
  mk({
    id: 'e1',
    title: 'Karate',
    startsAt: '2026-07-11T16:30:00',
    attendeeIds: ['zoe'],
    location: 'Dojo',
  }),
  mk({ id: 'e2', title: 'Tumbling', startsAt: '2026-07-11T17:15:00', attendeeIds: ['teddy'] }),
  mk({
    id: 'e3',
    title: 'Date night',
    startsAt: '2026-07-11T19:00:00',
    attendeeIds: ['zach', 'hallie'],
  }),
  mk({ id: 'e4', title: 'Family BBQ', startsAt: '2026-07-12T13:00:00', attendeeIds: [] }),
  // A week-long span: the event that used to claim a row on all five of its days.
  mk({
    id: 'camp',
    title: 'FISW Camp',
    startsAt: '2026-07-13T00:00:00',
    endsAt: '2026-07-18T00:00:00',
    allDay: true,
    attendeeIds: ['zoe', 'teddy'],
  }),
]

function renderWidget(props: {
  events?: CalendarEvent[]
  framing?: UpNextFraming
  size?: WidgetSize
  now?: Date
}) {
  return render(
    <MemoryRouter>
      <UpNextView
        events={props.events ?? EVENTS}
        membersById={MEMBERS}
        now={props.now ?? NOW}
        framing={props.framing ?? 'family'}
        size={props.size ?? 'large'}
      />
    </MemoryRouter>
  )
}

describe('UpNextView', () => {
  it('leads with the next-up hero and lists the rest', () => {
    renderWidget({})
    expect(screen.getByText('Up next ·')).toBeInTheDocument()
    expect(screen.getByText('Karate')).toBeInTheDocument()
    // The rest appear as rows, and the hero is not duplicated among them.
    expect(screen.getByText('Tumbling')).toBeInTheDocument()
    expect(screen.getByText('Date night')).toBeInTheDocument()
    expect(screen.getAllByText('Karate')).toHaveLength(1)
  })

  // NOW is Sat 13:20 and Karate is Sat 16:30 — still today, so "how soon" beats
  // "which day", and the eyebrow keeps the countdown it has always shown.
  it('keeps the countdown, not a day label, while the hero is still today', () => {
    renderWidget({})
    expect(screen.getByText('Up next ·')).toBeInTheDocument()
    expect(screen.getByText('in 3h 10m')).toBeInTheDocument()
    expect(screen.queryByText('Nothing left today ·')).not.toBeInTheDocument()
  })

  /* The bug. The hero is the next event still LIVE — not the next event today —
     so on a spent evening it silently promotes a future day. It used to announce
     that day's bare clock ("1:00 PM"), which reads as tonight. It must name the
     day, and say that today is done. */
  it('names the day and says today is spent when the hero is not today', () => {
    const bbq = EVENTS.find((e) => e.id === 'e4')!
    renderWidget({ events: [bbq] })

    expect(screen.getByText('Nothing left today ·')).toBeInTheDocument()
    expect(screen.getAllByText('Tomorrow').length).toBeGreaterThan(0)
    expect(screen.queryByText('Up next ·')).not.toBeInTheDocument()
    // The clock still renders — in the meta line, where it can't be mistaken for
    // the proximity clause.
    expect(screen.getByText('1:00 PM')).toBeInTheDocument()
  })

  /* A single-day all-day event has no clock, and printing its midnight start as
     "12:00 am" states a time the event doesn't have. */
  it('labels a single-day all-day row "all day", not midnight', () => {
    const picnic = mk({
      id: 'allday',
      title: 'School closed',
      startsAt: '2026-07-12T00:00:00',
      allDay: true,
      attendeeIds: ['zoe'],
    })
    renderWidget({ events: [...EVENTS, picnic] })

    expect(screen.getByText('all day')).toBeInTheDocument()
    expect(screen.queryByText('12:00 am')).not.toBeInTheDocument()
  })

  it('states an upcoming span once, on its start day — the band is for running things', () => {
    renderWidget({})
    // The camp starts Monday (future at NOW): no band, one Monday row carrying
    // the range in its time slot (gate 4 — "All week" must not cover next week).
    expect(screen.queryByTestId('span-band')).not.toBeInTheDocument()
    expect(screen.getAllByText('FISW Camp')).toHaveLength(1)
    expect(screen.getByText('Mon 13 – Fri 17')).toBeInTheDocument()
  })

  it('carries a running span in the all-week band, stated once', () => {
    // Same camp, viewed mid-run (Wednesday morning).
    renderWidget({ events: [EVENTS[4]], now: new Date('2026-07-15T08:00:00') })
    const band = screen.getByTestId('span-band')
    expect(within(band).getByText('All week')).toBeInTheDocument()
    expect(within(band).getByText('FISW Camp')).toBeInTheDocument()
    expect(within(band).getByText('Through Fri 17')).toBeInTheDocument()
    expect(screen.getAllByText('FISW Camp')).toHaveLength(1)
  })

  it('hides the all-week band entirely when there are no spans', () => {
    renderWidget({ events: EVENTS.filter((e) => e.id !== 'camp') })
    expect(screen.queryByTestId('span-band')).not.toBeInTheDocument()
    expect(screen.queryByText('All week')).not.toBeInTheDocument()
  })

  it('keeps empty weekdays in place — an empty day is news', () => {
    renderWidget({})
    // Mon–Fri hold only the camp (which is now in the band), so those days report
    // as clear rather than vanishing.
    expect(screen.getAllByText('Nothing else scheduled').length).toBeGreaterThan(0)
  })

  it('shows owners as avatars in the Family framing', () => {
    renderWidget({ framing: 'family' })
    // Rows carry avatars (labelled by name), not spelled-out owner names.
    expect(screen.getAllByLabelText('Teddy').length).toBeGreaterThan(0)
    expect(screen.getAllByLabelText('Zach').length).toBeGreaterThan(0)
    expect(screen.getAllByLabelText('Hallie').length).toBeGreaterThan(0)
    // A no-attendee event is still tagged Family.
    expect(screen.getAllByLabelText('Family').length).toBeGreaterThan(0)
  })

  it('drops owner avatars in the Mine framing but keeps the Family tag', () => {
    renderWidget({ framing: 'mine' })
    expect(screen.getByText('Karate')).toBeInTheDocument()
    expect(screen.queryByLabelText('Teddy')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Zach')).not.toBeInTheDocument()
    expect(screen.getAllByLabelText('Family').length).toBeGreaterThan(0)
  })

  it.each(['compact', 'standard', 'large'] as WidgetSize[])('renders the %s size', (size) => {
    renderWidget({ size })
    expect(screen.getByText('Karate')).toBeInTheDocument()
  })

  it.each(['compact', 'standard', 'large'] as WidgetSize[])(
    'every size states a RUNNING span somewhere (%s)',
    (size) => {
      // Mid-run Wednesday: the camp is a live condition on every density.
      renderWidget({ size, now: new Date('2026-07-15T08:00:00') })
      expect(screen.getAllByText(/FISW Camp/).length).toBeGreaterThan(0)
    }
  )

  it('shows the all-clear empty state with no events', () => {
    renderWidget({ events: [] })
    expect(screen.getByText('Nothing scheduled')).toBeInTheDocument()
    expect(screen.queryByText('Up next')).not.toBeInTheDocument()
  })

  it('is not all-clear when only a running span remains', () => {
    renderWidget({ events: [EVENTS[4]], now: new Date('2026-07-15T08:00:00') })
    expect(screen.queryByText('Nothing scheduled')).not.toBeInTheDocument()
    expect(screen.getByTestId('span-band')).toBeInTheDocument()
  })

  it('is not all-clear when the only thing this week is a span about to start', () => {
    renderWidget({ events: [EVENTS[4]] })
    expect(screen.queryByText('Nothing scheduled')).not.toBeInTheDocument()
    expect(screen.getByText('FISW Camp')).toBeInTheDocument()
  })

  /* auto-bug #135. The day label used to sit in an 84px left gutter beside its
     rows; it now leads them on its own line, the way the mobile agenda states a
     day — same `DayHeading`, one rank down. */
  it('leads each day with a heading line instead of a left gutter', () => {
    const { container } = renderWidget({})
    expect(container.querySelector('[class*="grid-cols-"]')).toBeNull()
    // Lead and its secondary date share the heading line.
    const heading = screen.getByText('Tomorrow').parentElement!
    expect(within(heading).getByText(/Jul 12/)).toBeInTheDocument()
  })

  it('tints the current day\u2019s heading with the primary hue', () => {
    renderWidget({})
    expect(screen.getByText('Later today')).toHaveClass('text-primary')
    expect(screen.getByText('Tomorrow')).toHaveClass('text-foreground')
  })

  it('deep-links the whole tile to /calendar, the link laid under the content', () => {
    renderWidget({})
    const link = screen.getByRole('link', { name: 'Open Calendar' })
    expect(link).toHaveAttribute('href', '/calendar')
    expect(link).toHaveClass('absolute', 'inset-0')
    expect(within(link.parentElement!).getByText('Karate')).toBeInTheDocument()
  })
})

describe('D-083 the All week band, rendered', () => {
  // Fri Jul 17: the camp's last day, and a Tue · Thu series that is just appointments.
  const FRIDAY = new Date('2026-07-17T08:45:00')
  const french = (day: number) =>
    mk({
      id: `french:2026-07-${day}`,
      seriesId: 'french',
      title: 'Middle School French',
      startsAt: `2026-07-${day}T15:30:00`,
      endsAt: `2026-07-${day}T16:30:00`,
      attendeeIds: ['zoe'],
      recurrence: 'daily',
      recurrenceWeekdays: [2, 4],
    })
  const pickup = mk({
    id: 'pickup',
    title: 'Early pickup',
    startsAt: '2026-07-17T12:00:00',
    attendeeIds: ['teddy'],
  })

  it('D-083 a condition on its last day leaves the band and reads "last day" in today’s list [F-023] #153', () => {
    renderWidget({ events: [...EVENTS, pickup], now: FRIDAY })
    expect(screen.queryByText('All week')).not.toBeInTheDocument()
    const row = screen.getByText('FISW Camp').closest('div')!
    expect(within(row).getByText('last day')).toBeInTheDocument()
  })

  it('D-083 a Tue · Thu series never wears the band; each occurrence lists with its clock [F-023] #153', () => {
    renderWidget({ events: [french(21), french(23)], now: new Date('2026-07-20T08:45:00') })
    expect(screen.queryByText('All week')).not.toBeInTheDocument()
    expect(screen.getAllByText('Middle School French')).toHaveLength(2)
  })
})

describe('D-095 today’s rides in the widget', () => {
  const today = localDateKey(NOW)
  const RIDES: DayMark = {
    date: today,
    glyph: 'car',
    label: '2 school runs',
    lines: [
      { id: 'tp', minutes: 1439, text: 'Zoe picks up Teddy', ownerId: 'p1', cleared: false },
      { id: 'zd', minutes: 1, text: 'Zoe drops off Zoe', ownerId: 'p1', cleared: false },
    ].sort((a, b) => a.minutes - b.minutes),
    act: {
      endpoint: `/api/rides/days/${today}`,
      owners: ['p1'],
      manage: { href: '/rides/week', label: 'Set the week' },
    },
  }
  const widget = (mark: DayMark, onMarkAction = vi.fn()) => {
    render(
      <MemoryRouter>
        <UpNextView
          events={EVENTS}
          membersById={MEMBERS}
          now={NOW}
          framing="family"
          size="large"
          todayMark={mark}
          onMarkAction={onMarkAction}
        />
      </MemoryRouter>
    )
    return onMarkAction
  }

  it('D-095 a line under the hero names the next run and unfolds today’s runs to swap in place [F-042]', () => {
    const onMarkAction = widget(RIDES)
    const line = screen.getByRole('button', { name: /Next: 11:59 PM, Zoe picks up Teddy/ })
    expect(screen.queryByRole('button', { name: /^Swap/ })).toBeNull()
    fireEvent.click(line)
    fireEvent.click(screen.getByRole('button', { name: 'Swap: Zoe picks up Teddy' }))
    expect(onMarkAction.mock.calls[0][2]).toBe('swap')
    fireEvent.click(screen.getByRole('button', { name: 'Done' }))
    expect(screen.queryByRole('button', { name: /^Swap/ })).toBeNull()
  })

  it('D-097 before any run exists the widget line sets the week up [F-041]', () => {
    widget({
      ...RIDES,
      lines: [],
      act: { ...RIDES.act!, manage: { href: '/rides/week', label: 'Set up school runs' } },
    })
    expect(screen.getByRole('link', { name: 'Set up school runs' })).toHaveAttribute(
      'href',
      '/rides/week'
    )
  })
})
