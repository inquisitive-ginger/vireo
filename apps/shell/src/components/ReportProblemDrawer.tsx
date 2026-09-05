import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Drawer, Textarea, Button, FieldLabel, SectionLabel } from '@family-os/ui'
import type { BugReportStatus } from '@family-os/schemas'
import { captureContext, getBuildHash } from '@/lib/report-context'
import { BugStatusPill } from './BugStatusPill'

type BugReport = {
  id: string
  description: string
  status: BugReportStatus
  resolution: string | null
  createdAt: string
}

export function ReportProblemDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { pathname } = useLocation()
  const queryClient = useQueryClient()
  const [description, setDescription] = useState('')
  const [failed, setFailed] = useState(false)

  // Paged so a long-standing reporter's oldest reports are revealed rather than
  // dropped — the status round-trip is the promise this list keeps (ADR 046).
  const history = useInfiniteQuery({
    queryKey: ['bug-reports', 'mine'],
    queryFn: ({ pageParam }: { pageParam: string | null }) =>
      fetch(`/api/bug-reports?limit=10${pageParam ? `&cursor=${pageParam}` : ''}`).then((r) =>
        r.json()
      ) as Promise<{ reports: BugReport[]; nextCursor: string | null }>,
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextCursor,
    enabled: open,
  })
  const reports = history.data?.pages.flatMap((p) => p.reports) ?? []

  const submit = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/bug-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        // Context is captured at SEND, not at open: the reporter often opens the tray,
        // goes back to reproduce the problem, and returns — the route and the console
        // errors that matter are the ones from the moment they pressed the button.
        body: JSON.stringify({ description, context: captureContext(pathname) }),
      })
      if (!response.ok) throw new Error('Report failed')
      return response.json()
    },
    onSuccess: () => {
      setDescription('')
      setFailed(false)
      queryClient.invalidateQueries({ queryKey: ['bug-reports'] })
    },
    onError: () => setFailed(true),
  })

  const canSend = description.trim().length > 0 && !submit.isPending

  return (
    <Drawer open={open} onClose={onClose} title="Report a problem">
      <div className="flex flex-col gap-5 px-6 py-5">
        <div>
          <FieldLabel htmlFor="bug-description">What went wrong?</FieldLabel>
          <Textarea
            id="bug-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What were you doing, and what did you expect to happen?"
            className="min-h-24"
            maxLength={2000}
          />
          {failed && (
            <p className="text-xs-body mt-2 text-destructive">
              That didn&apos;t send — check your connection and try again. Your words are still
              here.
            </p>
          )}
        </div>

        {/* Shown, not hidden: the reporter should be able to see exactly what they are
            about to hand over. It is also the fastest way to explain why they don't
            have to describe their device. */}
        <div className="rounded-panel bg-surface-sunken px-3.5 py-3 shadow-[var(--shadow-inset)]">
          <SectionLabel leading as="p" className="text-muted-foreground">
            Attached automatically
          </SectionLabel>
          <div className="flex flex-wrap gap-1.5">
            <ContextTag label="page" value={pathname} />
            <ContextTag label="screen" value={`${window.innerWidth}×${window.innerHeight}`} />
            <ContextTag label="app version" value={getBuildHash()} />
          </div>
          <p className="text-xs-body mt-2.5 text-muted-foreground">
            So we can find it without asking you twenty questions.
          </p>
        </div>

        <Button className="w-full" disabled={!canSend} onClick={() => submit.mutate()}>
          {submit.isPending ? 'Sending…' : 'Send report'}
        </Button>

        {reports.length > 0 && (
          <div className="border-t border-border pt-5">
            <SectionLabel leading as="p" className="text-muted-foreground">
              Your reports
            </SectionLabel>
            <ul className="flex flex-col gap-2.5">
              {reports.map((report) => (
                <li key={report.id} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm-token truncate">{report.description}</p>
                    {report.resolution && (
                      <p className="text-xs-body mt-0.5 text-muted-foreground">
                        {report.resolution}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0">
                    <BugStatusPill status={report.status} />
                  </div>
                </li>
              ))}
            </ul>
            {history.hasNextPage && (
              <button
                type="button"
                disabled={history.isFetchingNextPage}
                onClick={() => history.fetchNextPage()}
                className="text-sm-token mt-2.5 py-2 text-muted-foreground underline underline-offset-4 disabled:opacity-50"
              >
                {history.isFetchingNextPage ? 'Loading…' : 'Further back ›'}
              </button>
            )}
          </div>
        )}
      </div>
    </Drawer>
  )
}

function ContextTag({ label, value }: { label: string; value: string }) {
  return (
    <span className="text-xs-body rounded-md border border-border bg-card px-2 py-1 text-muted-foreground">
      {label} <span className="font-semibold text-foreground">{value}</span>
    </span>
  )
}
