/** Shared first-visit greeting; renderers only read it to defer automatic red demos. */
export const SEEN_KEY = 'sentry-welcome-seen'
export const ATTENTION_DURATION_MS = 750
export const LAST_CUE_DELAY_MS = 2000
export type WelcomeCue = 0 | 1 | 2 | 3
type WelcomeSnapshot = {
  phase: 'pending' | 'visible' | 'dismissed'
  portalVisible: boolean
  opened: boolean
  finalReady: boolean
  completed: WelcomeCue
  cue: WelcomeCue
}

function readSeen() {
  try { return sessionStorage.getItem(SEEN_KEY) === '1' } catch { return false }
}
function markSeen() {
  try { sessionStorage.setItem(SEEN_KEY, '1') } catch { /* The in-memory session still works. */ }
}

/** Retain milestones that arrive during a tilt; each actual completion advances the sequence. */
function advance(state: WelcomeSnapshot): WelcomeSnapshot {
  if (state.phase !== 'pending' || state.cue) return state
  if (state.completed === 3) return { ...state, phase: 'visible' }
  if (state.opened && state.completed < 2) return { ...state, cue: 2 }
  if (state.opened && state.finalReady) return { ...state, cue: 3 }
  if (state.portalVisible && state.completed < 1) return { ...state, cue: 1 }
  return state
}

export function createSentryWelcome(seen: boolean, persistSeen = markSeen) {
  let state: WelcomeSnapshot = {
    phase: seen ? 'dismissed' : 'pending', portalVisible: false,
    opened: false, finalReady: false, completed: 0, cue: 0,
  }
  const listeners = new Set<() => void>()
  const set = (next: WelcomeSnapshot) => {
    const previous = state
    state = advance(next)
    if (previous.phase === 'pending' && state.phase !== 'pending') persistSeen()
    listeners.forEach((listener) => listener())
  }
  return {
    get: () => state,
    subscribe: (listener: () => void) => {
      listeners.add(listener)
      return () => { listeners.delete(listener) }
    },
    reveal: () => {
      if (state.phase === 'pending' && !state.portalVisible) set({ ...state, portalVisible: true })
    },
    opened: () => {
      if (state.phase === 'pending' && !state.opened) set({ ...state, opened: true })
    },
    lastReady: () => {
      if (state.phase === 'pending' && state.opened && !state.finalReady) set({ ...state, finalReady: true })
    },
    cueFinished: (cue: WelcomeCue) => {
      if (state.phase === 'pending' && cue && state.cue === cue) set({ ...state, completed: cue, cue: 0 })
    },
    dismiss: () => {
      if (state.phase !== 'dismissed') set({ ...state, phase: 'dismissed', cue: 0 })
    },
  }
}

export const sentryWelcome = createSentryWelcome(readSeen())
