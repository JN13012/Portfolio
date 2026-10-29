import { presentationChapters } from '../content/presentation'

export type PresentationStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error'
export type PresentationPhase = 'idle' | 'loading' | 'playing'
export type PresentationSnapshot = {
  chapterId: string
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
  readonly ended: boolean
  readonly playbackRate?: number
  play(): Promise<void>
  pause(): void
  load(): void
  removeAttribute(name: string): void
}

type PresentationTrack = { id: string; src: string }

export function createPresentationPlayer(createMedia: () => PresentationMedia, tracks: readonly PresentationTrack[]) {
  const firstTrack = tracks[0]
  if (!firstTrack) throw new Error('At least one recorded chapter is required')
  const initial: PresentationSnapshot = { chapterId: firstTrack.id, status: 'idle', currentTime: 0, duration: 0 }
  let state = initial
  let trackIndex = 0
  let currentTrack = firstTrack
  let changingSource = false
  let media: PresentationMedia | null = null
  let attempt = 0
  let removeListeners = () => {}
  const listeners = new Set<() => void>()
  const set = (patch: Partial<PresentationSnapshot>) => {
    state = { ...state, ...patch }
    listeners.forEach((listener) => listener())
  }
  const syncTime = () => {
    if (!media || changingSource) return
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
    audio.src = currentTrack.src
    const events: Record<string, () => void> = {
      loadedmetadata: syncTime,
      durationchange: syncTime,
      timeupdate: syncTime,
      seeking: syncTime,
      seeked: syncTime,
      ratechange: syncTime,
      playing: () => { if (!changingSource && !audio.paused) { syncTime(); set({ status: 'playing' }) } },
      waiting: () => { if (!changingSource && !audio.paused) set({ status: 'loading' }) },
      pause: () => { if (!changingSource && audio.paused && !audio.ended && (state.status === 'playing' || state.status === 'loading')) set({ status: 'paused' }) },
      ended: () => {
        if (changingSource || (state.status !== 'playing' && state.status !== 'loading')) return
        const next = tracks[trackIndex + 1]
        if (next) selectChapter(next.id)
        else set({ status: 'ended', currentTime: state.duration })
      },
      error: () => { if (!changingSource) { attempt++; set({ status: 'error' }) } },
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
  const play = async (): Promise<void> => {
    if (state.status === 'playing' || state.status === 'loading') return
    if (state.status === 'ended' && trackIndex > 0) {
      selectChapter(firstTrack.id)
      return
    }
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
  const selectChapter = (chapterId: string): void => {
    const index = tracks.findIndex((track) => track.id === chapterId)
    const nextTrack = tracks[index]
    if (!nextTrack) return
    attempt++
    changingSource = true
    media?.pause()
    if (index !== trackIndex) {
      trackIndex = index
      currentTrack = nextTrack
      if (media) {
        media.src = currentTrack.src
        media.load()
      }
      set({ chapterId, status: 'idle', currentTime: 0, duration: 0 })
    } else {
      if (media) media.currentTime = 0
      set({ status: 'idle', currentTime: 0 })
    }
    changingSource = false
    void play()
  }
  return {
    get: () => state,
    /** Read the native clock between timeupdate events, without notifying global subscribers. */
    readClock: () => ({ currentTime: media?.currentTime ?? state.currentTime, playbackRate: media?.playbackRate ?? 1 }),
    subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener) } },
    play,
    selectChapter,
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
      trackIndex = 0
      currentTrack = firstTrack
      listeners.forEach((listener) => listener())
    },
  }
}

export const presentationAudio = createPresentationPlayer(() => new Audio(), presentationChapters.filter((chapter) => 'src' in chapter))

/** Stable primitive snapshot: progress events never re-render the heavy network or Sentry. */
export function presentationPhase(): PresentationPhase {
  const { status } = presentationAudio.get()
  return status === 'playing' || status === 'loading' ? status : 'idle'
}
