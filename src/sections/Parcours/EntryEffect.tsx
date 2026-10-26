import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { EFFECTS, H } from './neonEffects'

/** Scene units → CSS pixels. */
const ZOOM = 1.4

/**
 * Plays the entry's neon effect once along the bottom of the details panel; an effect with an `overlay` gets a canvas
 * over the whole panel, its scene still drawn along the bottom. Mount it with a key that changes on every selection:
 * a new selection (even of the same entry) unmounts it, which stops the effect at once, and plays it again.
 * Nothing under `prefers-reduced-motion`, nor when the panel is off-screen.
 */
export function EntryEffect({ id }: { id: string }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()
  const effect = EFFECTS[id]

  useEffect(() => {
    const cv = canvas.current
    const ctx = cv?.getContext('2d')
    if (!effect || reduced || !cv || !ctx) return
    const box = cv.getBoundingClientRect()
    if (box.bottom < 0 || box.top > innerHeight) return
    const dpr = Math.min(devicePixelRatio || 1, 2)
    cv.width = box.width * dpr
    cv.height = box.height * dpr
    const w = box.width / ZOOM
    const total = effect.duration(w)
    let start: number | undefined
    let raf = 0
    const tick = (now: number) => {
      start ??= now
      const ms = now - start
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, cv.width, cv.height)
      if (ms >= total) return
      ctx.setTransform(dpr * ZOOM, 0, 0, dpr * ZOOM, 0, 0)
      if (effect.overlay) {
        const h = box.height / ZOOM
        ctx.save()
        ctx.translate(0, h - H)
        effect.draw(ctx, w, ms)
        ctx.restore()
        effect.overlay(ctx, w, h, ms)
      } else effect.draw(ctx, w, ms)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [effect, reduced])

  if (!effect) return null
  return effect.overlay ? (
    <canvas ref={canvas} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />
  ) : (
    <canvas ref={canvas} aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 w-full" style={{ height: H * ZOOM }} />
  )
}
