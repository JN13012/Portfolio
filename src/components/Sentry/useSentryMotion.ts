import { useEffect, type RefObject } from 'react'
import type { SentryState } from './sentryActivity'

/** CSS handles ambient motion; pointer updates request at most one frame, only while hovered. */
export function useSentryMotion(root: RefObject<HTMLSpanElement | null>, animated: boolean, paused: boolean, state: SentryState) {
  useEffect(() => {
    const el = root.current
    if (!el) return
    el.setAttribute('data-motion', 'paused')
    if (!animated || paused) return

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false
    let listening = false
    let frame = 0
    let point = { x: 0, y: 0 }

    const reset = () => {
      cancelAnimationFrame(frame)
      frame = 0
      el.removeAttribute('data-attentive')
      el.style.removeProperty('--sentry-look-x')
      el.style.removeProperty('--sentry-look-y')
    }
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      point = { x: event.clientX, y: event.clientY }
      el.setAttribute('data-attentive', 'true')
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const rect = el.getBoundingClientRect()
        if (!rect.width || !rect.height) return
        const x = Math.max(-1, Math.min(1, (point.x - rect.left) / rect.width * 2 - 1))
        const y = Math.max(-1, Math.min(1, (point.y - rect.top) / rect.height * 2 - 1))
        // SVG px are viewBox units: cap both screen movement and displacement inside the visor.
        el.style.setProperty('--sentry-look-x', `${x * Math.min(28, 2 * 1280 / rect.width)}px`)
        el.style.setProperty('--sentry-look-y', `${y * Math.min(18, 1.3 * 1280 / rect.height)}px`)
      })
    }
    const detachPointer = () => {
      el.removeEventListener('pointerenter', move)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', reset)
      el.removeEventListener('pointercancel', reset)
      window.removeEventListener('resize', reset)
      listening = false
      reset()
    }
    const sync = () => {
      const running = visible && !document.hidden
      el.setAttribute('data-motion', running ? 'running' : 'paused')
      const tracking = running && state === 'idle' && finePointer.matches && !reduced.matches
      if (tracking && !listening) {
        el.addEventListener('pointerenter', move)
        el.addEventListener('pointermove', move)
        el.addEventListener('pointerleave', reset)
        el.addEventListener('pointercancel', reset)
        window.addEventListener('resize', reset)
        listening = true
      } else if (!tracking) detachPointer()
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false
      sync()
    })
    observer.observe(el)
    document.addEventListener('visibilitychange', sync)
    finePointer.addEventListener('change', sync)
    reduced.addEventListener('change', sync)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', sync)
      finePointer.removeEventListener('change', sync)
      reduced.removeEventListener('change', sync)
      detachPointer()
      el.setAttribute('data-motion', 'paused')
    }
  }, [root, animated, paused, state])
}
