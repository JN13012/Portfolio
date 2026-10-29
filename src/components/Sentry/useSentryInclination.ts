import { useEffect, type RefObject } from 'react'
import { ATTENTION_DURATION_MS, type WelcomeCue } from '../../lib/sentryWelcome'

/** A finite shell gesture. Face changes never touch this animation or its completion. */
export function useSentryInclination(
  root: RefObject<HTMLSpanElement | null>, animated: boolean, paused: boolean,
  cue: WelcomeCue, onFinished?: (cue: WelcomeCue) => void,
) {
  useEffect(() => {
    const el = root.current
    if (!el || !cue || !animated || paused) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false
    let finished = false
    let animation: Animation | undefined
    const complete = () => {
      if (finished) return
      finished = true
      animation?.cancel()
      onFinished?.(cue)
    }
    const sync = () => {
      if (finished) return
      if (!visible || document.hidden) { animation?.pause(); return }
      if (reduced.matches) { complete(); return }
      if (!animation) {
        animation = el.animate([
          { transform: 'rotate(0deg)', offset: 0 },
          { transform: 'rotate(3deg)', offset: .2 },
          { transform: 'rotate(-3deg)', offset: .48 },
          { transform: 'rotate(1.5deg)', offset: .76 },
          { transform: 'rotate(0deg)', offset: 1 },
        ], { duration: ATTENTION_DURATION_MS, easing: 'ease-in-out', iterations: 1 })
        animation.addEventListener('finish', complete)
      } else if (animation.playState === 'paused') animation.play()
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false
      sync()
    })
    observer.observe(el)
    document.addEventListener('visibilitychange', sync)
    reduced.addEventListener('change', sync)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', sync)
      reduced.removeEventListener('change', sync)
      animation?.removeEventListener('finish', complete)
      animation?.cancel()
    }
  }, [root, animated, paused, cue, onFinished])
}
