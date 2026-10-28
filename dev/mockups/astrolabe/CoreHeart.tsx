import { useEffect, useRef } from 'react'
import { afterLoadIdle } from '../../../src/lib/afterLoad'
import { withAlpha, readToken } from '../../../src/lib/color'
import { onCore } from '../../../src/lib/coreBus'
import { cx } from '../../../src/lib/cx'

type CoreHeartProps = {
  /** Draw a single still frame (reduced motion). */
  still: boolean
  className?: string
}

const PARTICLES = 420

/** The particle heart behind the iris: a slowly turning, breathing sphere. Canvas 2D. */
export function CoreHeart({ still, className }: CoreHeartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const ai = readToken('--color-ai', '#4ade80')
    const threat = readToken('--color-threat', '#f43f5e')

    // Fibonacci sphere, unit radius.
    const golden = Math.PI * (3 - Math.sqrt(5))
    const points = Array.from({ length: PARTICLES }, (_, i) => {
      const y = 1 - (i / (PARTICLES - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      return { x: Math.cos(golden * i) * r, y, z: Math.sin(golden * i) * r, seed: (i * 7919) % 97 }
    })

    let size = 0
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      size = canvas.clientWidth
      canvas.width = Math.round(size * dpr)
      canvas.height = Math.round(size * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // A still frame must be redrawn whenever the size changes (first layout included).
      if (still) draw(0)
    }
    let flashUntil = 0
    const offAttack = onCore('attack', () => {
      flashUntil = performance.now() + 1100
    })

    const draw = (t: number) => {
      const c = size / 2
      const flash = Math.max(0, (flashUntil - t) / 1100)
      const radius = c * 0.62 * (1 + 0.03 * Math.sin(t / 900) - 0.12 * flash)
      ctx.clearRect(0, 0, size, size)

      const glow = ctx.createRadialGradient(c, c, 0, c, c, c)
      glow.addColorStop(0, withAlpha(ai, 0.55))
      glow.addColorStop(0.45, withAlpha(ai, 0.1))
      glow.addColorStop(1, withAlpha(ai, 0))
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, size, size)

      const rot = t / 9000
      const cos = Math.cos(rot)
      const sin = Math.sin(rot)
      const tilt = 0.45
      for (const p of points) {
        const x = p.x * cos + p.z * sin
        const z0 = -p.x * sin + p.z * cos
        const y = p.y * Math.cos(tilt) - z0 * Math.sin(tilt)
        const z = p.y * Math.sin(tilt) + z0 * Math.cos(tilt)
        const depth = (z + 1) / 2
        const twinkle = 0.85 + 0.15 * Math.sin(t / 400 + p.seed)
        ctx.globalAlpha = (0.12 + 0.8 * depth) * twinkle
        ctx.fillStyle = flash > 0 && p.seed % 2 === 0 ? threat : ai
        // Squares instead of arcs: indistinguishable at this size, far cheaper.
        const r = 1 + depth * 2.2
        ctx.fillRect(c + x * radius - r / 2, c + y * radius - r / 2, r, r)
      }
      ctx.globalAlpha = 1
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)

    let raf = 0
    let visible = true
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true
    })
    io.observe(canvas)

    // First frame now; the loop only once the page has loaded and is idle.
    draw(performance.now())
    const cancelStart = still
      ? () => {}
      : afterLoadIdle(() => {
          const loop = (t: number) => {
            if (visible && !document.hidden) draw(t)
            raf = requestAnimationFrame(loop)
          }
          raf = requestAnimationFrame(loop)
        })

    return () => {
      cancelStart()
      cancelAnimationFrame(raf)
      observer.disconnect()
      io.disconnect()
      offAttack()
    }
  }, [still])

  return <canvas ref={canvasRef} aria-hidden="true" className={cx('block', className)} />
}
