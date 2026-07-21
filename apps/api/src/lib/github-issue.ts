import type { BugReportContext } from '@family-os/schemas'

/** The label a triage session filters on. Changing it means changing the playbook
    query in `docs/fix-it-playbook.md` too. */
export const AUTO_BUG_LABEL = 'auto-bug'

export type IssueInput = {
  id: string
  description: string
  context: BugReportContext
  reporterName: string
  reporterTier: number
}

/** The issue body is the whole point of the bridge: it is what a fixer reads instead of
    interviewing a nine-year-old. Everything the app captured goes in verbatim, because a
    detail that looks irrelevant here is often the one that reproduces the bug. */
export function formatIssueBody(input: IssueInput): string {
  const { context: ctx } = input
  const viewport = ctx.viewport ? `${ctx.viewport.width}×${ctx.viewport.height}` : 'unknown'

  const lines = [
    `> Reported in-app by **${input.reporterName}** (tier ${input.reporterTier}).`,
    '',
    '## What they said',
    '',
    input.description,
    '',
    '## Capture',
    '',
    `| | |`,
    `| --- | --- |`,
    `| Route | \`${ctx.route}\` |`,
    `| Build | \`${ctx.buildHash ?? 'unknown'}\` |`,
    `| Viewport | ${viewport} |`,
    `| User agent | \`${ctx.userAgent ?? 'unknown'}\` |`,
    `| Report id | \`${input.id}\` |`,
  ]

  if (ctx.consoleErrors.length > 0) {
    lines.push('', '## Console errors', '', '```', ...ctx.consoleErrors, '```')
  }

  lines.push(
    '',
    '---',
    '',
    `_Filed by Family OS. Moving the report to \`deployed\` notifies ${input.reporterName} in-app._`
  )

  return lines.join('\n')
}

/** A report's title is the reporter's own first line, trimmed to something an issue list
    can show. Their words, not a generated summary — the summary is the fixer's job. */
export function formatIssueTitle(description: string): string {
  const firstLine = description.split('\n')[0]?.trim() ?? description.trim()
  return firstLine.length > 80 ? `${firstLine.slice(0, 77)}…` : firstLine
}

/** Opens a GitHub issue for a report. Returns the issue number, or `null` when the
 * bridge is not configured or the call fails.
 *
 * Deliberately total: every failure path returns null rather than throwing (ADR 046).
 * The bridge is a convenience for the maintainer; the report itself is the household's,
 * and losing it because a token expired would be the wrong trade. Callers fire this
 * without awaiting the reporter's response.
 */
export async function createBugIssue(input: IssueInput): Promise<number | null> {
  const token = process.env.GITHUB_TOKEN
  const repo = process.env.GITHUB_REPO

  if (!token || !repo) return null

  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/issues`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: formatIssueTitle(input.description),
        body: formatIssueBody(input),
        labels: [AUTO_BUG_LABEL],
      }),
      signal: AbortSignal.timeout(10_000),
    })

    if (!response.ok) return null

    const issue = (await response.json()) as { number?: number }
    return typeof issue.number === 'number' ? issue.number : null
  } catch {
    return null
  }
}
