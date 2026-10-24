// Opening screen (three.js, lazy): a dotted globe turns, the countries Jérémie has
// lived in light up one by one and arc to Marseille, then « Entrer » zooms in and reveals the site.
import { useEffect, useRef, useState } from 'react'
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  Group,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  QuadraticBezierCurve3,
  Scene,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  Vector3,
  WebGLRenderer,
} from 'three'
import { readToken } from '../../lib/color'
import { cx } from '../../lib/cx'
import landDots from './landDots.json'

type Place = { name: string; lat: number; lon: number }

// Approximate country centres (no city is claimed); Marseille is the current base.
const COUNTRIES: Place[] = [
  { name: 'Liban', lat: 33.9, lon: 35.9 },
  { name: 'Qatar', lat: 25.3, lon: 51.2 },
  { name: 'Arabie saoudite', lat: 23.9, lon: 45.1 },
  { name: 'Canada', lat: 54, lon: -100 },
  { name: 'Pérou', lat: -9.2, lon: -75 },
  { name: 'France', lat: 46.6, lon: 2.2 },
]
const BASE: Place = { name: 'Marseille', lat: 43.3, lon: 5.4 }
const R = 1.6

function toVec(lat: number, lon: number, r = R) {
  const phi = ((90 - lat) * Math.PI) / 180
  const theta = ((lon + 180) * Math.PI) / 180
  return new Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta))
}

function glowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')!
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grd.addColorStop(0, 'rgba(255,255,255,1)')
  grd.addColorStop(0.25, 'rgba(255,255,255,0.6)')
  grd.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grd
  g.fillRect(0, 0, 128, 128)
  return new CanvasTexture(c)
}

const REVEAL_START = 1100 // ms
const REVEAL_STEP = 750 // ms between countries

type GlobeGateProps = { onClose: () => void }

export default function GlobeGate({ onClose }: GlobeGateProps) {
  const wrap = useRef<HTMLDivElement>(null)
  const labels = useRef<Array<HTMLSpanElement | null>>([])
  const leaving = useRef(false)
  const onCloseRef = useRef(onClose)
  const [shown, setShown] = useState(0)
  const [exiting, setExiting] = useState(false)
  const enterRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const green = new Color(readToken('--color-ai', '#4ade80'))

    const renderer = new WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    renderer.domElement.setAttribute('aria-hidden', 'true')
    renderer.domElement.className = 'absolute inset-0 size-full'
    el.prepend(renderer.domElement)

    const scene = new Scene()
    const camera = new PerspectiveCamera(36, 1, 0.1, 100)
    camera.position.set(0, 0, 7)
    const globe = new Group()
    globe.position.y = 0.55
    scene.add(globe)

    // Occluder so back-side dots stay hidden, plus a faint halo.
    globe.add(new Mesh(new SphereGeometry(R * 0.985, 64, 48), new MeshBasicMaterial({ color: 0x020604 })))
    const tex = glowTexture()
    const halo = new Sprite(new SpriteMaterial({ map: tex, color: green, transparent: true, opacity: 0.16, blending: AdditiveBlending, depthWrite: false }))
    halo.scale.setScalar(R * 3.1)
    halo.position.y = 0.55
    scene.add(halo)

    // Land dots.
    const dots = landDots as number[]
    const pos = new Float32Array((dots.length / 2) * 3)
    for (let i = 0; i < dots.length; i += 2) toVec(dots[i]! / 10, dots[i + 1]! / 10).toArray(pos, (i / 2) * 3)
    const dotGeo = new BufferGeometry()
    dotGeo.setAttribute('position', new BufferAttribute(pos, 3))
    const dotMat = new PointsMaterial({ size: 0.022, color: green, transparent: true, opacity: 0, depthWrite: false })
    globe.add(new Points(dotGeo, dotMat))

    // Markers and arcs to Marseille.
    const base = toVec(BASE.lat, BASE.lon)
    const markers = COUNTRIES.map((c) => {
      const p = toVec(c.lat, c.lon)
      const sprite = new Sprite(new SpriteMaterial({ map: tex, color: green, transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false }))
      sprite.position.copy(toVec(c.lat, c.lon, R * 1.01))
      sprite.scale.setScalar(0.22)
      globe.add(sprite)
      const mid = p.clone().add(base).multiplyScalar(0.5)
      const lift = 1 + Math.min(0.6, p.distanceTo(base) * 0.32)
      const curve = new QuadraticBezierCurve3(p, mid.normalize().multiplyScalar(R * lift), base)
      const arcGeo = new BufferGeometry().setFromPoints(curve.getPoints(64))
      arcGeo.setDrawRange(0, 0)
      const arc = new Line(arcGeo, new LineBasicMaterial({ color: green, transparent: true, opacity: 0.8 }))
      globe.add(arc)
      return { p, sprite, arcGeo, arc }
    })
    const baseSprite = new Sprite(new SpriteMaterial({ map: tex, color: 0xffffff, transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false }))
    baseSprite.position.copy(toVec(BASE.lat, BASE.lon, R * 1.01))
    baseSprite.scale.setScalar(0.3)
    globe.add(baseSprite)

    // Rotation (around Y) that brings a point in front of the camera; the globe tours the countries.
    const facing = (v: Vector3) => -Math.atan2(v.x, v.z)
    const tour = [...markers.map((m) => facing(m.p)), facing(base)]
    globe.rotation.y = tour[0]! + 0.9
    globe.rotation.x = 0.42

    const resize = () => {
      renderer.setSize(el.clientWidth, el.clientHeight, false)
      camera.aspect = el.clientWidth / el.clientHeight
      camera.updateProjectionMatrix()
    }
    resize()
    window.addEventListener('resize', resize)

    const start = performance.now()
    let exitStart = 0
    let revealed = 0
    let raf = 0
    const camDir = new Vector3()
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      const t = now - start
      dotMat.opacity = Math.min(0.85, t / 1200)

      const count = Math.max(0, Math.min(COUNTRIES.length, Math.floor((t - REVEAL_START) / REVEAL_STEP) + 1))
      if (count !== revealed) {
        revealed = count
        setShown(count)
      }
      // Ease towards the latest country, then Marseille once all are shown (shortest way round).
      const allShown = t > REVEAL_START + COUNTRIES.length * REVEAL_STEP + 400
      const goal = tour[allShown ? tour.length - 1 : Math.max(0, count - 1)]!
      const diff = Math.atan2(Math.sin(goal - globe.rotation.y), Math.cos(goal - globe.rotation.y))
      globe.rotation.y += diff * 0.05
      markers.forEach((m, i) => {
        const age = t - REVEAL_START - i * REVEAL_STEP
        if (age < 0) return
        const k = Math.min(1, age / 500)
        const mat = m.sprite.material as SpriteMaterial
        mat.opacity = k * (0.75 + 0.25 * Math.sin(now / 300 + i))
        m.sprite.scale.setScalar(0.22 + (1 - k) * 0.5)
        m.arcGeo.setDrawRange(0, Math.floor(Math.min(1, age / 700) * 65))
      })
      ;(baseSprite.material as SpriteMaterial).opacity = Math.min(1, t / 900) * (0.8 + 0.2 * Math.sin(now / 250))

      // Exit: zoom towards Marseille.
      if (leaving.current) {
        if (!exitStart) exitStart = now
        const k = Math.min(1, (now - exitStart) / 900)
        const e = k * k * (3 - 2 * k)
        const target = base.clone().applyMatrix4(globe.matrixWorld)
        const from = new Vector3(0, 0, 7)
        camera.position.lerpVectors(from, target.clone().multiplyScalar(1.15), e)
        camera.lookAt(target.x * (1 - e), 0.55 * (1 - e) + target.y * e, 0)
        if (k >= 1) {
          cancelAnimationFrame(raf)
          onCloseRef.current()
          return
        }
      }

      globe.updateMatrixWorld()
      renderer.render(scene, camera)

      // HTML labels follow their marker; hidden on the far side.
      camera.getWorldDirection(camDir)
      COUNTRIES.forEach((_, i) => {
        const node = labels.current[i]
        if (!node) return
        const world = markers[i]!.p.clone().applyMatrix4(globe.matrixWorld)
        const facing = world.clone().normalize().dot(camDir) < -0.1
        const s = world.project(camera)
        node.style.transform = `translate(${((s.x + 1) / 2) * el.clientWidth}px, ${((1 - s.y) / 2) * el.clientHeight}px)`
        node.style.opacity = facing && i < revealed ? '1' : '0'
      })
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      renderer.dispose()
      tex.dispose()
      dotGeo.dispose()
      markers.forEach((m) => m.arcGeo.dispose())
      renderer.domElement.remove()
    }
  }, [])

  const ready = shown >= COUNTRIES.length

  useEffect(() => {
    if (ready) enterRef.current?.focus()
  }, [ready])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCloseRef.current()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const enter = () => {
    leaving.current = true
    setExiting(true)
  }

  return (
    <div
      ref={wrap}
      role="dialog"
      aria-modal="true"
      aria-label="Jérémie Nagi - introduction"
      className="fixed inset-0 z-[2000] overflow-hidden bg-black"
    >
      {COUNTRIES.map((c, i) => (
        <span
          key={c.name}
          ref={(e) => {
            labels.current[i] = e
          }}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 opacity-0 transition-opacity duration-500"
        >
          <span className="ml-3 block -translate-y-1/2 text-xs tracking-[0.2em] whitespace-nowrap text-cyber uppercase">{c.name}</span>
        </span>
      ))}

      <button
        type="button"
        onClick={() => onCloseRef.current()}
        className="absolute top-6 right-6 text-xs tracking-[0.2em] text-zinc-500 uppercase hover:text-zinc-200"
      >
        Passer l’introduction
      </button>

      <div className={cx('pointer-events-none absolute inset-x-0 bottom-[8vh] flex flex-col items-center gap-5 px-6 text-center transition-opacity duration-500', exiting && 'opacity-0')}>
        <p className="text-4xl font-black tracking-tighter text-white uppercase md:text-6xl">
          Nagi <span className="text-cyber">Jérémie</span>
        </p>
        <p className="text-sm tracking-[0.3em] text-zinc-400 uppercase">
          {shown} / {COUNTRIES.length} pays · 5 langues · base : Marseille
        </p>
        <button
          ref={enterRef}
          type="button"
          onClick={enter}
          className={cx(
            'pointer-events-auto mt-2 h-12 border px-12 text-sm tracking-[0.4em] uppercase transition-[opacity,box-shadow,border-color] duration-500 focus-visible:outline-none focus-visible:shadow-focus',
            ready ? 'border-cyber text-cyber shadow-[0_0_32px_-8px_var(--color-cyber)] hover:bg-cyber/10' : 'border-white/15 text-zinc-500',
          )}
        >
          Entrer
        </button>
      </div>
    </div>
  )
}
