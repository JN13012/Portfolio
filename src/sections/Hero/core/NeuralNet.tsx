// The hero network (three.js, lazy-loaded, desktop only): request → embedding → input filter →
// model → output filter → portfolio. Fine glowing neurons, dot-matrix plates, a front-to-back colour
// gradient for depth. Requests (green) reach a section; attacks (red) are stopped at a guard wall,
// which shows only when it blocks. The same component runs the dev tuner (mockups.html?view=reseau),
// where dragging turns the network and the wheel zooms.
import { useEffect, useRef, useState, type MutableRefObject } from 'react'
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
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three'
import { readToken } from '../../../lib/color'
import { cx } from '../../../lib/cx'
import { buildGraph, NETWORK_STRUCTURE, type NetworkGraph, type NetworkNode, type NetworkSettings } from './network'
import type { NeuralNavNode } from './navNodes'
import { runState, type Run } from '../../../lib/brain'

function dotTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')!
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grd.addColorStop(0, 'rgba(255,255,255,1)')
  grd.addColorStop(0.3, 'rgba(255,255,255,0.75)')
  grd.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grd
  g.fillRect(0, 0, 64, 64)
  return new CanvasTexture(c)
}

type Built = Omit<NetworkGraph, 'walls'> & {
  group: Group
  nodeGeo: BufferGeometry
  nodeCol: Float32Array
  edgeGeo: BufferGeometry
  edgeCol: Float32Array
  plateGeo: BufferGeometry | null
  platePos: Vector3[]
  plateCol: Float32Array
  nodeMat: PointsMaterial
  plateMat: PointsMaterial | null
  walls: Array<NetworkGraph['walls'][number] & { mat: MeshBasicMaterial; frame: LineBasicMaterial; hit: number }>
  glow: Float32Array
}

type NetworkView = { yaw?: number; pitch?: number; distance?: number }

type NeuralNetProps = {
  settings: NetworkSettings
  /** The output nodes: the portfolio's sections (shown, not clickable: the NavBar is the navigation). */
  outputs: NeuralNavNode[]
  /** The assistant's answer being played: requests flow to the sections it cites, which light up. */
  run?: Run | null
  /** Tuner only: dragging turns the network and the wheel zooms; the new view is reported here. */
  onView?: (view: NetworkView) => void
  /** Tuner only: receives a function that launches an attack now. */
  attackRef?: MutableRefObject<() => void>
  onReady?: () => void
}

/** How long « prompt injection » shows under the guard wall that stopped the attack (about 2 s). */
const ALERT_MS = 2000

export default function NeuralNet({ settings, outputs, run = null, onView, attackRef, onReady }: NeuralNetProps) {
  const wrap = useRef<HTMLDivElement>(null)
  const settingsRef = useRef(settings)
  const runRef = useRef(run)
  const built = useRef<Built | null>(null)
  const rebuild = useRef<(s: NetworkSettings) => void>(() => {})
  const alertBox = useRef<HTMLSpanElement>(null)
  const outputItems = useRef<Array<HTMLLIElement | null>>([])
  const captions = useRef<Array<HTMLSpanElement | null>>([])
  const vectorBox = useRef<HTMLSpanElement>(null)
  const vectorText = useRef<HTMLSpanElement>(null)
  const onViewRef = useRef(onView)
  const onReadyRef = useRef(onReady)
  const [alert, setAlert] = useState<number | null>(null)
  const [captionTexts, setCaptionTexts] = useState<Array<{ text: string; accent?: boolean; main?: boolean }>>([])

  const structureKey = JSON.stringify(NETWORK_STRUCTURE.map((k) => settings[k]))

  useEffect(() => {
    runRef.current = run
    settingsRef.current = settings
    onViewRef.current = onView
    onReadyRef.current = onReady
  })

  useEffect(() => {
    rebuild.current(settingsRef.current)
  }, [structureKey])

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    renderer.domElement.setAttribute('aria-hidden', 'true')
    renderer.domElement.className = 'absolute inset-0 size-full'
    el.prepend(renderer.domElement)
    const scene = new Scene()
    const camera = new PerspectiveCamera(34, 1, 0.1, 80)
    const root = new Group()
    scene.add(root)
    const tex = dotTexture()
    const threat = new Color(readToken('--color-threat', '#f43f5e'))
    const front = new Color()
    const back = new Color()
    const tmp = new Color()
    const v = new Vector3()

    // Pulses (requests green, attacks red and stopped at a guard wall).
    type Pulse = { path: NetworkNode[]; seg: number; t: number; threat: boolean }
    const pulses: Pulse[] = []

    const disposeGraph = () => {
      const old = built.current
      if (old) {
        root.remove(old.group)
        old.group.traverse((o) => {
          const m = o as Mesh
          m.geometry?.dispose()
          ;(m.material as MeshBasicMaterial | undefined)?.dispose?.()
        })
        built.current = null
      }
    }
    rebuild.current = (st: NetworkSettings) => {
      disposeGraph()
      const g = buildGraph(st, outputs.length)
      const group = new Group()

      const edgePos = new Float32Array(g.edges.length * 6)
      g.edges.forEach((e, i) => edgePos.set([e.a.pos.x, e.a.pos.y, e.a.pos.z, e.b.pos.x, e.b.pos.y, e.b.pos.z], i * 6))
      const edgeCol = new Float32Array(g.edges.length * 6)
      const edgeGeo = new BufferGeometry()
      edgeGeo.setAttribute('position', new BufferAttribute(edgePos, 3))
      edgeGeo.setAttribute('color', new BufferAttribute(edgeCol, 3))
      group.add(new LineSegments(edgeGeo, new LineBasicMaterial({ vertexColors: true, transparent: true, blending: AdditiveBlending, depthWrite: false, depthTest: false })))

      const platePos: Vector3[] = []
      for (const p of g.plates) {
        const n = st.plateDots
        const m = Math.max(2, Math.round((n * p.d) / p.h))
        for (let i = 0; i < n; i++)
          for (let j = 0; j < m; j++) platePos.push(new Vector3(p.x, p.h / 2 - (p.h * i) / (n - 1), -p.d / 2 + (p.d * j) / (m - 1)))
      }
      const plateCol = new Float32Array(platePos.length * 3)
      let plateGeo: BufferGeometry | null = null
      let plateMat: PointsMaterial | null = null
      if (platePos.length) {
        plateGeo = new BufferGeometry()
        plateGeo.setAttribute('position', new BufferAttribute(new Float32Array(platePos.flatMap((p) => [p.x, p.y, p.z])), 3))
        plateGeo.setAttribute('color', new BufferAttribute(plateCol, 3))
        plateMat = new PointsMaterial({ size: st.plateDotSize, map: tex, vertexColors: true, transparent: true, blending: AdditiveBlending, depthWrite: false, depthTest: false })
        group.add(new Points(plateGeo, plateMat))
      }

      const nodeGeo = new BufferGeometry()
      nodeGeo.setAttribute('position', new BufferAttribute(new Float32Array(g.all.flatMap((n) => [n.pos.x, n.pos.y, n.pos.z])), 3))
      const nodeCol = new Float32Array(g.all.length * 3)
      nodeGeo.setAttribute('color', new BufferAttribute(nodeCol, 3))
      const nodeMat = new PointsMaterial({ size: st.pointSize, map: tex, vertexColors: true, transparent: true, blending: AdditiveBlending, depthWrite: false, depthTest: false })
      group.add(new Points(nodeGeo, nodeMat))

      const walls = g.walls.map((w) => {
        const mat = new MeshBasicMaterial({ color: threat, transparent: true, opacity: 0, side: DoubleSide, depthWrite: false, depthTest: false })
        const mesh = new Mesh(new PlaneGeometry(w.d, w.h), mat)
        mesh.position.set(w.x, 0, 0)
        mesh.rotation.y = Math.PI / 2
        const frame = new LineBasicMaterial({ color: threat, transparent: true, opacity: 0, depthTest: false })
        const { h, d, x } = w
        group.add(
          mesh,
          new LineLoop(
            new BufferGeometry().setFromPoints([new Vector3(x, h / 2, -d / 2), new Vector3(x, h / 2, d / 2), new Vector3(x, -h / 2, d / 2), new Vector3(x, -h / 2, -d / 2)]),
            frame,
          ),
        )
        return { ...w, mat, frame, hit: -1e9 }
      })

      root.add(group)
      built.current = { ...g, group, nodeGeo, nodeCol, edgeGeo, edgeCol, plateGeo, platePos, plateCol, nodeMat, plateMat, walls, glow: new Float32Array(g.all.length) }
      setCaptionTexts(g.captions.map(({ text, accent, main }) => ({ text, accent, main })))
      pulses.length = 0
    }

    const MAX = 60
    const pulsePos = new Float32Array(MAX * 3)
    const pulseCol = new Float32Array(MAX * 3)
    const pulseGeo = new BufferGeometry()
    pulseGeo.setAttribute('position', new BufferAttribute(pulsePos, 3))
    pulseGeo.setAttribute('color', new BufferAttribute(pulseCol, 3))
    const pulseMat = new PointsMaterial({ size: 0.36, map: tex, vertexColors: true, transparent: true, blending: AdditiveBlending, depthWrite: false, depthTest: false })
    const pulsePoints = new Points(pulseGeo, pulseMat)
    pulsePoints.renderOrder = 5
    root.add(pulsePoints)
    const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)]!
    let alertTimer = 0
    let alertWall = -1
    const spawn = (isThreat: boolean) => {
      const b = built.current
      if (!b || pulses.length >= MAX) return
      // An attack stops at a guard wall: with two walls, the input filter catches half of them and the
      // output filter the rest (those that got past the first one).
      const wall = isThreat ? (b.walls.length > 1 && Math.random() < 0.5 ? b.walls[0]! : b.walls.at(-1)!) : null
      // Walk along drawn links only; a dead end (a node without onward link) means trying another start.
      const length = wall ? wall.layer + 1 : b.layers.length
      let path: NetworkNode[] = []
      for (let attempt = 0; attempt < 8 && path.length < length; attempt++) {
        path = [pick(b.layers[0]!)]
        while (path.length < length) {
          const next = b.edges.filter((e) => e.a === path.at(-1))
          if (!next.length) break
          path.push(pick(next).b)
        }
      }
      if (path.length < length) return
      pulses.push({ path, seg: 0, t: 0, threat: isThreat })
    }
    // A request aimed at one section: walk the links to a guard node linked to it, then to it.
    const spawnTo = (out: number) => {
      const b = built.current
      if (!b || pulses.length >= MAX) return
      const target = b.layers.at(-1)![out]
      if (!target) return
      for (let attempt = 0; attempt < 12; attempt++) {
        const path = [pick(b.layers[0]!)]
        while (path.length < b.layers.length - 1) {
          const next = b.edges.filter((e) => e.a === path.at(-1))
          if (!next.length) break
          path.push(pick(next).b)
        }
        if (path.length === b.layers.length - 1 && b.edges.some((e) => e.a === path.at(-1) && e.b === target)) {
          pulses.push({ path: [...path, target], seg: 0, t: 0, threat: false })
          return
        }
      }
    }
    if (attackRef) attackRef.current = () => spawn(true)

    rebuild.current(settingsRef.current)

    // Tuner: drag sets the view for good and the wheel zooms. Hero: press and drag on the network turns
    // it further (a temporary offset, back to rest on release); nothing else moves it under the cursor.
    const orbit = !!onViewRef.current
    let drag: { x: number; y: number; yaw: number; pitch: number } | null = null
    const grab = { yaw: 0, pitch: 0 }
    const pointer = { x: 0, y: 0 }
    const tilt = { yaw: 0, pitch: 0 }
    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('a,button')) return
      drag = { x: e.clientX, y: e.clientY, yaw: settingsRef.current.yaw, pitch: settingsRef.current.pitch }
      el.setPointerCapture(e.pointerId)
    }
    // Hero: the drawing area lets clicks through (it reaches under the pitch text), so presses are caught
    // on the window and kept only when they land on the network's frame, away from any control.
    const onHeroDown = (e: PointerEvent) => {
      if (e.button !== 0 || (e.target as HTMLElement).closest('a,button,input,textarea,select,label,[role="dialog"]')) return
      const r = el.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      if (x < bounds.left || x > bounds.right || y < bounds.top || y > bounds.bottom) return
      e.preventDefault()
      drag = { x: e.clientX, y: e.clientY, yaw: grab.yaw, pitch: grab.pitch }
      setCursor('grabbing')
    }
    let cursor = ''
    const setCursor = (c: string) => {
      if (c === cursor) return
      cursor = c
      document.body.style.cursor = c
    }
    // The network's own frame on screen (its nodes and labels), updated each frame.
    const bounds = { left: 0, top: 0, right: 0, bottom: 0 }
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      // Tilt only while the cursor is over the network; elsewhere it eases back to rest.
      const inside = x >= bounds.left && x <= bounds.right && y >= bounds.top && y <= bounds.bottom
      pointer.x = inside ? ((x - bounds.left) / (bounds.right - bounds.left)) * 2 - 1 : 0
      pointer.y = inside ? ((y - bounds.top) / (bounds.bottom - bounds.top)) * 2 - 1 : 0
      // Hero: an open hand over the network says it can be turned (links and buttons keep their own cursor).
      if (!orbit && !drag) setCursor(inside ? 'grab' : '')
      if (!drag) return
      if (!orbit) {
        grab.yaw = Math.max(-35, Math.min(35, drag.yaw + (e.clientX - drag.x) * 0.25))
        grab.pitch = Math.max(-20, Math.min(20, drag.pitch + (e.clientY - drag.y) * 0.2))
        return
      }
      const yaw = Math.max(-80, Math.min(80, drag.yaw + (e.clientX - drag.x) * 0.3))
      const pitch = Math.max(-45, Math.min(45, drag.pitch + (e.clientY - drag.y) * 0.25))
      onViewRef.current?.({ yaw: Math.round(yaw), pitch: Math.round(pitch) })
    }
    const onUp = () => {
      if (drag && !orbit) setCursor('grab')
      drag = null
    }
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const d = settingsRef.current.distance + e.deltaY * 0.01
      onViewRef.current?.({ distance: Math.round(Math.max(6, Math.min(26, d)) * 10) / 10 })
    }
    if (orbit) {
      el.addEventListener('pointerdown', onDown)
      el.addEventListener('wheel', onWheel, { passive: false })
    } else window.addEventListener('pointerdown', onHeroDown)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointermove', onMove, { passive: true })

    const resize = () => {
      renderer.setSize(el.clientWidth, el.clientHeight, false)
      camera.aspect = el.clientWidth / el.clientHeight
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    const project = (p: Vector3) => {
      v.copy(p).applyMatrix4(root.matrixWorld).project(camera)
      return [((v.x + 1) / 2) * el.clientWidth, ((1 - v.y) / 2) * el.clientHeight] as const
    }

    // A new question gives a new vector: a few signed values, as the embedding would output.
    let lastVector = 0
    const vectorTimers: number[] = []
    const showVector = () => {
      const span = vectorText.current
      if (!span) return
      const values = Array.from({ length: 4 }, () => (Math.random() * 2 - 1).toFixed(2).replace('-', '−'))
      span.textContent = `[${values.join(', ')}, …]`
      // Green as it is computed, then greys and fades out before the next question.
      window.clearTimeout(vectorTimers[0])
      window.clearTimeout(vectorTimers[1])
      span.dataset.state = 'fresh'
      vectorTimers[0] = window.setTimeout(() => (span.dataset.state = 'grey'), 250)
      vectorTimers[1] = window.setTimeout(() => (span.dataset.state = 'gone'), 1600)
    }

    // Pause off-screen and in a hidden tab.
    let visible = false
    const io = new IntersectionObserver(([e]) => {
      visible = e?.isIntersecting ?? false
      syncVisibility()
    })
    io.observe(el)

    let last = performance.now()
    let nextRequest = 0
    let nextAttack = performance.now() + 3500
    let nextAnswerPulse = 0
    let first = true
    let fullWidths: number[] = []
    let raf = 0
    const syncVisibility = () => {
      if (visible && !document.hidden) {
        if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame) }
      } else {
        cancelAnimationFrame(raf)
        raf = 0
      }
    }
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      const st = settingsRef.current
      const b = built.current
      if (!b || !visible || document.hidden) {
        last = now
        return
      }
      const dt = Math.min(64, now - last) / 1000
      last = now

      // View: fixed angles, plus a slow drift or a gentle pointer tilt when chosen.
      const rad = Math.PI / 180
      let yaw = st.yaw
      let pitch = st.pitch
      if (st.motion === 'drift') yaw += Math.sin((now / 20000) * Math.PI * 2) * 8 * st.motionAmount
      if (st.motion === 'pointer' && !drag) {
        tilt.yaw = pointer.x * 20 * st.motionAmount
        tilt.pitch = pointer.y * 10 * st.motionAmount
      }
      // A drag on the hero network adds a bigger turn; released, it eases back to rest.
      if (!drag) {
        grab.yaw *= 0.94
        grab.pitch *= 0.94
      }
      yaw += tilt.yaw + grab.yaw
      pitch += tilt.pitch + grab.pitch
      root.rotation.y += (yaw * rad - root.rotation.y) * 0.08
      root.rotation.x += (pitch * rad - root.rotation.x) * 0.08
      if (first) root.rotation.set(pitch * rad, yaw * rad, 0)
      if (camera.fov !== st.fov) {
        camera.fov = st.fov
        camera.updateProjectionMatrix()
      }
      // Framed for a 6:5 box (the tuner's); a narrower box moves the camera back so the network still fits.
      camera.position.set(0, 0, st.distance * Math.max(1, 1.3 / camera.aspect))
      root.updateMatrixWorld()

      // An answer being played: its requests go to the sections it cites, and these light up; the
      // usual traffic and attacks pause meanwhile.
      const current = runRef.current
      const answer = current ? runState(current, now) : null
      const answering = !!answer && answer.phase !== 'done'
      const litOut = new Set(current ? current.lit.map((id) => outputs.findIndex((o) => o.id === id)) : [])
      if (answering && now > nextAnswerPulse) {
        litOut.forEach((i) => i >= 0 && spawnTo(i))
        nextAnswerPulse = now + 450
      }
      outputItems.current.forEach((li, i) => {
        if (li) li.dataset.lit = String(!!answer && answer.phase !== 'question' && litOut.has(i))
      })
      if (answering) {
        nextRequest = Math.max(nextRequest, now + 800)
        nextAttack = Math.max(nextAttack, now + 2000)
      }

      // Traffic.
      if (now > nextRequest) {
        spawn(false)
        nextRequest = now + st.requestEvery * 1000 * (0.7 + Math.random() * 0.6)
      }
      if (now > nextAttack) {
        spawn(true)
        nextAttack = now + st.attackEvery * 1000 * (0.8 + Math.random() * 0.4)
      }
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i]!
        p.t += dt * (p.threat ? 1.1 : 1.5)
        if (p.t < 1) continue
        p.t = 0
        p.seg++
        const reached = p.path[p.seg]!
        b.glow[b.all.indexOf(reached)] = 1
        if (!p.threat && reached.kind === 'embed' && now - lastVector > 350) {
          lastVector = now
          showVector()
        }
        if (p.seg >= p.path.length - 1) {
          pulses.splice(i, 1)
          if (p.threat) {
            const wall = b.walls.find((w) => w.layer === reached.layer)
            if (wall) {
              wall.hit = now
              // Its name shows under the wall that stopped it (the layer is kept to place the label).
              alertWall = wall.layer
              setAlert(wall.layer)
              window.clearTimeout(alertTimer)
              alertTimer = window.setTimeout(() => setAlert(null), ALERT_MS)
            }
          } else if (reached.kind === 'output') {
            // The section reached lights up for a moment.
            const li = outputItems.current[reached.index]
            if (li) {
              li.dataset.hit = 'true'
              window.setTimeout(() => (li.dataset.hit = 'false'), 450)
            }
          }
        }
      }

      // Depth: each point's place between the nearest and the furthest, in view.
      front.set(st.colorFront)
      back.set(st.colorBack)
      const zs = b.all.map((n) => v.copy(n.pos).applyMatrix4(root.matrixWorld).z)
      const zMin = Math.min(...zs)
      const zMax = Math.max(...zs)
      const depthOf = (z: number) => (zMax - zMin < 1e-3 ? 0 : (zMax - z) / (zMax - zMin))
      const hitOf = (layer: number) => Math.max(0, 1 - (now - (b.walls.find((w) => w.layer === layer)?.hit ?? -1e9)) / 1500)
      const colorAt = (z: number, k: number, out: Float32Array, o: number) => {
        const t = depthOf(z)
        tmp.copy(front).lerp(back, t).multiplyScalar(k * (1 - st.fog * t))
        out[o] = tmp.r
        out[o + 1] = tmp.g
        out[o + 2] = tmp.b
      }
      b.all.forEach((n, i) => {
        b.glow[i] = Math.max(0, b.glow[i]! - dt * 1.8)
        const hit = n.kind === 'guard' ? hitOf(n.layer) : 0
        if (hit > 0) {
          tmp.copy(front).lerp(threat, hit).multiplyScalar(0.7 + hit)
          b.nodeCol.set([tmp.r, tmp.g, tmp.b], i * 3)
        } else colorAt(zs[i]!, n.kind === 'output' ? 0.25 : (n.kind === 'embed' ? 0.3 : 0.55) + b.glow[i]! * 0.9, b.nodeCol, i * 3)
      })
      b.nodeGeo.attributes.color!.needsUpdate = true
      b.nodeMat.size = st.pointSize
      const nodeZ = new Map(b.all.map((n, i) => [n, zs[i]!]))
      b.edges.forEach((e, i) => {
        const k = st.linkOpacity * (0.35 + e.w * 0.65)
        colorAt(nodeZ.get(e.a)!, k, b.edgeCol, i * 6)
        colorAt(nodeZ.get(e.b)!, k, b.edgeCol, i * 6 + 3)
      })
      b.edgeGeo.attributes.color!.needsUpdate = true
      if (b.plateGeo && b.plateMat) {
        b.platePos.forEach((p, i) => colorAt(v.copy(p).applyMatrix4(root.matrixWorld).z, st.plateOpacity, b.plateCol, i * 3))
        b.plateGeo.attributes.color!.needsUpdate = true
        b.plateMat.size = st.plateDotSize
      }
      for (const w of b.walls) {
        const hit = hitOf(w.layer)
        w.mat.opacity = st.showWall ? 0.08 : hit * 0.2
        w.frame.opacity = st.showWall ? 0.5 : hit * 0.9
      }

      pulses.forEach((p, i) => {
        const a = p.path[p.seg]!.pos
        const c = p.path[p.seg + 1]!.pos
        pulsePos.set([a.x + (c.x - a.x) * p.t, a.y + (c.y - a.y) * p.t, a.z + (c.z - a.z) * p.t], i * 3)
        tmp.copy(p.threat ? threat : front).multiplyScalar(p.threat ? 1.4 : 1.1)
        pulseCol.set([tmp.r, tmp.g, tmp.b], i * 3)
      })
      pulseGeo.setDrawRange(0, pulses.length)
      pulseGeo.attributes.position!.needsUpdate = true
      pulseGeo.attributes.color!.needsUpdate = true
      pulseMat.size = st.pointSize * 1.05

      renderer.render(scene, camera)

      const xy = b.all.map((n) => project(n.pos))
      bounds.left = Math.min(...xy.map((p) => p[0])) - 90
      bounds.right = Math.max(...xy.map((p) => p[0])) + 50
      bounds.top = Math.min(...xy.map((p) => p[1])) - 50
      bounds.bottom = Math.max(...xy.map((p) => p[1])) + 60

      // HTML labels follow their nodes.
      b.layers.at(-1)!.forEach((n, i) => {
        const li = outputItems.current[i]
        if (li) li.style.transform = `translate(${project(n.pos).join('px,')}px)`
      })
      const embed = b.layers.find((l) => l[0]!.kind === 'embed')
      if (vectorBox.current) {
        vectorBox.current.style.display = embed && st.embedNumbers ? '' : 'none'
        // Under the embedding: the captions take the space above the network.
        if (embed) vectorBox.current.style.transform = `translate(${project(new Vector3(embed[0]!.pos.x, -(st.embedSpread / 2 + st.plateMargin + 0.25), 0)).join('px,')}px)`
      }
      // Captions on one line above the network, each centred on its column. Too close for their full
      // size (mid-size screens), they turn compact; still too close (chat open), all of them hide.
      const top = Math.max(8, Math.min(...xy.map((p) => p[1])) - 62)
      const colX = b.captions.map(({ x }) => project(new Vector3(x, 0, 0))[0])
      const widths = captions.current.map((span) => span?.firstElementChild?.clientWidth ?? 0)
      const fitsWith = (w: number[]) => colX.every((x, i) => i === 0 || x - colX[i - 1]! >= (w[i]! + w[i - 1]!) / 2 + 6)
      const compact = el.dataset.compact === 'true'
      if (!compact) fullWidths = widths
      const roomy = fitsWith(fullWidths)
      el.dataset.compact = String(!roomy)
      const fits = roomy || (compact && fitsWith(widths))
      b.captions.forEach((_, i) => {
        const span = captions.current[i]
        if (!span) return
        span.style.visibility = fits ? '' : 'hidden'
        span.style.transform = `translate(${colX[i]}px, ${top}px)`
      })
      // A blocked attack's name: under the caption of the guard wall that stopped it, above the network.
      const wallX = b.walls.find((w) => w.layer === alertWall)?.x
      const at = wallX === undefined ? -1 : b.captions.findIndex((c) => c.accent && c.x === wallX)
      if (alertBox.current && at >= 0) alertBox.current.style.transform = `translate(${colX[at]}px, ${top + 28}px)`
      if (vectorBox.current && !fits) vectorBox.current.style.display = 'none'

      if (first) {
        first = false
        onReadyRef.current?.()
      }
    }
    document.addEventListener('visibilitychange', syncVisibility)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(alertTimer)
      vectorTimers.forEach(window.clearTimeout)
      document.removeEventListener('visibilitychange', syncVisibility)
      ro.disconnect()
      io.disconnect()
      el.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointerdown', onHeroDown)
      setCursor('')
      el.removeEventListener('wheel', onWheel)
      disposeGraph()
      rebuild.current = () => {}
      if (attackRef) attackRef.current = () => {}
      pulses.length = 0
      tex.dispose()
      pulseGeo.dispose()
      pulseMat.dispose()
      root.clear()
      scene.clear()
      renderer.renderLists.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
    }
  }, [outputs, attackRef])

  // Outputs are glowing points like the other neurons, without labels; they light up when an answer
  // cites them. Not clickable (decision 2026-10-27): the NavBar and Sentry already do that.
  const size = 12 * (settings.outputSize / 0.3)

  return (
    <div ref={wrap} className={cx('group/net absolute inset-0', onView ? 'cursor-grab touch-none select-none active:cursor-grabbing' : 'pointer-events-none')}>
      {/* Overlays positioned each frame from the 3D scene (translate from the top-left corner). */}
      <div aria-hidden="true">
        {/* Inputs carry no name; a blocked attack shows for about 2 s under its guard wall's caption. */}
        <span ref={alertBox} className="pointer-events-none absolute top-0 left-0">
          <span
            className={cx(
              'block -translate-x-1/2 text-[12px] tracking-wider whitespace-nowrap text-[var(--color-threat)] transition-opacity duration-500',
              alert !== null ? 'opacity-100' : 'opacity-0',
            )}
          >
            ⚠ prompt injection
          </span>
        </span>
        <span ref={vectorBox} className="pointer-events-none absolute top-0 left-0">
          <span
            ref={vectorText}
            data-state="gone"
            className="block -translate-x-1/2 text-[10px] whitespace-nowrap text-zinc-500 tabular-nums transition-[color,opacity] duration-700 data-[state=fresh]:text-cyber-light data-[state=fresh]:duration-75 data-[state=gone]:opacity-0"
          >
          </span>
        </span>
        {captionTexts.map((c, i) => (
          <span
            key={`${c.text}-${i}`}
            ref={(e) => {
              captions.current[i] = e
            }}
            className="pointer-events-none absolute top-0 left-0"
          >
            <span
              className={cx(
                'block -translate-x-1/2 tracking-[0.14em] whitespace-nowrap uppercase group-data-[compact=true]/net:tracking-[0.04em]',
                c.main
                  ? 'text-[15px] font-semibold text-zinc-100 group-data-[compact=true]/net:text-[13px]'
                  : cx('text-[13px] group-data-[compact=true]/net:text-[11.5px]', c.accent ? 'text-cyber' : 'text-zinc-400'),
              )}
            >
              {c.text}
            </span>
          </span>
        ))}
      </div>

      <ul aria-hidden="true">
        {outputs.map((node, i) => (
          <li
            key={node.id}
            ref={(e) => {
              outputItems.current[i] = e
            }}
            data-hit="false"
            className="group/out pointer-events-none absolute top-0 left-0"
          >
            <span className="relative -mt-4 -ml-4 flex h-8 items-center">
              <span className="grid size-8 shrink-0 place-items-center">
                <span
                  style={{ width: size, height: size }}
                  className="rounded-full border border-cyber/70 bg-cyber/25 shadow-[0_0_8px_var(--color-cyber)] transition-[transform,background-color,box-shadow] duration-300 group-data-[hit=true]/out:bg-cyber/70 group-data-[hit=true]/out:shadow-[0_0_14px_2px_var(--color-cyber)] group-data-[lit=true]/out:scale-150 group-data-[lit=true]/out:border-cyber group-data-[lit=true]/out:bg-cyber group-data-[lit=true]/out:shadow-[0_0_22px_4px_var(--color-cyber)]"
                />
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
