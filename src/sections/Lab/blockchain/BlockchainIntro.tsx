import { useEffect, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import { blockchainLab as copy } from '../../../content/lab/blockchain'
import { useReducedMotion } from '../../../lib/useReducedMotion'
import { TerminalStartButton } from '../../../components/ui/TerminalStartButton'
import { TerminalTypedText as Typed } from '../../../components/ui/TerminalTypedText'
import { useTerminalTyping } from '../../../lib/useTerminalTyping'

// Same entry screen as the AI CTF (grid, scanlines, typed text, CRT switch-off), in violet.
const TITLE = copy.title
const summaryOf = (level: { summary: string }) => ` : ${level.summary}`
const pieces = (() => {
  let offset = TITLE.length
  const head = offset
  offset += copy.phase.length
  const levels = copy.levels.map(level => {
    const from = offset
    offset += level.title.length + summaryOf(level).length + 3
    return { ...level, from }
  })
  return { head, levels, total: offset }
})()

export function BlockchainIntro({ onEnter, completed }: { onEnter: (level?: number) => void; completed: readonly number[] }) {
  const entry = useRef<HTMLDivElement>(null)
  const screen = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const chars = useTerminalTyping(screen, pieces.total, 'blockchain-lab-intro-typed', reduced)
  const typing = chars < pieces.total
  const [leaving, setLeaving] = useState(false)
  // The level picked on this screen, if any; « Commencer » leaves the choice to the lab.
  const chosen = useRef<number | undefined>(undefined)
  const go = (level?: number) => {
    if (typing || leaving) return
    chosen.current = level
    if (reduced) onEnter(level)
    else setLeaving(true)
  }
  useEffect(() => {
    const root = screen.current
    if (!root || !leaving) return
    const animation = root.animate([
      { transform: 'scale(1, 1)', filter: 'brightness(1)', opacity: 1, offset: 0 },
      { transform: 'scale(1, .012)', filter: 'brightness(2.6)', opacity: 1, offset: .55 },
      { transform: 'scale(0, .012)', filter: 'brightness(3)', opacity: 0, offset: 1 },
    ], { duration: 520, easing: 'ease-in', fill: 'forwards' })
    animation.onfinish = () => onEnter(chosen.current)
    return () => { animation.onfinish = null; animation.cancel() }
  }, [leaving, onEnter])
  useEffect(() => {
    const root = entry.current
    if (!root) return
    let visible = false
    const sync = () => { root.dataset.motion = visible && !document.hidden && !reduced ? 'running' : 'paused' }
    const observer = new IntersectionObserver(([item]) => { visible = !!item?.isIntersecting; sync() })
    observer.observe(root)
    document.addEventListener('visibilitychange', sync)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); root.dataset.motion = 'paused' }
  }, [reduced])
  return <div ref={entry} className="lab-terminal ai-lab-entry blockchain-entry" data-motion="paused" aria-labelledby="blockchain-entry-title">
    <div className="ai-lab-entry__chrome">
      <span aria-hidden="true">&gt;_</span> chain@lab:~
    </div>
    <div ref={screen} className="ai-lab-entry__body" data-leaving={leaving || undefined}>
      <span aria-hidden="true" className="ai-lab-entry__scanlines" />
      <span aria-hidden="true" className="ai-lab-entry__scan"><span /></span>
      <div className="ai-lab-entry__heading">
        <h3 id="blockchain-entry-title" data-lab-intro-heading tabIndex={-1} className="outline-none"><Typed text={TITLE} from={0} chars={chars} /></h3>
      </div>
      <ol className="ai-lab-entry__phases" aria-label="Les niveaux du CTF Blockchain">
        <li>
          <p className="ai-lab-entry__phase-title"><span aria-hidden="true" /><span><Typed text={copy.phase} from={pieces.head} chars={chars} /></span><span aria-hidden="true" /></p>
          <ol className="ai-lab-entry__levels">
            {pieces.levels.map(level => <li key={level.id}><button type="button" className="lab-intro-level" disabled={!level.available || typing || leaving}
              aria-label={`Ouvrir le niveau ${level.id} : ${level.title}${summaryOf(level)}${!level.available ? ` — ${copy.soon}` : completed.includes(level.id) ? ` — ${copy.done}` : ''}`} onClick={() => go(level.id)}>
              <span className="ai-lab-entry__level-number">{String(level.id).padStart(2, '0')}</span><span className="lab-intro-level__title"><Typed text={level.title} from={level.from} chars={chars} /></span>
              <span className="text-zinc-400"><Typed text={summaryOf(level)} from={level.from + level.title.length} chars={chars} /></span>
              {!level.available && <span className="ml-2 text-[10px] text-zinc-500">{copy.soon}</span>}
              {completed.includes(level.id) && <Check size={13} aria-label={copy.done} className="ml-2 inline text-violet-300" />}
            </button></li>)}
          </ol>
        </li>
      </ol>
      <div className="ai-lab-entry__footer" data-typing={typing || undefined} aria-hidden={typing || undefined}>
        <span className="ai-lab-entry__button-blink"><span className="ai-lab-entry__button-glitch">
          <TerminalStartButton tone="violet" disabled={typing || leaving} onClick={() => go()}>{copy.start}</TerminalStartButton>
        </span></span>
      </div>
    </div>
  </div>
}
