import { useEffect, useId, useRef, type CSSProperties } from 'react'
import { ChevronDown, ChevronUp, LoaderCircle, Pause, Play, RotateCcw } from 'lucide-react'
import { presentationChapters, presentationCopy as copy } from '../../content/presentation'
import { presentationAudio } from '../../lib/presentationAudio'
import { presentationDisplay } from '../../lib/presentationDisplay'
import { usePresentationAudio, usePresentationDisplay } from '../../lib/usePresentationAudio'
import './presentation.css'

function timestamp(seconds: number) {
  const safe = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, '0')}`
}

/** Reserve footer space only where its text shares the fixed player's horizontal area. */
function usePlayerLayout(root: React.RefObject<HTMLDivElement | null>, inChat: boolean) {
  useEffect(() => {
    const element = root.current
    if (!element || inChat) return
    const dock = element.closest<HTMLElement>('.sentry-chat')
    if (!dock) return
    const footer = document.querySelector('footer')
    const update = () => {
      const player = element.getBoundingClientRect()
      dock.style.setProperty('--presentation-strip-height', `${Math.ceil(player.height)}px`)
      if (!footer) return
      const text = document.createTreeWalker(footer, NodeFilter.SHOW_TEXT)
      const range = document.createRange()
      let overlaps = false
      while (text.nextNode()) {
        if (!text.currentNode.textContent?.trim()) continue
        range.selectNodeContents(text.currentNode)
        if ([...range.getClientRects()].some((rect) => rect.left < player.right && rect.right > player.left)) {
          overlaps = true
          break
        }
      }
      footer.style.setProperty('--presentation-footer-space', overlaps ? `${Math.ceil(player.height) + 28}px` : '0px')
    }
    const resize = new ResizeObserver(update)
    resize.observe(element)
    if (footer) resize.observe(footer)
    return () => {
      resize.disconnect()
      dock.style.removeProperty('--presentation-strip-height')
      footer?.style.removeProperty('--presentation-footer-space')
    }
  }, [root, inChat])
}

/** Fixed, outside the Hero's flow; both views still control the same lazy media element. */
export function PresentationPlayer({ inChat = false }: { inChat?: boolean }) {
  const audio = usePresentationAudio()
  const display = usePresentationDisplay()
  const root = useRef<HTMLDivElement>(null)
  const chapters = useRef<HTMLOListElement>(null)
  const viewToggle = useRef<HTMLButtonElement>(null)
  const wasMinimized = useRef(display.minimized)
  const playerId = useId()
  usePlayerLayout(root, inChat)
  useEffect(() => {
    if (wasMinimized.current !== display.minimized) viewToggle.current?.focus({ preventScroll: true })
    wasMinimized.current = display.minimized
  }, [display.minimized])
  useEffect(() => {
    const list = chapters.current
    const current = list?.querySelector<HTMLElement>('[data-current="true"]')
    if (!list || !current) return
    const bounds = list.getBoundingClientRect()
    const item = current.getBoundingClientRect()
    // Scroll only the chapter list; scrollIntoView could move the portfolio itself.
    if (item.left < bounds.left) list.scrollLeft += item.left - bounds.left - 3
    else if (item.right > bounds.right) list.scrollLeft += item.right - bounds.right + 3
  }, [audio.chapterId, display.minimized, inChat])

  const active = audio.status === 'playing' || audio.status === 'loading'
  const chapterIndex = presentationChapters.findIndex((chapter) => chapter.id === audio.chapterId)
  const currentChapter = presentationChapters[chapterIndex] ?? presentationChapters[0]
  const label = active ? copy.pause : audio.status === 'ended' ? copy.replay : audio.status === 'paused' ? copy.resume : audio.status === 'error' ? copy.retry : copy.play
  const progress = audio.duration ? Math.min(100, audio.currentTime / audio.duration * 100) : 0
  const duration = audio.duration || ('duration' in currentChapter ? currentChapter.duration : 0)

  return (
    <div ref={root} id={playerId} className="presentation-dock" data-presentation data-minimized={display.minimized} data-inline={inChat}>
      {display.minimized ? (
        <div className="presentation-mini" role="group" aria-label="Lecteur audio réduit" data-state={audio.status} data-controls-visible={inChat || display.controlsVisible}>
          <div className="presentation-mini__playback">
            <button type="button" className="presentation-control presentation-control--play" onClick={presentationAudio.toggle} aria-label={label}>
              {audio.status === 'loading' ? <LoaderCircle size={16} aria-hidden="true" className="motion-safe:animate-spin" /> : active ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
            </button>
            <progress aria-label={`Progression du chapitre ${currentChapter.title}`} max={duration} value={Math.min(audio.currentTime, duration)} />
          </div>
          <button ref={viewToggle} type="button" className="presentation-control presentation-control--view" onClick={() => presentationDisplay.setMinimized(false)} aria-label={copy.expand} title={copy.expand} aria-controls={playerId} aria-expanded={false}>
            <ChevronUp size={17} aria-hidden="true" />
          </button>
          <p className="sr-only" role="status">{audio.status === 'idle' ? 'Présentation prête à être écoutée' : copy[audio.status]}</p>
        </div>
      ) : (
        <section aria-label="Présentation audio du portfolio" className="presentation-strip">
          <div className="presentation-toolbar">
            <div className="presentation-controls">
              <div className="flex">
                <button type="button" className="presentation-control" onClick={() => presentationAudio.seek(0)} aria-label={`Revenir au début du chapitre ${currentChapter.title}`} disabled={!audio.duration}>
                  <RotateCcw size={15} aria-hidden="true" />
                </button>
                <button type="button" className="presentation-control presentation-control--play" onClick={presentationAudio.toggle} aria-label={label}>
                  {audio.status === 'loading' ? <LoaderCircle size={16} aria-hidden="true" className="motion-safe:animate-spin" /> : active ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
                </button>
              </div>
              <span className="presentation-time">{timestamp(audio.currentTime)} / {timestamp(Math.ceil(duration))}</span>
            </div>
            <ol ref={chapters} aria-label="Chapitres de la présentation" className="presentation-chapters">
              {presentationChapters.map((chapter, index) => {
                const available = 'src' in chapter
                const current = chapter.id === audio.chapterId
                return (
                  <li key={chapter.id} className="presentation-chapter" data-available={available} data-current={current}>
                    {current ? (
                      <label className="presentation-track">
                        <span className="sr-only">{`Position dans le chapitre ${chapter.title}`}</span>
                        <input type="range" min={0} max={audio.duration || 1} step={0.1} value={Math.min(audio.currentTime, audio.duration || 1)}
                          disabled={!audio.duration} onChange={(event) => presentationAudio.seek(Number(event.target.value))}
                          aria-valuetext={`${timestamp(audio.currentTime)} sur ${timestamp(Math.ceil(audio.duration))}`}
                          style={{ '--track-progress': `${progress}%` } as CSSProperties} />
                      </label>
                    ) : <span className={`presentation-track ${available ? 'presentation-track--available' : 'presentation-track--locked'}`} style={{ '--track-progress': index < chapterIndex ? '100%' : '0%' } as CSSProperties} aria-hidden="true" />}
                    <button type="button" disabled={!available} aria-current={current ? 'step' : undefined}
                      aria-label={`${index + 1}. ${chapter.title}${available ? '' : ` · ${copy.soon}`}`}
                      onClick={() => presentationAudio.selectChapter(chapter.id)}>
                      {chapter.shortTitle}
                    </button>
                  </li>
                )
              })}
            </ol>
            <div className="presentation-actions">
              <button ref={viewToggle} type="button" className="presentation-control presentation-control--view" onClick={() => presentationDisplay.setMinimized(true)} aria-label={copy.minimize} title={copy.minimize} aria-controls={playerId} aria-expanded={true}>
                <ChevronDown size={17} aria-hidden="true" />
              </button>
            </div>
          </div>
          <p className={audio.status === 'error' ? 'presentation-error' : 'sr-only'} role="status">
            {audio.status === 'idle' ? 'Présentation prête à être écoutée' : copy[audio.status]}
          </p>
        </section>
      )}
    </div>
  )
}
