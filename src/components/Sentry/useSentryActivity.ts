import { useEffect, useState } from 'react'
import { runState, type Run } from '../../lib/brain'
import { onCore } from '../../lib/coreBus'
import { useDocumentVisible } from '../../lib/useDocumentVisible'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { GUARD_REACTION_MS, sentryState, type SentryState } from './sentryActivity'
import { presentationPhase } from '../../lib/presentationAudio'
import { usePresentationPhase } from '../../lib/usePresentationAudio'

/** A prepared answer's clock runs only while visible and stops completely once done. */
export function useSentryActivity(run: Run | null, typing: boolean, enabled: boolean, activity?: SentryState) {
  const [now, setNow] = useState(0)
  const [blockedUntil, setBlockedUntil] = useState(0)
  const visible = useDocumentVisible()
  const still = useReducedMotion()
  const presentation = usePresentationPhase()

  useEffect(() => {
    if (!run || still || !visible || !enabled) return
    let timer: ReturnType<typeof setTimeout>
    const tick = () => {
      const t = performance.now()
      setNow(t)
      if (runState(run, t).phase !== 'done') timer = setTimeout(tick, 80)
    }
    timer = setTimeout(tick, 0)
    return () => clearTimeout(timer)
  }, [run, still, visible, enabled])

  useEffect(() => onCore('guardBlockedDemo', () => {
    // The Hero's visual demo is not a security verdict about a visitor's question.
    if (enabled && !document.hidden && presentationPhase() === 'idle') setBlockedUntil(performance.now() + GUARD_REACTION_MS)
  }), [enabled])

  useEffect(() => {
    if (!blockedUntil) return
    // One expiry timeout, also clearing a reaction that finishes while the tab is hidden.
    const timer = setTimeout(() => setBlockedUntil(0), Math.max(0, blockedUntil - performance.now()))
    return () => clearTimeout(timer)
  }, [blockedUntil])

  const state = run ? runState(run, still ? Infinity : Math.max(now, run.startedAt)) : null
  return {
    state,
    busy: !!state && state.phase !== 'done',
    face: sentryState({ activity: presentation === 'playing' ? 'speaking' : activity, phase: state?.phase, typing, blocked: enabled && blockedUntil > 0 && presentation === 'idle' }),
  }
}
