import type { RunState } from '../../lib/brain'

export type SentryState = 'idle' | 'reading' | 'searching' | 'responding' | 'blocked'

export const GUARD_REACTION_MS = 1500

/** Recompute the underlying activity after a reaction; never restore an obsolete snapshot. */
export function sentryState({ activity, phase, typing = false, blocked = false }: {
  activity?: SentryState
  phase?: RunState['phase']
  typing?: boolean
  blocked?: boolean
}): SentryState {
  if (blocked || activity === 'blocked') return 'blocked'
  if (activity) return activity
  if (phase === 'question') return 'reading'
  if (phase === 'search') return 'searching'
  if (phase === 'write') return 'responding'
  return typing ? 'reading' : 'idle'
}
