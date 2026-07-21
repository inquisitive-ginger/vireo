import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'
import { prisma } from '@family-os/platform/server'
import { FAMILY_PROFILE_ID } from '@family-os/platform/types'
import { BugReportCreateSchema, BugReportUpdateSchema } from '@family-os/schemas'
import type { BugReportContext, BugReportStatus } from '@family-os/schemas'
import { createBugIssue } from '../lib/github-issue'
import { notify } from '../lib/notify'

type ReportRow = {
  id: string
  description: string
  context: unknown
  status: string
  githubIssueNumber: number | null
  resolution: string | null
  createdAt: Date
  updatedAt: Date
  reporterId: string
}

type Reporter = {
  id: string
  name: string
  identityHue: string | null
  avatarUrl: string | null
}

/** Resolves a reporter id to an identity, for reporters that may have no profile row.
 *
 * The household pseudo-profile is synthetic wherever onboarding never wrote one, and it
 * is the default profile — so this is the common path, not the edge case. A reporter
 * whose profile was deleted resolves the same way: the report outlives its author,
 * because it is evidence about the app rather than the person's property. */
function resolveReporter(id: string, profile: Reporter | undefined): Reporter {
  if (profile) return profile
  if (id === FAMILY_PROFILE_ID) return { id, name: 'Family', identityHue: null, avatarUrl: null }
  return { id, name: 'Someone', identityHue: null, avatarUrl: null }
}

/** The reporter travels with the row (ADR 044) — a triage board is a multi-person
    surface, so `identityHue` has to be on the payload or the spine cannot be painted. */
function serializeReport(report: ReportRow, reporter: Reporter) {
  return {
    id: report.id,
    description: report.description,
    context: report.context as BugReportContext,
    status: report.status as BugReportStatus,
    githubIssueNumber: report.githubIssueNumber,
    resolution: report.resolution,
    createdAt: report.createdAt.toISOString(),
    updatedAt: report.updatedAt.toISOString(),
    reporter,
  }
}

/** What the reporter is told when their bug ships. Deliberately warm and specific —
    it quotes their own words back, because "a fix was deployed" means nothing to a
    child who reported that the calendar looked funny (ADR 046). */
function deployedNotification(description: string, resolution: string | null) {
  const quoted = description.length > 60 ? `${description.slice(0, 57)}…` : description
  return {
    title: 'Fixed and live',
    body: resolution ?? `The thing you reported — "${quoted}" — is fixed. Reload to see it.`,
    variant: 'success',
    priority: 'info',
  }
}

const bugReportsPlugin: FastifyPluginAsync = async (fastify) => {
  // POST /bug-reports — file a report. Every tier may (ADR 046).
  fastify.post('/bug-reports', async (request, reply) => {
    if (!request.ability.can('create', 'platform.BugReport')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    const parsed = BugReportCreateSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid report', details: parsed.error.flatten() })
    }

    const report = await prisma.bugReport.create({
      data: {
        reporterId: request.profile.id,
        description: parsed.data.description,
        context: parsed.data.context,
      },
    })

    // The GitHub issue is opened WITHOUT blocking the reply (the same fire-and-forget
    // shape as the push dispatch in notify()). A household on a slow uplink should not
    // watch a spinner while we talk to github.com, and a bridge failure must not cost
    // them the report — so the row is already committed by the time this runs.
    void createBugIssue({
      id: report.id,
      description: report.description,
      context: parsed.data.context,
      reporterName: request.profile.name,
      reporterTier: request.profile.tier,
    })
      .then(async (issueNumber) => {
        if (issueNumber === null) return
        await prisma.bugReport.update({
          where: { id: report.id },
          data: { githubIssueNumber: issueNumber, status: 'triaged' },
        })
        fastify.eventBus.emit('platform.bug-report.triaged', { id: report.id })
      })
      .catch(() => {})

    fastify.eventBus.emit('platform.bug-report.created', { id: report.id })

    // The reporter is the caller, already resolved by auth — no lookup needed, and it
    // works whether or not that profile has a row.
    return reply.status(201).send(
      serializeReport(report, {
        id: request.profile.id,
        name: request.profile.name,
        identityHue: request.profile.identityHue ?? null,
        avatarUrl: request.profile.avatarUrl ?? null,
      })
    )
  })

  // GET /bug-reports — your own reports. Tier 4 sees the whole household's (the
  // triage board), which is what `manage` on the subject buys.
  fastify.get('/bug-reports', async (request) => {
    const isTriager = request.ability.can('manage', 'platform.BugReport')

    const reports = await prisma.bugReport.findMany({
      where: isTriager ? {} : { reporterId: request.profile.id },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    // Resolved in one query rather than a relation, because a reporter may legitimately
    // have no profile row (see the model comment). Missing ones fall back by id.
    const profiles = await prisma.profile.findMany({
      where: { id: { in: [...new Set(reports.map((r) => r.reporterId))] } },
      select: { id: true, name: true, identityHue: true, avatarUrl: true },
    })
    const byId = new Map(profiles.map((p) => [p.id, p]))

    return reports.map((r) =>
      serializeReport(r, resolveReporter(r.reporterId, byId.get(r.reporterId)))
    )
  })

  // PATCH /bug-reports/:id — move a report along. Triage is tier-4 only.
  fastify.patch('/bug-reports/:id', async (request, reply) => {
    if (!request.ability.can('manage', 'platform.BugReport')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    const parsed = BugReportUpdateSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid update', details: parsed.error.flatten() })
    }

    const { id } = request.params as { id: string }
    const existing = await prisma.bugReport.findUnique({ where: { id } })
    if (!existing) return reply.status(404).send({ error: 'Not found' })

    const report = await prisma.bugReport.update({
      where: { id },
      data: {
        ...(parsed.data.status !== undefined ? { status: parsed.data.status } : {}),
        ...(parsed.data.resolution !== undefined ? { resolution: parsed.data.resolution } : {}),
      },
    })

    const reporterProfile = await prisma.profile.findUnique({
      where: { id: report.reporterId },
      select: { id: true, name: true, identityHue: true, avatarUrl: true },
    })

    // Only the arrival is worth a ping. Firing on every transition would train the
    // household to ignore the tray, and `triaged`/`fixing` are already visible in-app.
    // Guarded on the TRANSITION, not the value, so re-saving a deployed report is silent.
    if (parsed.data.status === 'deployed' && existing.status !== 'deployed') {
      // notify() itself returns null below tier 2, so a tier-1 reporter is skipped here
      // rather than gated — they read the status on their own reports list instead.
      await notify(
        fastify.eventBus,
        report.reporterId,
        deployedNotification(report.description, report.resolution)
      )
    }

    return serializeReport(report, resolveReporter(report.reporterId, reporterProfile ?? undefined))
  })
}

export default fp(bugReportsPlugin, { name: 'bug-reports' })
