import { presentationCaptionAt, type PresentationCaption } from '../content/presentation'
import { presentationAudio, type createPresentationPlayer } from './presentationAudio'

type Player = Pick<ReturnType<typeof createPresentationPlayer>, 'get' | 'readClock' | 'subscribe'>
type TranscriptSnapshot = { caption: PresentationCaption | undefined; wordIndex: number }

/** One deadline at the next word boundary; no frame loop, text-length estimate or global progress update. */
export function createPresentationTranscript(player: Player) {
  let state: TranscriptSnapshot = { caption: undefined, wordIndex: -1 }
  let timer: ReturnType<typeof setTimeout> | undefined
  let unsubscribe: (() => void) | undefined
  const listeners = new Set<() => void>()
  const cancel = () => { clearTimeout(timer); timer = undefined }
  const refresh = () => {
    cancel()
    const { currentTime, playbackRate } = player.readClock()
    const audio = player.get()
    const caption = presentationCaptionAt(currentTime, audio.chapterId)
    const wordIndex = caption?.words.findIndex((word) => currentTime >= word.start && currentTime < word.end) ?? -1
    if (state.caption !== caption || state.wordIndex !== wordIndex) {
      state = { caption, wordIndex }
      listeners.forEach((listener) => listener())
    }
    if (!listeners.size || audio.status !== 'playing' || !caption) return
    const next = caption.words.flatMap((word) => [word.start, word.end]).find((time) => time > currentTime) ?? caption.end
    const rate = Number.isFinite(playbackRate) && playbackRate > 0 ? playbackRate : 1
    if (next > currentTime) timer = setTimeout(refresh, Math.max(16, (next - currentTime) * 1000 / rate + 2))
  }
  return {
    get: () => state,
    subscribe(listener: () => void) {
      listeners.add(listener)
      if (!unsubscribe) unsubscribe = player.subscribe(refresh)
      refresh()
      return () => {
        listeners.delete(listener)
        if (!listeners.size) { cancel(); unsubscribe?.(); unsubscribe = undefined }
      }
    },
  }
}

export const presentationTranscript = createPresentationTranscript(presentationAudio)
