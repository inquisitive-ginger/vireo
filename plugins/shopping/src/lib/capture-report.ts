import type { CaptureReport } from '../types'

/** One collision the last submission reported: the list it doubled on, the name
    that landed, and the id of the row that add CREATED (null when that add is
    not retract-eligible). */
export interface CaptureDuplicate {
  listName: string
  name: string
  retractId: string | null
}

/** What a surface is holding about its own capture field. Both containers keep
    exactly this, so both rank it identically. */
export interface CaptureState {
  /** Newest first, and STICKY — a later success never clears one. A second
      failure names the newest and counts the rest. */
  addErrors: string[]
  /** One per collision in the last submission, in submitted order. Replaced each
      Enter rather than accumulated: a notice reports on the add you just made,
      and the errors beside it are the thing that has to survive. */
  duplicates: CaptureDuplicate[]
  /** A failure from the line's own action — a `Take it back?` refused at the
      fifteen-minute boundary (ADR 073 §2, shown never swallowed) — or a
      submission the client refused to send at all. */
  actionError: string | null
}

export const EMPTY_CAPTURE: CaptureState = { addErrors: [], duplicates: [], actionError: null }

/* The slot's contents, ranked: **one error line, then the notices** (D4). A lost
   item is worse news than a doubled one, so the error keeps the top and stays a
   single counted line however many failed; the notices stack under it, one per
   collision, each with its own verb and its own dismiss.

   Nothing here is cleared by a success — that is the defect the ordering rule was
   written for. Only a `✕` clears, and only the line it sits on. */
export function buildReport(
  state: CaptureState,
  handlers: {
    onClearErrors: () => void
    onDismissNotice: (index: number) => void
    onRetract: (itemId: string) => void
  }
): CaptureReport[] {
  const lines: CaptureReport[] = []

  if (state.actionError) {
    lines.push({
      tone: 'error',
      message: state.actionError,
      actions: [],
      onDismiss: handlers.onClearErrors,
    })
  } else if (state.addErrors.length > 0) {
    const [newest, ...rest] = state.addErrors
    lines.push({
      tone: 'error',
      message: `Couldn’t add “${newest}”${rest.length ? ` · ${rest.length} more` : ''}`,
      actions: [],
      onDismiss: handlers.onClearErrors,
    })
  }

  /* One collision is unambiguous — it is the word they just typed, so the line
     stays Zach's verbatim `Already on Grocery.` Two or more is not: three names
     went in and the reader cannot tell which of them doubled, so each line names
     itself. The rule is the ambiguity, not the batch — two collisions arriving
     any way at all get named. */
  const ambiguous = state.duplicates.length > 1
  state.duplicates.forEach((duplicate, index) => {
    lines.push({
      tone: 'notice',
      message: ambiguous
        ? `“${duplicate.name}” already on ${duplicate.listName}.`
        : `Already on ${duplicate.listName}.`,
      // Targets the JUST-CREATED row, never the pre-existing one it doubled — on
      // a shared list those are two different people's rows.
      actions: duplicate.retractId
        ? [{ label: 'Take it back?', onSelect: () => handlers.onRetract(duplicate.retractId!) }]
        : [],
      onDismiss: () => handlers.onDismissNotice(index),
    })
  })

  return lines
}

/** The error line's `✕`. It clears the whole counted line, which is what the
    line is — one report about every add that was lost. */
export function clearErrors(state: CaptureState): CaptureState {
  return { ...state, actionError: null, addErrors: [] }
}

/** One notice's `✕`. The others stand: they are separate collisions. */
export function dismissNotice(state: CaptureState, index: number): CaptureState {
  return { ...state, duplicates: state.duplicates.filter((_, i) => i !== index) }
}
