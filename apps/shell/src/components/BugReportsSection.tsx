import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ExternalLink, Bug } from 'lucide-react'
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

/* The household pseudo-profile wears the reserved Hearth hue, never a member's
   (ADR 041) — and it is the LIKELIEST reporter here, since the fridge iPad sits on
   the Family profile. It carries `identityHue: null`, so resolveHue alone would hash
   "Family" straight into a member's colour: the exact bug ADR 041 was written for. */
function reporterHue(reporter: { id: string; name: string; identityHue: string | null }) {
  return reporter.id === FAMILY_PROFILE_ID
    ? FAMILY_HUE
    : resolveHue(reporter.name, reporter.identityHue)
}

export function BugReportsSection() {
  const queryClient = useQueryClient()

  const { data: reports = [], isLoading } = useQuery<TriageReport[]>({
    queryKey: ['bug-reports'],
    queryFn: () => fetch('/api/bug-reports').then((r) => r.json()) as Promise<TriageReport[]>,
  })

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

  if (isLoading)
    return <div className="px-6 py-5 text-sm-token text-muted-foreground">Loading…</div>

  if (reports.length === 0) {
    return (
      <div className="px-6 py-8">
        <EmptyState icon={Bug} heading="Nothing reported" body="The house is happy with the app." />
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-2.5 px-4 py-4 md:px-6 md:py-5">
      {reports.map((report) => (
        <li key={report.id}>
          {/* Identity takes the edge (ADR 043): the spine is the REPORTER's hue in
              every state — this board shows several people at once, so it never
              encodes status. Status is the pill in the row's field. */}
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
                    disabled={setStatus.isPending}
                    onClick={() => setStatus.mutate({ id: report.id, status })}
                    className="text-xs-body rounded-md border border-border px-2 py-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50"
                  >
                    {STATUS_LABELS[status]}
                  </button>
                ))}
              </div>
            </div>
          </ItemCard>
        </li>
      ))}
    </ul>
  )
}
