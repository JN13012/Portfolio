import { useEffect, useRef, useState } from 'react'
import { aiLabCurriculum } from '../../../content/aiLab'
import { useReducedMotion } from '../../../lib/useReducedMotion'
import { TerminalStartButton } from '../../../components/ui/TerminalStartButton'
import { TerminalTypedText as Typed } from '../../../components/ui/TerminalTypedText'
import { useTerminalTyping } from '../../../lib/useTerminalTyping'

const TITLE = 'Laboratoire IA'
const levelCount = aiLabCurriculum.reduce((count, phase) => count + phase.levels.length, 0)
const SUBTITLE = `Parcours prévu en ${levelCount} niveaux · de l’attaque à la défense`
const pieces = (() => {
  let offset = TITLE.length + SUBTITLE.length
  const phases = aiLabCurriculum.map(phase => {
    const head = offset
    offset += phase.title.length
    const levels = phase.levels.map(level => {
      const from = offset
      offset += level.title.length + 3
      return { ...level, from }
    })
    return { ...phase, head, levels }
  })
  return { phases, total: offset }
})()

export function AiLabIntro({ onEnter }: { onEnter: () => void }) {
  const entry = useRef<HTMLDivElement>(null)
  const screen = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const chars = useTerminalTyping(screen, pieces.total, 'ai-lab-intro-typed', reduced)
  const typing = chars < pieces.total
  const [leaving, setLeaving] = useState(false)
  useEffect(() => {
    const root = screen.current
    if (!root || !leaving) return
    if (reduced) { onEnter(); return }
    const animation = root.animate([
      { transform: 'scale(1, 1)', filter: 'brightness(1)', opacity: 1, offset: 0 },
      { transform: 'scale(1, .012)', filter: 'brightness(2.6)', opacity: 1, offset: .55 },
      { transform: 'scale(0, .012)', filter: 'brightness(3)', opacity: 0, offset: 1 },
    ], { duration: 520, easing: 'ease-in', fill: 'forwards' })
    animation.pause()
    animation.onfinish = onEnter
    let visible = false
    const sync = () => { if (visible && !document.hidden) animation.play(); else animation.pause() }
    const observer = new IntersectionObserver(([item]) => { visible = !!item?.isIntersecting; sync() })
    observer.observe(entry.current ?? root)
    document.addEventListener('visibilitychange', sync)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); animation.onfinish = null; animation.cancel() }
  }, [leaving, reduced, onEnter])
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
  return <div ref={entry} className="lab-terminal ai-lab-entry" data-motion="paused" aria-labelledby="ai-lab-entry-title">
    <div className="ai-lab-entry__chrome">
      <span aria-hidden="true">&gt;_</span> sentry@lab:~
    </div>
    <div ref={screen} className="ai-lab-entry__body" data-leaving={leaving || undefined}>
      <span aria-hidden="true" className="ai-lab-entry__scanlines" />
      <span aria-hidden="true" className="ai-lab-entry__scan"><span /></span>
      <div className="ai-lab-entry__heading">
        <h3 id="ai-lab-entry-title"><Typed text={TITLE} from={0} chars={chars} /></h3>
        <p><Typed text={SUBTITLE} from={TITLE.length} chars={chars} /></p>
      </div>
      <ol className="ai-lab-entry__phases" aria-label="Les neuf niveaux prévus du Lab IA">
        {pieces.phases.map(phase => <li key={phase.title}>
          <p className="ai-lab-entry__phase-title"><span aria-hidden="true" /><span><Typed text={phase.title} from={phase.head} chars={chars} /></span><span aria-hidden="true" /></p>
          <ol className="ai-lab-entry__levels">
            {phase.levels.map(level => <li key={level.id}><span>{String(level.id).padStart(2, '0')}</span><Typed text={level.title} from={level.from} chars={chars} /></li>)}
          </ol>
        </li>)}
      </ol>
      <div className="ai-lab-entry__footer" data-typing={typing || undefined} aria-hidden={typing || undefined}>
        <p className="mb-3 text-[11px] text-zinc-400">Démonstration actuelle : injection directe.</p>
        <span className="ai-lab-entry__button-blink"><span className="ai-lab-entry__button-glitch">
          <TerminalStartButton tone="blue" disabled={typing || leaving} onClick={() => reduced ? onEnter() : setLeaving(true)}>Commencer</TerminalStartButton>
        </span></span>
      </div>
    </div>
  </div>
}
