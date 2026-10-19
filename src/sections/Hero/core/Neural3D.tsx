// 3D neural network for the hero (three.js, lazy-loaded). Read as a diagram:
// named inputs → model (two hidden layers) → guardrail layer → outputs = site navigation.
// Requests (green) reach an output; named attacks (red) are stopped at the guardrails.
import { useEffect, useRef, useState } from 'react'
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DoubleSide,
  Group,
  LineBasicMaterial,
  LineLoop,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  PointsMaterial,
  RingGeometry,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three'
import { onCore } from '../../../lib/coreBus'
import { readToken } from '../../../lib/color'
import { cx } from '../../../lib/cx'
import type { NeuralNavNode } from './navNodes'

const INPUTS = ['prompt', 'logs', 'code', 'CVE']
const ATTACKS = ['prompt injection', 'jailbreak', 'exfiltration']
const GUARD_X = 1.45

type Node = { pos: Vector3; layer: number; index: number }

function buildLayers(outputs: number) {
  const grid = (x: number, rows: number[], cols: number[]) =>
    rows.flatMap((y) => cols.map((z) => new Vector3(x, y, z)))
  const layers: Vector3[][] = [
    INPUTS.map((_, i) => new Vector3(-3, 1.5 - i, 0)),
    grid(-1.45, [0.9, 0, -0.9], [-0.9, 0, 0.9]),
    grid(0.05, [0.9, 0, -0.9], [-0.9, 0, 0.9]),
    grid(GUARD_X, [0.9, 0, -0.9], [-0.45, 0.45]),
    Array.from({ length: outputs }, (_, i) => new Vector3(2.95, 2 - (4 * i) / Math.max(1, outputs - 1), 0)),
  ]
  return layers.map((l, layer) => l.map((pos, index): Node => ({ pos, layer, index })))
}

const GUARD = 3
const OUT = 4

function dotTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')!
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grd.addColorStop(0, 'rgba(255,255,255,1)')
  grd.addColorStop(0.35, 'rgba(255,255,255,0.8)')
  grd.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grd
  g.fillRect(0, 0, 64, 64)
  return new CanvasTexture(c)
}

type Pulse = { path: Node[]; seg: number; t: number; threat: boolean; attack?: string }

type Neural3DProps = {
  nodes: NeuralNavNode[]
  onReady?: () => void
}

export default function Neural3D({ nodes, onReady }: Neural3DProps) {
  const wrap = useRef<HTMLDivElement>(null)
  const inputLabels = useRef<Array<HTMLSpanElement | null>>([])
  const captions = useRef<Array<HTMLSpanElement | null>>([])
  const navItems = useRef<Array<HTMLLIElement | null>>([])
  const counter = useRef<HTMLParagraphElement>(null)
  const activeRef = useRef<number | null>(null)
  const [active, setActive] = useState<number | null>(null)
  const [alert, setAlert] = useState<{ input: number; name: string } | null>(null)
  const onReadyRef = useRef(onReady)

  useEffect(() => {
    onReadyRef.current = onReady
  }, [onReady])

  useEffect(() => {
    activeRef.current = active
  }, [active])

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const ai = new Color(readToken('--color-ai', '#4ade80'))
    const threat = new Color(readToken('--color-threat', '#f43f5e'))

    const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    renderer.domElement.setAttribute('aria-hidden', 'true')
    renderer.domElement.className = 'absolute inset-0 size-full'
    el.prepend(renderer.domElement)

    const scene = new Scene()
    const camera = new PerspectiveCamera(34, 1, 0.1, 50)
    camera.position.set(0, 0, 12.5)
    const root = new Group()
    scene.add(root)

    const layers = buildLayers(nodes.length)
    const all = layers.flat()
    const tex = dotTexture()

    // Edges, with per-vertex colours (weight → brightness).
    const edges: Array<{ a: Node; b: Node; w: number }> = []
    for (let l = 0; l < layers.length - 1; l++)
      for (const a of layers[l]!)
        for (const b of layers[l + 1]!) {
          // Sparse, like a trained network: keep strong links only (all links into the outputs stay).
          const w = Math.random()
          if (w > 0.45 || l === layers.length - 2) edges.push({ a, b, w })
        }
    const edgePos = new Float32Array(edges.length * 6)
    const edgeCol = new Float32Array(edges.length * 6)
    edges.forEach((e, i) => {
      edgePos.set([e.a.pos.x, e.a.pos.y, e.a.pos.z, e.b.pos.x, e.b.pos.y, e.b.pos.z], i * 6)
    })
    const edgeGeo = new BufferGeometry()
    edgeGeo.setAttribute('position', new BufferAttribute(edgePos, 3))
    edgeGeo.setAttribute('color', new BufferAttribute(edgeCol, 3))
    const edgeLines = new LineSegments(
      edgeGeo,
      new LineBasicMaterial({ vertexColors: true, transparent: true, blending: AdditiveBlending, depthWrite: false }),
    )
    root.add(edgeLines)
    const paintEdges = () => {
      const hi = activeRef.current
      edges.forEach((e, i) => {
        const lit = hi !== null && e.b.layer === OUT && e.b.index === hi
        const k = lit ? 0.9 : 0.03 + e.w * 0.1
        for (let v = 0; v < 2; v++) edgeCol.set([ai.r * k, ai.g * k, ai.b * k], i * 6 + v * 3)
      })
      edgeGeo.attributes.color!.needsUpdate = true
    }

    // Neurons.
    const glow = new Float32Array(all.length)
    const nodePos = new Float32Array(all.flatMap((n) => [n.pos.x, n.pos.y, n.pos.z]))
    const nodeCol = new Float32Array(all.length * 3)
    const nodeGeo = new BufferGeometry()
    nodeGeo.setAttribute('position', new BufferAttribute(nodePos, 3))
    nodeGeo.setAttribute('color', new BufferAttribute(nodeCol, 3))
    root.add(
      new Points(
        nodeGeo,
        new PointsMaterial({ size: 0.42, map: tex, vertexColors: true, transparent: true, blending: AdditiveBlending, depthWrite: false }),
      ),
    )

    // Guardrail layer: translucent barrier + frame.
    const guardFrameGeo = new BufferGeometry().setFromPoints([
      new Vector3(GUARD_X, 1.4, -0.85),
      new Vector3(GUARD_X, 1.4, 0.85),
      new Vector3(GUARD_X, -1.4, 0.85),
      new Vector3(GUARD_X, -1.4, -0.85),
    ])
    const guardFrameMat = new LineBasicMaterial({ color: ai, transparent: true, opacity: 0.5 })
    root.add(new LineLoop(guardFrameGeo, guardFrameMat))
    const barrierMat = new MeshBasicMaterial({ color: ai, transparent: true, opacity: 0.05, side: DoubleSide, depthWrite: false })
    const barrier = new Mesh(new PlaneGeometry(1.7, 2.8), barrierMat)
    barrier.position.set(GUARD_X, 0, 0)
    barrier.rotation.y = Math.PI / 2
    root.add(barrier)

    // Impact ripples on the barrier.
    const ripples: Array<{ mesh: Mesh; born: number }> = []
    const rippleGeo = new RingGeometry(0.12, 0.17, 40)

    // Pulses.
    const MAX = 60
    const pulsePos = new Float32Array(MAX * 3)
    const pulseCol = new Float32Array(MAX * 3)
    const pulseGeo = new BufferGeometry()
    pulseGeo.setAttribute('position', new BufferAttribute(pulsePos, 3))
    pulseGeo.setAttribute('color', new BufferAttribute(pulseCol, 3))
    root.add(
      new Points(
        pulseGeo,
        new PointsMaterial({ size: 0.34, map: tex, vertexColors: true, transparent: true, blending: AdditiveBlending, depthWrite: false }),
      ),
    )
    const pulses: Pulse[] = []
    let requests = 0
    let blocked = 0
    const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)]!
    const spawn = (threatPulse: boolean, attack?: string) => {
      if (pulses.length >= MAX) return
      const input = pick(layers[0]!)
      const path = [input, pick(layers[1]!), pick(layers[2]!), pick(layers[GUARD]!)]
      if (!threatPulse) path.push(pick(layers[OUT]!))
      pulses.push({ path, seg: 0, t: 0, threat: threatPulse, attack })
      if (threatPulse && attack) setAlert({ input: input.index, name: attack })
    }
    let attackIndex = 0
    const launchAttack = () => spawn(true, ATTACKS[attackIndex++ % ATTACKS.length])
    const offAttack = onCore('attack', launchAttack)

    let guardHit = -1e9
    const updateCounter = () => {
      if (counter.current) counter.current.textContent = `requêtes ${requests} · bloquées ${blocked}`
    }
    updateCounter()

    // Pointer parallax.
    const pointer = { x: 0, y: 0 }
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1
      pointer.y = ((e.clientY - r.top) / r.height) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    const resize = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    const project = (v: Vector3) => {
      const p = v.clone().applyMatrix4(root.matrixWorld).project(camera)
      return [((p.x + 1) / 2) * el.clientWidth, ((1 - p.y) / 2) * el.clientHeight] as const
    }
    const place = (node: HTMLElement | null, v: Vector3) => {
      if (!node) return
      const [x, y] = project(v)
      node.style.transform = `translate(${x}px, ${y}px)`
    }
    const captionAnchors = [
      new Vector3(-3, -2.7, 0),
      new Vector3(-0.7, -2.7, 0),
      new Vector3(GUARD_X, -2.7, 0),
      new Vector3(2.95, -2.7, 0),
    ]

    let nextRequest = 0
    let nextAttack = performance.now() + 3500
    let last = performance.now()
    let raf = 0
    let visible = true
    let first = true
    const io = new IntersectionObserver(([e]) => (visible = e?.isIntersecting ?? true))
    io.observe(el)

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (!visible || document.hidden) {
        last = now
        return
      }
      const dt = Math.min(64, now - last) / 1000
      last = now

      if (now > nextRequest) {
        spawn(false)
        nextRequest = now + 260 + Math.random() * 380
      }
      if (now > nextAttack) {
        launchAttack()
        nextAttack = now + 7000 + Math.random() * 5000
      }

      // Advance pulses.
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i]!
        p.t += dt * (p.threat ? 1.15 : 1.6)
        if (p.t < 1) continue
        p.t = 0
        p.seg++
        const reached = p.path[p.seg]!
        glow[all.indexOf(reached)] = 1
        if (p.seg === p.path.length - 1) {
          pulses.splice(i, 1)
          if (p.threat) {
            blocked++
            guardHit = now
            const ring = new Mesh(rippleGeo, new MeshBasicMaterial({ color: threat, transparent: true, side: DoubleSide, depthWrite: false }))
            ring.position.copy(reached.pos)
            ring.rotation.y = Math.PI / 2
            root.add(ring)
            ripples.push({ mesh: ring, born: now })
            window.setTimeout(() => setAlert(null), 900)
          } else requests++
          updateCounter()
        }
      }

      // Write pulse buffers.
      pulses.forEach((p, i) => {
        const a = p.path[p.seg]!.pos
        const b = p.path[p.seg + 1]!.pos
        pulsePos.set([a.x + (b.x - a.x) * p.t, a.y + (b.y - a.y) * p.t, a.z + (b.z - a.z) * p.t], i * 3)
        const c = p.threat ? threat : ai
        const k = p.threat ? 1.4 : 1
        pulseCol.set([c.r * k, c.g * k, c.b * k], i * 3)
      })
      pulseGeo.setDrawRange(0, pulses.length)
      pulseGeo.attributes.position!.needsUpdate = true
      pulseGeo.attributes.color!.needsUpdate = true

      // Neurons: base + activation glow; guard layer turns red on impact.
      const hit = Math.max(0, 1 - (now - guardHit) / 900)
      all.forEach((n, i) => {
        glow[i] = Math.max(0, glow[i]! - dt * 1.8)
        const base = n.layer === GUARD && hit > 0 ? threat : ai
        const k = 0.35 + glow[i]! * 0.9 + (n.layer === GUARD ? hit * 0.8 : 0)
        nodeCol.set([base.r * k, base.g * k, base.b * k], i * 3)
      })
      nodeGeo.attributes.color!.needsUpdate = true
      guardFrameMat.color.copy(ai).lerp(threat, hit)
      guardFrameMat.opacity = 0.45 + hit * 0.5
      barrierMat.color.copy(ai).lerp(threat, hit)
      barrierMat.opacity = 0.05 + hit * 0.18

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i]!
        const age = (now - r.born) / 800
        if (age >= 1) {
          root.remove(r.mesh)
          ;(r.mesh.material as MeshBasicMaterial).dispose()
          ripples.splice(i, 1)
          continue
        }
        r.mesh.scale.setScalar(1 + age * 5)
        ;(r.mesh.material as MeshBasicMaterial).opacity = 1 - age
      }

      paintEdges()

      // Gentle sway + parallax.
      const t = now / 1000
      root.rotation.y += (Math.sin(t * 0.18) * 0.38 + pointer.x * 0.22 - root.rotation.y) * 0.05
      root.rotation.x += (pointer.y * 0.12 - root.rotation.x) * 0.05
      root.updateMatrixWorld()

      renderer.render(scene, camera)

      layers[0]!.forEach((n, i) => place(inputLabels.current[i]!, n.pos))
      layers[OUT]!.forEach((n, i) => place(navItems.current[i]!, n.pos))
      // Layer names follow the layers horizontally but stay on one line.
      captionAnchors.forEach((v, i) => {
        const node = captions.current[i]
        if (node) node.style.transform = `translate(${project(v)[0]}px, ${el.clientHeight * 0.86}px)`
      })

      if (first) {
        first = false
        onReadyRef.current?.()
      }
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      offAttack()
      window.removeEventListener('pointermove', onMove)
      renderer.dispose()
      tex.dispose()
      edgeGeo.dispose()
      nodeGeo.dispose()
      pulseGeo.dispose()
      rippleGeo.dispose()
      guardFrameGeo.dispose()
      renderer.domElement.remove()
    }
  }, [nodes])

  const captionText = ['Entrées', 'Modèle', 'Garde-fous', 'Navigation']

  return (
    <div ref={wrap} data-core className="absolute inset-0">
      {/* Overlays positioned each frame from the 3D scene (translate from the top-left corner). */}
      <div aria-hidden="true">
        {INPUTS.map((name, i) => (
          <span
            key={name}
            ref={(e) => {
              inputLabels.current[i] = e
            }}
            className="pointer-events-none absolute top-0 left-0 -mt-3 -ml-2 whitespace-nowrap"
          >
            <span
              className={cx(
                'block -translate-x-full pr-3 font-mono text-xs tracking-wider transition-colors',
                alert?.input === i ? 'text-[var(--color-threat)]' : 'text-zinc-400',
              )}
            >
              {alert?.input === i ? `⚠ ${alert.name}` : name}
            </span>
          </span>
        ))}
        {captionText.map((c, i) => (
          <span
            key={c}
            ref={(e) => {
              captions.current[i] = e
            }}
            className="pointer-events-none absolute top-0 left-0"
          >
            <span
              className={cx(
                'block -translate-x-1/2 font-mono text-[10px] tracking-[0.25em] uppercase',
                i === 2 ? 'text-cyber' : 'text-zinc-500',
              )}
            >
              {c}
            </span>
          </span>
        ))}
      </div>

      <nav aria-label="Navigation du site">
        <ul>
          {nodes.map((node, i) => {
            const Icon = node.icon
            const isActive = active === i
            return (
              <li
                key={node.id}
                ref={(e) => {
                  navItems.current[i] = e
                }}
                className="absolute top-0 left-0"
              >
                <a
                  href={node.target}
                  aria-label={`${node.label} : ${node.hint}`}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  className="group -mt-5 -ml-5 flex items-center gap-3 rounded-sm focus-visible:outline-none"
                >
                  <span
                    className={cx(
                      'grid size-10 place-items-center rounded-full border bg-black/85 text-cyber transition-[border-color,box-shadow] duration-(--duration-base) group-focus-visible:shadow-focus',
                      isActive ? 'border-cyber shadow-[0_0_24px_-2px_var(--color-cyber)]' : 'border-cyber/50',
                    )}
                  >
                    <Icon aria-hidden="true" size={18} strokeWidth={1.6} />
                  </span>
                  <span className="font-mono">
                    <span className="block text-xs tracking-[0.15em] whitespace-nowrap text-zinc-100 uppercase">{node.label}</span>
                    <span className={cx('block text-[11px] whitespace-nowrap text-zinc-400 transition-opacity', isActive ? 'opacity-100' : 'opacity-0')}>
                      {node.hint}
                    </span>
                  </span>
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      <p ref={counter} aria-hidden="true" className="absolute top-0 right-0 font-mono text-[11px] tracking-widest text-zinc-500 uppercase" />
    </div>
  )
}
