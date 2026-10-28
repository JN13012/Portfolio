import { useEffect, useRef } from 'react'
import { afterLoadIdle } from '../../../src/lib/afterLoad'
import { readToken, withAlpha } from '../../../src/lib/color'
import { useReducedMotion } from '../../../src/lib/useReducedMotion'

const CELL = 28
type Point = [number, number]
type Trace = { points: Point[]; length: number }
type Packet = { trace: Trace; d: number; speed: number }

// 8 directions; orthogonal ones are favoured, as on a real board.
const DIRS: Point[] = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]]

function buildTraces(w: number, h: number, rand: () => number): Trace[] {
  const cols = Math.ceil(w / CELL)
  const rows = Math.ceil(h / CELL)
  const used = new Set<string>()
  const count = Math.round((cols * rows) / 9)
  const traces: Trace[] = []
  for (let n = 0; n < count; n++) {
    let x = Math.floor(rand() * cols)
    let y = Math.floor(rand() * rows)
    if (used.has(`${x},${y}`)) continue
    let dir = Math.floor(rand() * 4) * 2
    const pts: Point[] = [[x, y]]
    const steps = 3 + Math.floor(rand() * 12)
    for (let s = 0; s < steps; s++) {
      if (rand() < 0.22) dir = (dir + (rand() < 0.5 ? 1 : 7)) % 8
      const [dx, dy] = DIRS[dir]!
      const nx = x + dx
      const ny = y + dy
      if (nx < 0 || ny < 0 || nx > cols || ny > rows || used.has(`${nx},${ny}`)) break
      x = nx
      y = ny
      used.add(`${x},${y}`)
      pts.push([x, y])
    }
    if (pts.length < 3) continue
    const points = pts.map(([px, py]): Point => [px * CELL, py * CELL])
    let length = 0
    for (let i = 1; i < points.length; i++) length += Math.hypot(points[i]![0] - points[i - 1]![0], points[i]![1] - points[i - 1]![1])
    traces.push({ points, length })
  }
  return traces
}

function pointAt(trace: Trace, d: number): Point {
  let left = d
  for (let i = 1; i < trace.points.length; i++) {
    const [ax, ay] = trace.points[i - 1]!
    const [bx, by] = trace.points[i]!
    const seg = Math.hypot(bx - ax, by - ay)
    if (left <= seg) return [ax + ((bx - ax) * left) / seg, ay + ((by - ay) * left) / seg]
    left -= seg
  }
  return trace.points[trace.points.length - 1]!
}

/**
 * Site background: a faint printed-circuit board with data packets travelling
 * along the traces. Brighter behind the hero, dimmed behind the content.
 */
type CircuitBackgroundProps = {
  /** Trace colour (defaults to the theme green). */
  color?: string
  /** Packet colour (defaults to `color`). */
  packetColor?: string
  /** Multiplier on trace opacity. */
  intensity?: number
}

export function CircuitBackground({ color, packetColor, intensity = 1 }: CircuitBackgroundProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const green = color ?? readToken('--color-ai', '#4ade80')
    const packet = packetColor ?? green
    let seed = 42
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)

    const board = document.createElement('canvas')
    let traces: Trace[] = []
    let w = 0
    let h = 0
    let dpr = 1
    const packets: Packet[] = []

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = window.innerWidth
      h = window.innerHeight
      for (const c of [canvas, board]) {
        c.width = Math.round(w * dpr)
        c.height = Math.round(h * dpr)
      }
      seed = 42
      traces = buildTraces(w, h, rand)
      const b = board.getContext('2d')!
      b.setTransform(dpr, 0, 0, dpr, 0, 0)
      b.clearRect(0, 0, w, h)
      b.lineWidth = 1.2
      b.lineJoin = 'round'
      for (const t of traces) {
        b.strokeStyle = withAlpha(green, (0.07 + rand() * 0.06) * intensity)
        b.beginPath()
        t.points.forEach(([x, y], i) => (i ? b.lineTo(x, y) : b.moveTo(x, y)))
        b.stroke()
        // Pads at both ends, a via now and then.
        for (const [x, y] of [t.points[0]!, t.points[t.points.length - 1]!]) {
          b.strokeStyle = withAlpha(green, 0.18 * intensity)
          b.beginPath()
          b.arc(x, y, 2.6, 0, Math.PI * 2)
          b.stroke()
        }
        if (rand() < 0.3) {
          const [x, y] = t.points[Math.floor(t.points.length / 2)]!
          b.fillStyle = withAlpha(green, 0.16 * intensity)
          b.fillRect(x - 1.5, y - 1.5, 3, 3)
        }
      }
      packets.length = 0
      draw()
    }

    function draw() {
      ctx!.setTransform(1, 0, 0, 1, 0, 0)
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
      ctx!.drawImage(board, 0, 0)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      for (const p of packets) {
        // Trail: a few samples behind the head, fading out.
        for (let k = 0; k < 8; k++) {
          const [x, y] = pointAt(p.trace, Math.max(0, p.d - k * 5))
          ctx!.fillStyle = withAlpha(packet, 0.55 * intensity * (1 - k / 8))
          ctx!.fillRect(x - 1.2, y - 1.2, 2.4, 2.4)
        }
        const [hx, hy] = pointAt(p.trace, p.d)
        const g = ctx!.createRadialGradient(hx, hy, 0, hx, hy, 9)
        g.addColorStop(0, withAlpha(packet, 0.9 * intensity))
        g.addColorStop(1, withAlpha(packet, 0))
        ctx!.fillStyle = g
        ctx!.fillRect(hx - 9, hy - 9, 18, 18)
      }
    }

    build()
    let resizeTimer = 0
    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(build, 200)
    }
    window.addEventListener('resize', onResize)

    // Dim behind the content: full strength over the hero, ~40 % further down.
    const onScroll = () => {
      const k = Math.min(1, window.scrollY / (window.innerHeight * 0.8))
      canvas.style.opacity = String(1 - k * 0.6)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    let raf = 0
    let last = performance.now()
    const maxPackets = w < 768 ? 5 : 12
    const cancelStart = reduced
      ? () => {}
      : afterLoadIdle(() => {
          last = performance.now()
          const loop = (t: number) => {
            raf = requestAnimationFrame(loop)
            if (t - last < 1000 / 30 - 2 || document.hidden) return
            const dt = Math.min(100, t - last) / 1000
            last = t
            while (packets.length < maxPackets && traces.length) {
              const trace = traces[Math.floor(Math.random() * traces.length)]!
              if (trace.length > CELL * 4) packets.push({ trace, d: 0, speed: 70 + Math.random() * 90 })
            }
            for (let i = packets.length - 1; i >= 0; i--) {
              const p = packets[i]!
              p.d += p.speed * dt
              if (p.d > p.trace.length + 40) packets.splice(i, 1)
            }
            draw()
          }
          raf = requestAnimationFrame(loop)
        })

    return () => {
      cancelStart()
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
      window.clearTimeout(resizeTimer)
    }
  }, [reduced, color, packetColor, intensity])

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-0 size-full transition-opacity duration-300" />
}
