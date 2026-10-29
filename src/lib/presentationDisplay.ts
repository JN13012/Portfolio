import type { PresentationStatus } from './presentationAudio'

export const PRESENTATION_VIEW_KEY = 'sentry-presentation-view'
export const PAUSE_CAPTION_MS = 3000
type StoragePort = Pick<Storage, 'getItem' | 'setItem'>
type DisplaySnapshot = { minimized: boolean; speechVisible: boolean; controlsVisible: boolean }

/** View preference and one bounded pause timeout, independent of the media element. */
export function createPresentationDisplay(storage?: StoragePort) {
  let minimized = false
  try { minimized = storage?.getItem(PRESENTATION_VIEW_KEY) === 'reduced' } catch { /* Memory-only preference. */ }
  let state: DisplaySnapshot = { minimized, speechVisible: false, controlsVisible: false }
  let previousStatus: PresentationStatus = 'idle'
  let hideTimer: ReturnType<typeof setTimeout> | undefined
  const listeners = new Set<() => void>()
  const set = (patch: Partial<DisplaySnapshot>) => {
    const next = { ...state, ...patch }
    if (next.minimized === state.minimized && next.speechVisible === state.speechVisible && next.controlsVisible === state.controlsVisible) return
    state = next
    listeners.forEach((listener) => listener())
  }
  const cancelHide = () => { clearTimeout(hideTimer); hideTimer = undefined }
  return {
    get: () => state,
    subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener) } },
    setMinimized(value: boolean) {
      try { storage?.setItem(PRESENTATION_VIEW_KEY, value ? 'reduced' : 'expanded') } catch { /* The current view still changes. */ }
      set({ minimized: value })
    },
    sync(status: PresentationStatus) {
      // Media progress events must never restart the three-second timeout.
      if (status === previousStatus) return
      previousStatus = status
      cancelHide()
      if (status === 'playing') set({ speechVisible: true, controlsVisible: true })
      else if (status === 'loading') set({ controlsVisible: true })
      else if (status === 'paused') {
        set({ controlsVisible: true })
        hideTimer = setTimeout(() => {
          hideTimer = undefined
          set({ speechVisible: false, controlsVisible: false })
        }, PAUSE_CAPTION_MS)
      } else set({ speechVisible: false, controlsVisible: false })
    },
    resetSpeech() {
      cancelHide()
      previousStatus = 'idle'
      set({ speechVisible: false, controlsVisible: false })
    },
  }
}

export const presentationDisplay = createPresentationDisplay({
  getItem: (key) => window.sessionStorage.getItem(key),
  setItem: (key, value) => window.sessionStorage.setItem(key, value),
})
