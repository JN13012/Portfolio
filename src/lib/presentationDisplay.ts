import type { PresentationStatus } from './presentationAudio'

export const PRESENTATION_VIEW_KEY = 'sentry-presentation-view'
export const PAUSE_CAPTION_MS = 3000
export const IDLE_FOLD_MS = 10000
export const PAUSE_FOLD_MS = 8000
export const PHONE_FOLD_MS = 6000
export const QUIET_MS = 6000
type StoragePort = Pick<Storage, 'getItem' | 'setItem'>
type DisplaySnapshot = { minimized: boolean; speechVisible: boolean }

/** Milliseconds before the expanded strip folds by itself, or null while it must stay open. */
export function autoFoldDelay({ status, pinned, welcomeDone, held, phone }: { status: PresentationStatus; pinned: boolean; welcomeDone: boolean; held: boolean; phone: boolean }) {
  if (held) return null
  if (status === 'ended') return 0
  if (status === 'paused') return phone ? PHONE_FOLD_MS : PAUSE_FOLD_MS
  if (status === 'idle' && welcomeDone && !pinned) return phone ? PHONE_FOLD_MS : IDLE_FOLD_MS
  return null
}

/** Reduced strip: play can fade away, leaving the chevron, unless it is playing or asking to retry. */
export const canGoQuiet = (status: PresentationStatus) => status === 'idle' || status === 'paused' || status === 'ended'

/** View preference and one bounded pause timeout, independent of the media element. */
export function createPresentationDisplay(storage?: StoragePort) {
  let minimized = false
  // Expanded by hand: stays open while idle, until the visitor reduces it or leaves the Hero.
  let pinned = false
  try {
    const view = storage?.getItem(PRESENTATION_VIEW_KEY)
    minimized = view === 'reduced'
    pinned = view === 'expanded'
  } catch { /* Memory-only preference. */ }
  let state: DisplaySnapshot = { minimized, speechVisible: false }
  let previousStatus: PresentationStatus = 'idle'
  let hideTimer: ReturnType<typeof setTimeout> | undefined
  const listeners = new Set<() => void>()
  const set = (patch: Partial<DisplaySnapshot>) => {
    const next = { ...state, ...patch }
    if (next.minimized === state.minimized && next.speechVisible === state.speechVisible) return
    state = next
    listeners.forEach((listener) => listener())
  }
  const cancelHide = () => { clearTimeout(hideTimer); hideTimer = undefined }
  return {
    get: () => state,
    subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener) } },
    pinned: () => pinned,
    setMinimized(value: boolean) {
      pinned = !value
      try { storage?.setItem(PRESENTATION_VIEW_KEY, value ? 'reduced' : 'expanded') } catch { /* The current view still changes. */ }
      set({ minimized: value })
    },
    sync(status: PresentationStatus) {
      // Media progress events must never restart the three-second timeout.
      if (status === previousStatus) return
      previousStatus = status
      cancelHide()
      if (status === 'playing') set({ speechVisible: true })
      else if (status === 'paused') {
        if (state.speechVisible) hideTimer = setTimeout(() => {
          hideTimer = undefined
          set({ speechVisible: false })
        }, PAUSE_CAPTION_MS)
      } else if (status !== 'loading') set({ speechVisible: false })
    },
    resetSpeech() {
      cancelHide()
      previousStatus = 'idle'
      set({ speechVisible: false })
    },
  }
}

export const presentationDisplay = createPresentationDisplay({
  getItem: (key) => window.sessionStorage.getItem(key),
  setItem: (key, value) => window.sessionStorage.setItem(key, value),
})
