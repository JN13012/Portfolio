import { presentationChapters } from '../content/presentation'

export type PresentationStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error'
export type PresentationPhase = 'idle' | 'loading' | 'playing'
export type PresentationSnapshot = {
  status: PresentationStatus
  currentTime: number
  duration: number
}

/** Narrow browser media port: one lazy audio element shared by every control. */
export interface PresentationMedia extends EventTarget {
  src: string
  preload: string
  currentTime: number
  readonly duration: number
  readonly paused: boolean
  play(): Promise<void>
  pause(): void
  load(): void
  removeAttribute(name: string): void
}

export function createPresentationPlayer(createMedia: () => PresentationMedia, src: string) {
  const initial: PresentationSnapshot = { status: 'idle', currentTime: 0, duration: 0 }
  let state = initial
  let media: PresentationMedia | null = null
  let attempt = 0
  let removeListeners = () => {}
  const listeners = new Set<() => void>()
  const set = (patch: Partial<PresentationSnapshot>) => {
    state = { ...state, ...patch }
    listeners.forEach((listener) => listener())
  }
  const syncTime = () => {
    if (!media) return
    set({
      duration: Number.isFinite(media.duration) && media.duration > 0 ? media.duration : 0,
      currentTime: Number.isFinite(media.currentTime) ? Math.max(0, media.currentTime) : 0,
    })
  }
  const ensureMedia = () => {
    if (media) return media
    const audio = createMedia()
    media = audio
    audio.preload = 'none'
    audio.src = src
    const events: Record<string, () => void> = {
      loadedmetadata: syncTime,
      durationchange: syncTime,
      timeupdate: syncTime,
      seeking: syncTime,
      seeked: syncTime,
      playing: () => { if (!audio.paused) { syncTime(); set({ status: 'playing' }) } },
      waiting: () => { if (!audio.paused) set({ status: 'loading' }) },
      pause: () => { if (audio.paused && (state.status === 'playing' || state.status === 'loading')) set({ status: 'paused' }) },
      ended: () => set({ status: 'ended', currentTime: state.duration }),
      error: () => { attempt++; set({ status: 'error' }) },
    }
    Object.entries(events).forEach(([event, listener]) => audio.addEventListener(event, listener))
    removeListeners = () => Object.entries(events).forEach(([event, listener]) => audio.removeEventListener(event, listener))
    return audio
  }
  const pause = () => {
    attempt++
    media?.pause()
    syncTime()
    if (state.status === 'loading' || state.status === 'playing') set({ status: 'paused' })
  }
  const play = async () => {
    if (state.status === 'playing' || state.status === 'loading') return
    const request = ++attempt
    try {
      const audio = ensureMedia()
      if (state.status === 'error') audio.load()
      if (state.status === 'ended') audio.currentTime = 0
      syncTime()
      set({ status: 'loading' })
      // Called synchronously from the user's click; actual media events drive the visuals.
      await audio.play()
    } catch {
      // A pause, stop or teardown may cancel a pending play promise; it is not a playback error.
      if (attempt === request) set({ status: 'error' })
    }
  }
  return {
    get: () => state,
    subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener) } },
    play,
    pause,
    toggle: () => state.status === 'playing' || state.status === 'loading' ? pause() : void play(),
    seek: (seconds: number) => {
      if (!media || !state.duration || !Number.isFinite(seconds)) return
      media.currentTime = Math.min(state.duration, Math.max(0, seconds))
      if (state.status === 'ended') set({ status: 'paused' })
      syncTime()
    },
    stop: () => {
      pause()
      if (media) media.currentTime = 0
      set({ status: 'idle', currentTime: 0 })
    },
    destroy: () => {
      attempt++
      removeListeners()
      if (media) {
        media.pause()
        media.removeAttribute('src')
        media.load()
        media = null
      }
      state = initial
      listeners.forEach((listener) => listener())
    },
  }
}

export const presentationAudio = createPresentationPlayer(() => new Audio(), presentationChapters[0].src)

/** Stable primitive snapshot: progress events never re-render the heavy network or Sentry. */
export function presentationPhase(): PresentationPhase {
  const { status } = presentationAudio.get()
  return status === 'playing' || status === 'loading' ? status : 'idle'
}
