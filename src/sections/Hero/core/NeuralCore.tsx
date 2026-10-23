import { useEffect, useMemo, useRef, useState } from 'react'
import { afterLoadIdle } from '../../../lib/afterLoad'
import { readToken, withAlpha } from '../../../lib/color'
import { onCore } from '../../../lib/coreBus'
import { cx } from '../../../lib/cx'
import { useReducedMotion } from '../../../lib/useReducedMotion'
import { defaultNeuralNodes, type NeuralNavNode } from './navNodes'

// Layer sizes, left to right. The last layer is the navigation; layer index GUARD is the guardrail layer.
const LAYERS = [4, 7, 7, 5]
const GUARD = 2
const W = 1000
const H = 1000
/** x of each layer (viewBox units): the output layer leaves room for its labels on the right. */
const LAYER_X = [70, 300, 520, 720]
const MAX_PULSES = 40

type Neuron = { x: number; y: number; layer: number; index: number }
type Edge = { from: Neuron; to: Neuron; weight: number }
type Pulse = { edge: Edge; t: number; speed: number; threat: boolean }

function buildNetwork() {
  const neurons: Neuron[][] = LAYERS.map((count, layer) => {
    const x = LAYER_X[layer]!
    const span = layer === LAYERS.length - 1 ? 780 : 640
    return Array.from({ length: count }, (_, index) => ({
      x,
      y: H / 2 - span / 2 + (count === 1 ? span / 2 : (index * span) / (count - 1)),
      layer,
      index,
    }))
  })
  let seed = 17
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  const edges: Edge[] = []
  for (let l = 0; l < neurons.length - 1; l++)
    for (const a of neurons[l]!) for (const b of neurons[l + 1]!) edges.push({ from: a, to: b, weight: 0.25 + rand() * 0.75 })
  return { neurons, edges }
}

type NeuralCoreProps = {
  nodes?: NeuralNavNode[]
  className?: string
}

/**
 * Hero visual: a small neural network. Signals flow left to right; the output
 * neurons are the site navigation. Attacks (red) are stopped at the guardrail layer.
 */
export function NeuralCore({ nodes = defaultNeuralNodes, className }: NeuralCoreProps) {
  const reduced = useReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [active, setActive] = useState<number | null>(null)
  const activeRef = useRef<number | null>(null)
  const net = useMemo(() => buildNetwork(), [])
  const outputs = net.neurons[net.neurons.length - 1]!

  useEffect(() => {
    activeRef.current = active
  }, [active])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const ai = readToken('--color-ai', '#4ade80')
    const threat = readToken('--color-threat', '#f43f5e')

    let size = 0
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      size = canvas.clientWidth
      canvas.width = canvas.height = Math.round(size * dpr)
      ctx.setTransform((dpr * size) / W, 0, 0, (dpr * size) / H, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(() => {
      resize()
      draw(performance.now())
    })
    ro.observe(canvas)

    const pulses: Pulse[] = []
    const glow = new Map<Neuron, number>()
    let guardHit = 0
    let nextWave = 0

    // Each signal follows a single path, picking the next edge in proportion to its weight.
    const fire = (from: Neuron, threatPulse = false) => {
      if (pulses.length >= MAX_PULSES) return
      const out = net.edges.filter((e) => e.from === from)
      let r = Math.random() * out.reduce((sum, e) => sum + e.weight, 0)
      const edge = out.find((e) => (r -= e.weight) <= 0) ?? out[0]
      if (edge) pulses.push({ edge, t: 0, speed: threatPulse ? 0.8 : 0.9 + Math.random() * 0.5, threat: threatPulse })
    }

    const offAttack = onCore('attack', () => {
      const entry = net.neurons[0]![Math.floor(Math.random() * LAYERS[0]!)]!
      fire(entry, true)
    })

    function draw(now: number) {
      ctx!.clearRect(0, 0, W, H)
      const highlight = activeRef.current
      // Edges
      for (const e of net.edges) {
        const toActive = highlight !== null && e.to.layer === LAYERS.length - 1 && e.to.index === highlight
        ctx!.strokeStyle = withAlpha(ai, toActive ? 0.6 : 0.1 + e.weight * 0.16)
        ctx!.lineWidth = toActive ? 2 : 1
        ctx!.beginPath()
        ctx!.moveTo(e.from.x, e.from.y)
        ctx!.lineTo(e.to.x, e.to.y)
        ctx!.stroke()
      }
      // Guard layer band
      const gx = net.neurons[GUARD]![0]!.x
      const hit = Math.max(0, 1 - (now - guardHit) / 900)
      ctx!.strokeStyle = withAlpha(hit > 0 ? threat : ai, 0.12 + hit * 0.6)
      ctx!.setLineDash([6, 10])
      ctx!.lineWidth = 2 + hit * 3
      ctx!.beginPath()
      ctx!.moveTo(gx, 120)
      ctx!.lineTo(gx, H - 120)
      ctx!.stroke()
      ctx!.setLineDash([])
      // Pulses
      for (const p of pulses) {
        const x = p.edge.from.x + (p.edge.to.x - p.edge.from.x) * p.t
        const y = p.edge.from.y + (p.edge.to.y - p.edge.from.y) * p.t
        const c = p.threat ? threat : ai
        const g = ctx!.createRadialGradient(x, y, 0, x, y, p.threat ? 22 : 14)
        g.addColorStop(0, withAlpha(c, 0.9))
        g.addColorStop(1, withAlpha(c, 0))
        ctx!.fillStyle = g
        ctx!.fillRect(x - 22, y - 22, 44, 44)
      }
      // Neurons (outputs are drawn as HTML buttons)
      for (const layer of net.neurons.slice(0, -1))
        for (const n of layer) {
          const lit = glow.get(n) ?? 0
          const isGuard = n.layer === GUARD
          const c = isGuard && hit > 0 ? threat : ai
          ctx!.fillStyle = withAlpha(c, 0.12 + lit * 0.5)
          ctx!.strokeStyle = withAlpha(c, 0.5 + lit * 0.5)
          ctx!.lineWidth = isGuard ? 3 : 2
          ctx!.beginPath()
          ctx!.arc(n.x, n.y, isGuard ? 15 : 12, 0, Math.PI * 2)
          ctx!.fill()
          ctx!.stroke()
        }
    }

    const step = (now: number, dt: number) => {
      if (now > nextWave) {
        const inputs = net.neurons[0]!
        fire(inputs[Math.floor(Math.random() * inputs.length)]!)
        nextWave = now + 350 + Math.random() * 450
      }
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i]!
        p.t += (p.speed * dt) / 1000
        if (p.threat && p.edge.to.layer === GUARD && p.t >= 1) {
          guardHit = now
          glow.set(p.edge.to, 1)
          pulses.splice(i, 1)
          continue
        }
        if (p.t >= 1) {
          glow.set(p.edge.to, 1)
          pulses.splice(i, 1)
          if (p.edge.to.layer < LAYERS.length - 1) fire(p.edge.to, p.threat)
        }
      }
      for (const [n, v] of glow) glow.set(n, Math.max(0, v - dt / 600))
    }

    let raf = 0
    let last = performance.now()
    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e?.isIntersecting ?? true))
    io.observe(canvas)
    draw(last)
    const cancelStart = reduced
      ? () => {}
      : afterLoadIdle(() => {
          last = performance.now()
          const loop = (t: number) => {
            raf = requestAnimationFrame(loop)
            const dt = Math.min(64, t - last)
            last = t
            if (visible && !document.hidden) {
              step(t, dt)
              draw(t)
            }
          }
          raf = requestAnimationFrame(loop)
        })

    return () => {
      cancelStart()
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      offAttack()
    }
  }, [net, reduced])

  return (
    <div data-core className={cx('relative aspect-square select-none', className)}>
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 size-full" />
      <nav aria-label="Navigation du site">
        <ul>
          {nodes.map((node, i) => {
            const n = outputs[i]
            if (!n) return null
            const Icon = node.icon
            const isActive = active === i
            return (
              <li key={node.id} className="absolute -translate-y-1/2" style={{ left: `${(n.x / W) * 100}%`, top: `${(n.y / H) * 100}%` }}>
                <a
                  href={node.target}
                  aria-label={`${node.label} : ${node.hint}`}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  className="group -ml-6 flex items-center gap-3 rounded-sm focus-visible:outline-none"
                >
                  <span
                    className={cx(
                      'grid size-12 place-items-center rounded-full border bg-black/80 text-cyber transition-[border-color,box-shadow] duration-(--duration-base) group-focus-visible:shadow-focus',
                      isActive ? 'border-cyber shadow-[0_0_24px_-2px_var(--color-cyber)]' : 'border-cyber/40',
                    )}
                  >
                    <Icon aria-hidden="true" size={20} strokeWidth={1.6} />
                  </span>
                  <span className="hidden sm:block">
                    <span className="block text-sm tracking-[0.15em] text-zinc-100 uppercase">{node.label}</span>
                    <span className={cx('block text-xs text-zinc-400 transition-opacity', isActive ? 'opacity-100' : 'opacity-0')}>
                      {node.hint}
                    </span>
                  </span>
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
