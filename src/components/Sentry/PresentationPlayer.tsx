import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, ChevronUp, LoaderCircle, Pause, Play, RotateCcw } from 'lucide-react'
import { presentationChapters, presentationCopy as copy } from '../../content/presentation'
import { presentationAudio } from '../../lib/presentationAudio'
import { autoFoldDelay, canGoQuiet, presentationDisplay, QUIET_MS } from '../../lib/presentationDisplay'
import { foldPlayer } from '../../lib/presentationFold'
import { sentryWelcome } from '../../lib/sentryWelcome'
import { useDocumentVisible } from '../../lib/useDocumentVisible'
import { usePresentationAudio, usePresentationDisplay } from '../../lib/usePresentationAudio'
import { useReducedMotion } from '../../lib/useReducedMotion'
import './presentation.css'

/** Reduced view: « ▶ Écouter » before playback. false brings back the bare ▶ and chevron tried before. */
const LABELLED_PLAY = true

function timestamp(seconds: number) {
  const safe = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, '0')}`
}

/** Portal escapes the chapter list's scrolling clip; pointer movement does not rerender the player. */
function PresentationChapter({ step, available, current, children }: { step: number; available: boolean; current: boolean; children: ReactNode }) {
  const [hovered, setHovered] = useState(false)
  const [open, setOpen] = useState(false)
  const hint = useRef<HTMLSpanElement>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const position = useCallback((x: number, y: number) => {
    pointer.current = { x, y }
    const element = hint.current
    if (!element) return
    element.style.left = `${Math.max(8, Math.min(x + 12, window.innerWidth - element.offsetWidth - 8))}px`
    element.style.top = `${Math.max(element.offsetHeight + 8, y - 12)}px`
  }, [])
  useLayoutEffect(() => {
    if (open) position(pointer.current.x, pointer.current.y)
  }, [open, position])
  const close = useCallback(() => { setHovered(false); setOpen(false) }, [])
  useEffect(() => {
    if (!hovered) return
    const delay = window.setTimeout(() => setOpen(true), 400)
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') close() }
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    window.addEventListener('blur', close)
    document.addEventListener('visibilitychange', close)
    document.addEventListener('keydown', escape)
    return () => {
      window.clearTimeout(delay)
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
      window.removeEventListener('blur', close)
      document.removeEventListener('visibilitychange', close)
      document.removeEventListener('keydown', escape)
    }
  }, [hovered, close])
  return <li className="presentation-chapter" data-fold={step} data-available={available} data-current={current}
    style={available ? undefined : { cursor: 'not-allowed' }}
    onPointerEnter={available ? undefined : event => {
      if (event.pointerType !== 'mouse') return
      position(event.clientX, event.clientY)
      setHovered(true)
    }}
    onPointerMove={available ? undefined : event => position(event.clientX, event.clientY)}
    onPointerLeave={close} onPointerDown={close}>
    {children}
    {open && createPortal(<span ref={hint} role="tooltip" className="pointer-events-none fixed z-[1100] max-w-[calc(100vw-16px)] -translate-y-full rounded-md border border-white/10 bg-zinc-900 px-2 py-1 text-xs whitespace-nowrap text-zinc-300 shadow-lg">En cours de conception.</span>, document.body)}
  </li>
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
  const welcome = useSyncExternalStore(sentryWelcome.subscribe, sentryWelcome.get, sentryWelcome.get)
  const documentVisible = useDocumentVisible()
  const reduced = useReducedMotion()
  const root = useRef<HTMLDivElement>(null)
  const chapters = useRef<HTMLOListElement>(null)
  const folding = useRef(false)
  const [hovered, setHovered] = useState(false)
  const [keyboard, setKeyboard] = useState(false)
  const [quietDone, setQuietDone] = useState(false)
  const playerId = useId()
  usePlayerLayout(root, inChat)

  const setView = useCallback(async (minimized: boolean) => {
    const element = root.current
    if (!element || folding.current) return
    if (inChat || reduced) { presentationDisplay.setMinimized(minimized); return }
    folding.current = true
    try { await foldPlayer(element, minimized, presentationDisplay.setMinimized) } finally { folding.current = false }
  }, [inChat, reduced])

  // Leaving the Hero folds the strip, playing or not. Keyboard users inside it keep it.
  useEffect(() => {
    const hero = document.getElementById('acceuil')
    if (inChat || !hero) return
    let inside: boolean | undefined
    const observer = new IntersectionObserver(([entry]) => {
      const now = !!entry?.isIntersecting
      const left = !now && (inside === true || (inside === undefined && !presentationDisplay.pinned()))
      inside = now
      if (left && !presentationDisplay.get().minimized && !root.current?.querySelector(':focus-visible') && presentationAudio.get().status !== 'error') void setView(true)
    }, { rootMargin: '-50% 0px -50% 0px' })
    observer.observe(hero)
    return () => observer.disconnect()
  }, [inChat, setView])

  // Idle, paused or finished: no timer while the tab is hidden or the strip is in use.
  const welcomeDone = welcome.phase === 'dismissed'
  const held = hovered || keyboard
  useEffect(() => {
    if (inChat || display.minimized || !documentVisible) return
    const delay = autoFoldDelay({ status: audio.status, pinned: presentationDisplay.pinned(), welcomeDone, held, phone: window.matchMedia('(max-width: 767px)').matches })
    if (delay === null) return
    const timer = window.setTimeout(() => void setView(true), delay)
    return () => window.clearTimeout(timer)
  }, [inChat, display.minimized, documentVisible, audio.status, welcomeDone, held, setView])

  // Reduced and unused: play fades away after a while. Hovering the chevron or keyboard focus brings it back.
  const canQuiet = !inChat && display.minimized && !held && canGoQuiet(audio.status)
  useEffect(() => {
    if (!canQuiet || !documentVisible) return
    const timer = window.setTimeout(() => setQuietDone(true), QUIET_MS)
    return () => { window.clearTimeout(timer); setQuietDone(false) }
  }, [canQuiet, documentVisible, audio.status])

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
  const viewLabel = display.minimized ? copy.expand : copy.minimize
  const playWord = !LABELLED_PLAY ? null : audio.status === 'idle' ? copy.listen : audio.status === 'ended' ? copy.listenAgain : null

  return (
    <div ref={root} id={playerId} className="presentation-dock" data-presentation data-minimized={display.minimized} data-inline={inChat} data-state={audio.status} data-quiet={canQuiet && quietDone}
      onPointerEnter={(event) => { if (event.pointerType === 'mouse') setHovered(true) }}
      onPointerLeave={() => setHovered(false)}
      onFocus={(event) => setKeyboard(event.target.matches(':focus-visible'))}
      onBlur={() => setKeyboard(false)}>
      <section aria-label="Présentation audio du portfolio" className="presentation-strip">
        <div className="presentation-toolbar">
          <div className="presentation-controls">
            <div className="flex items-center">
              <button type="button" className="presentation-control" data-fold={0} onClick={() => presentationAudio.seek(0)} aria-label={`Revenir au début du chapitre ${currentChapter.title}`} disabled={!audio.duration}>
                <RotateCcw size={15} aria-hidden="true" />
              </button>
              <button type="button" className="presentation-control presentation-control--play" onClick={presentationAudio.toggle} aria-label={label}>
                {audio.status === 'loading' ? <LoaderCircle size={16} aria-hidden="true" className="motion-safe:animate-spin" /> : active ? <Pause size={16} aria-hidden="true" /> : audio.status === 'ended' ? <RotateCcw size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
                {playWord && <span className="presentation-listen" data-fold-reveal aria-hidden="true">{playWord}</span>}
              </button>
              {audio.status !== 'idle' && <progress className="presentation-progress" data-fold-reveal aria-label={`Progression du chapitre ${currentChapter.title}`} max={duration} value={Math.min(audio.currentTime, duration)} />}
            </div>
            <span className="presentation-time" data-fold={0}>{timestamp(audio.currentTime)} / {timestamp(Math.ceil(duration))}</span>
          </div>
          <ol ref={chapters} aria-label="Chapitres de la présentation" className="presentation-chapters">
            {presentationChapters.map((chapter, index) => {
              const available = 'src' in chapter
              const current = chapter.id === audio.chapterId
              return (
                <PresentationChapter key={chapter.id} step={index + 1} available={available} current={current}>
                  {current ? (
                    <label className="presentation-track">
                      <span className="sr-only">{`Position dans le chapitre ${chapter.title}`}</span>
                      <input type="range" min={0} max={audio.duration || 1} step={0.1} value={Math.min(audio.currentTime, audio.duration || 1)}
                        disabled={!audio.duration} onChange={(event) => presentationAudio.seek(Number(event.target.value))}
                        aria-valuetext={`${timestamp(audio.currentTime)} sur ${timestamp(Math.ceil(audio.duration))}`}
                        style={{ '--track-progress': `${progress}%` } as CSSProperties} />
                    </label>
                  ) : <span className={`presentation-track ${available ? 'presentation-track--available' : 'presentation-track--locked'}`} style={{ '--track-progress': index < chapterIndex ? '100%' : '0%' } as CSSProperties} aria-hidden="true" />}
                  <button type="button" disabled={!available} style={available ? undefined : { pointerEvents: 'none' }} aria-current={current ? 'step' : undefined}
                    aria-label={`${index + 1}. ${chapter.title}${available ? '' : ` · ${copy.soon}`}`}
                    onClick={() => presentationAudio.selectChapter(chapter.id)}>
                    {chapter.shortTitle}
                  </button>
                </PresentationChapter>
              )
            })}
          </ol>
          <div className="presentation-actions">
            <button type="button" className="presentation-control presentation-control--view" aria-label={viewLabel} title={viewLabel} aria-controls={playerId} aria-expanded={!display.minimized}
              onClick={() => {
                if (!display.minimized) sentryWelcome.dismiss()
                void setView(!display.minimized)
              }}>
              {display.minimized ? <ChevronUp size={17} aria-hidden="true" /> : <ChevronDown size={17} aria-hidden="true" />}
            </button>
          </div>
        </div>
        <p className={audio.status === 'error' && !display.minimized ? 'presentation-error' : 'sr-only'} role="status">
          {audio.status === 'idle' ? 'Présentation prête à être écoutée' : copy[audio.status]}
        </p>
      </section>
    </div>
  )
}
