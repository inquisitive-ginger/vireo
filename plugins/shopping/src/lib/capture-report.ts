import type { CaptureReport } from '../types'

/** What a surface is holding about its own capture field: names that failed to
    land, a collision the last add reported, and a failure from the slot's own
    action. Both containers keep exactly this, so both rank it identically. */
export interface CaptureState {
  /** Newest first. A second failure names the newest and counts the rest — the
      newest never silently overwrites the record that the first was lost. */
  addErrors: string[]
  /** The pre-existing unchecked row the last add doubled, and the id of the row
      that add CREATED (null when that add is not retract-eligible). */
  duplicate: { listName: string; name: string; retractId: string | null } | null
  /** A failure from the line's own action, e.g. a `Take it back?` refused at the
      fifteen-minute boundary (ADR 073 §2 — shown, never swallowed). */
  actionError: string | null
}

export const EMPTY_CAPTURE: CaptureState = { addErrors: [], duplicate: null, actionError: null }

/* The precedence, in one place because every capture surface owes the same
   order: **error > duplicate notice > idle** (D4). A lost item is worse news
   than a doubled one.

   Nothing here is cleared by a success — that is the defect the ordering rule
   was written for. Only `onDismiss` clears. */
export function buildReport(
  state: CaptureState,
  handlers: { onDismiss: () => void; onRetract: (itemId: string) => void }
): CaptureReport | null {
  if (state.actionError) {
    return { tone: 'error', message: state.actionError, actions: [], onDismiss: handlers.onDismiss }
  }
  if (state.addErrors.length > 0) {
    const [newest, ...rest] = state.addErrors
    return {
      tone: 'error',
      message: `Couldn’t add “${newest}”${rest.length ? ` · ${rest.length} more` : ''}`,
      actions: [],
      onDismiss: handlers.onDismiss,
    }
  }
  if (state.duplicate) {
    const { listName, retractId } = state.duplicate
    return {
      tone: 'notice',
      // Two clauses, verbatim: the fact, and the only thing to do about it. No
      // aisle clause and no "added anyway" — the row is visibly there, so saying
      // so is a sentence the reader has to parse and cannot use.
      message: `Already on ${listName}.`,
      // `Take it back?` targets the JUST-CREATED row, never the pre-existing one
      // — on a shared list those are two different people's rows — and is absent
      // when that add is not retract-eligible.
      actions: retractId
        ? [{ label: 'Take it back?', onSelect: () => handlers.onRetract(retractId) }]
        : [],
      onDismiss: handlers.onDismiss,
    }
  }
  return null
}

/** The `✕`, and the only thing that clears the line. It clears what is showing,
    which the precedence above already decided. */
export function dismissReport(state: CaptureState): CaptureState {
  if (state.actionError) return { ...state, actionError: null }
  if (state.addErrors.length > 0) return { ...state, addErrors: [] }
  return { ...state, duplicate: null }
}
