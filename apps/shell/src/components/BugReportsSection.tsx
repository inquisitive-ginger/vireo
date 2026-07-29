import { useState } from 'react'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ChevronDown, ChevronRight, ExternalLink, Bug } from 'lucide-react'
import { FAMILY_PROFILE_ID } from '@family-os/platform'
import { ItemCard, EmptyState, FAMILY_HUE, identityToken, resolveHue } from '@family-os/ui'
import { BUG_REPORT_STATUSES } from '@family-os/schemas'
import type { BugReportStatus, BugReportContext } from '@family-os/schemas'
import { BugStatusPill, STATUS_LABELS } from './BugStatusPill'

type TriageReport = {
  id: string
  description: string
  context: BugReportContext
  status: BugReportStatus
  githubIssueNumber: number | null
  createdAt: string
  reporter: { id: string; name: string; identityHue: string | null; avatarUrl: string | null }
}

type ReportPage = { reports: TriageReport[]; nextCursor: string | null; total: number }

/* The board leads with live work. A report that is fixed or declined is settled —
   it still has to be readable (a reporter can ask, and `wont_fix` is a promise kept),
   but it is not what a parent opens this section to do. */
const ACTIVE: BugReportStatus[] = ['new', 'triaged', 'fixing']
const RESOLVED: BugReportStatus[] = ['deployed', 'wont_fix']

const PAGE_SIZE = 20

/* The household pseudo-profile wears the reserved Hearth hue, never a member's
   (ADR 041) — and it is the LIKELIEST reporter here, since the fridge iPad sits on
   the Family profile. It carries `identityHue: null`, so resolveHue alone would hash
   "Family" straight into a member's colour: the exact bug ADR 041 was written for. */
function reporterHue(reporter: { id: string; name: string; identityHue: string | null }) {
  return reporter.id === FAMILY_PROFILE_ID
    ? FAMILY_HUE
    : resolveHue(reporter.name, reporter.identityHue)
}

/* Both sections page independently off the same prefix, so one mutation
   invalidation refreshes both — which it must, since moving a report to
   `deployed` is exactly what carries it from one section to the other. */
function useReports(key: string, statuses: BugReportStatus[]) {
  return useInfiniteQuery({
    queryKey: ['bug-reports', key],
    queryFn: ({ pageParam }: { pageParam: string | null }) => {
      const cursor = pageParam ? `&cursor=${pageParam}` : ''
      return fetch(
        `/api/bug-reports?status=${statuses.join(',')}&limit=${PAGE_SIZE}${cursor}`
      ).then((r) => r.json()) as Promise<ReportPage>
    },
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextCursor,
  })
}

export function BugReportsSection() {
  const queryClient = useQueryClient()
  const active = useReports('active', ACTIVE)
  const resolved = useReports('resolved', RESOLVED)
  const [resolvedOpen, setResolvedOpen] = useState(false)

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: BugReportStatus }) => {
      const response = await fetch(`/api/bug-reports/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      })
      if (!response.ok) throw new Error('Update failed')
      return response.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bug-reports'] }),
  })

  if (active.isLoading)
    return <div className="px-6 py-5 text-sm-token text-muted-foreground">Loading…</div>

  const activeReports = active.data?.pages.flatMap((p) => p.reports) ?? []
  const resolvedReports = resolved.data?.pages.flatMap((p) => p.reports) ?? []
  const resolvedTotal = resolved.data?.pages[0]?.total ?? 0

  if (activeReports.length === 0 && resolvedTotal === 0) {
    return (
      <div className="px-6 py-8">
        <EmptyState icon={Bug} heading="Nothing reported" body="The house is happy with the app." />
      </div>
    )
  }

  const onStatus = (id: string, status: BugReportStatus) => setStatus.mutate({ id, status })

  return (
    <div className="px-4 py-4 md:px-6 md:py-5">
      {activeReports.length > 0 ? (
        <ul className="flex flex-col gap-2.5">
          {activeReports.map((report) => (
            <li key={report.id}>
              <ReportRow report={report} pending={setStatus.isPending} onStatus={onStatus} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm-token text-muted-foreground">
          Nothing open — everything reported has been dealt with.
        </p>
      )}

      {active.hasNextPage && (
        <MoreButton
          label="Further back"
          busy={active.isFetchingNextPage}
          onClick={() => active.fetchNextPage()}
        />
      )}

      {resolvedTotal > 0 && (
        <div className="mt-4 border-t border-border pt-2">
          <button
            type="button"
            onClick={() => setResolvedOpen((o) => !o)}
            className="text-section-label flex w-full items-center gap-1.5 py-2 text-muted-foreground"
            aria-expanded={resolvedOpen}
          >
            {resolvedOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            Settled · {resolvedTotal}
          </button>
          {resolvedOpen && (
            <>
              <ul className="flex flex-col gap-2.5 pt-1">
                {resolvedReports.map((report) => (
                  <li key={report.id}>
                    <ReportRow report={report} pending={setStatus.isPending} onStatus={onStatus} />
                  </li>
                ))}
              </ul>
              {resolved.hasNextPage && (
                <MoreButton
                  label="Further back"
                  busy={resolved.isFetchingNextPage}
                  onClick={() => resolved.fetchNextPage()}
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

function MoreButton({
  label,
  busy,
  onClick,
}: {
  label: string
  busy: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      disabled={busy}
      onClick={onClick}
      className="text-sm-token mt-2.5 py-2 text-muted-foreground underline underline-offset-4 disabled:opacity-50"
    >
      {busy ? 'Loading…' : `${label} ›`}
    </button>
  )
}

function ReportRow({
  report,
  pending,
  onStatus,
}: {
  report: TriageReport
  pending: boolean
  onStatus: (id: string, status: BugReportStatus) => void
}) {
  return (
    /* Identity takes the edge (ADR 043): the spine is the REPORTER's hue in
       every state — this board shows several people at once, so it never
       encodes status. Status is the pill in the row's field. */
    <ItemCard spine={identityToken(reporterHue(report.reporter))}>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm-token min-w-0 flex-1">{report.description}</p>
          <div className="shrink-0">
            <BugStatusPill status={report.status} />
          </div>
        </div>
        <p className="text-xs-body mt-1 text-muted-foreground">
          {report.reporter.name} · <code>{report.context.route}</code> · build{' '}
          {report.context.buildHash ?? 'unknown'}
          {report.githubIssueNumber !== null && (
            <>
              {' · '}
              <span className="inline-flex items-center gap-0.5">
                <ExternalLink size={11} aria-hidden />#{report.githubIssueNumber}
              </span>
            </>
          )}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {BUG_REPORT_STATUSES.filter((s) => s !== report.status).map((status) => (
            <button
              key={status}
              type="button"
              disabled={pending}
              onClick={() => onStatus(report.id, status)}
              className="text-xs-body rounded-md border border-border px-2 py-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50"
            >
              {STATUS_LABELS[status]}
            </button>
          ))}
        </div>
      </div>
    </ItemCard>
  )
}
