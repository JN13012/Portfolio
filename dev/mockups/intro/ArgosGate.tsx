import './argosGate.css'
// Opening screen, « Argos » version (three.js, lazy; prototype shown on /mockups.html?gate=argos).
// A staged OSINT self-scan: the log on the left checks Jérémie's public sources, the globe
// lights up the countries he lived in along his journey, then an arc runs from the visitor's
// time zone to Marseille and « Entrer » reveals the site. Every value shown is real profile data.
// Globe style A: ~29k dots lit by real city lights (NASA Black Marble), lit country outlines,
// light pillars, thick arcs and a soft bloom. Dots and outlines come from scripts/build-globe-dots.mjs.
import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  CylinderGeometry,
  Group,
  Line,
  LineBasicMaterial,
  Mesh,
  PerspectiveCamera,
  Points,
  QuadraticBezierCurve3,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  TubeGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { Check, ScanEye } from 'lucide-react'
import fr from 'flag-icons/flags/4x3/fr.svg'
import lb from 'flag-icons/flags/4x3/lb.svg'
import sa from 'flag-icons/flags/4x3/sa.svg'
import qa from 'flag-icons/flags/4x3/qa.svg'
import ca from 'flag-icons/flags/4x3/ca.svg'
import pe from 'flag-icons/flags/4x3/pe.svg'
import { cx } from '../../../src/lib/cx'
import { profile } from '../../../src/content/profile'
import dotsUrl from '../../../src/sections/Gate/globeDots.bin?url'
import outlines from '../../../src/sections/Gate/globeOutlines.json'

type Country = { code: string; name: string; lat: number; lon: number; flag: string; note: string; dx: number; dy: number }

// Same order as scripts/build-globe-dots.mjs (dot tags, outlines). Approximate centres, no city claimed.
// dx/dy: where the card sits relative to its marker (px), so the Middle-East cards don't overlap.
const COUNTRIES: Country[] = [
  { code: 'FR', name: 'France', lat: 46.6, lon: 2.2, flag: fr, note: 'origine', dx: -200, dy: -74 },
  { code: 'LB', name: 'Liban', lat: 33.9, lon: 35.9, flag: lb, note: 'vécu', dx: 40, dy: -84 },
  { code: 'SA', name: 'Arabie saoudite', lat: 23.9, lon: 45.1, flag: sa, note: 'vécu', dx: -215, dy: 46 },
  { code: 'QA', name: 'Qatar', lat: 25.3, lon: 51.2, flag: qa, note: 'vécu', dx: 24, dy: 40 },
  { code: 'CA', name: 'Canada', lat: 56, lon: -96, flag: ca, note: 'vécu', dx: 30, dy: -90 },
  { code: 'PE', name: 'Pérou', lat: -9.2, lon: -75, flag: pe, note: 'vécu', dx: 44, dy: 30 },
]
const BASE = { lat: 43.3, lon: 5.4 }
// The journey, in order (indices in COUNTRIES; -1 = Marseille).
const LEGS: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, -1],
  [-1, 4],
  [4, 5],
  [5, -1],
]

// Approximate positions for common time zones: the visitor arc needs no permission and no IP lookup.
const TZ: Record<string, [number, number]> = {
  'Europe/Paris': [48.86, 2.35],
  'Europe/London': [51.5, -0.13],
  'Europe/Brussels': [50.85, 4.35],
  'Europe/Luxembourg': [49.61, 6.13],
  'Europe/Zurich': [47.37, 8.54],
  'Europe/Berlin': [52.52, 13.4],
  'Europe/Amsterdam': [52.37, 4.9],
  'Europe/Madrid': [40.42, -3.7],
  'Europe/Lisbon': [38.72, -9.14],
  'Europe/Rome': [41.9, 12.5],
  'Europe/Monaco': [43.73, 7.42],
  'Europe/Dublin': [53.35, -6.26],
  'Europe/Vienna': [48.21, 16.37],
  'Europe/Stockholm': [59.33, 18.07],
  'Europe/Warsaw': [52.23, 21.01],
  'America/New_York': [40.71, -74.0],
  'America/Toronto': [43.65, -79.38],
  'America/Montreal': [45.5, -73.57],
  'America/Chicago': [41.88, -87.63],
  'America/Los_Angeles': [34.05, -118.24],
  'America/Lima': [-12.05, -77.04],
  'Asia/Beirut': [33.89, 35.5],
  'Asia/Qatar': [25.29, 51.53],
  'Asia/Riyadh': [24.71, 46.68],
  'Asia/Dubai': [25.2, 55.27],
  'Asia/Singapore': [1.35, 103.82],
  'Asia/Tokyo': [35.68, 139.69],
  'Africa/Casablanca': [33.57, -7.59],
  'Africa/Algiers': [36.75, 3.06],
  'Africa/Tunis': [36.8, 10.18],
}

const R = 1.6
const CAM_Z = 7

function toVec(lat: number, lon: number, r = R) {
  const phi = ((90 - lat) * Math.PI) / 180
  const theta = ((lon + 180) * Math.PI) / 180
  return new Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta))
}

function km(a: [number, number], b: [number, number]) {
  const rad = Math.PI / 180
  const h = Math.sin(((b[0] - a[0]) * rad) / 2) ** 2 + Math.cos(a[0] * rad) * Math.cos(b[0] * rad) * Math.sin(((b[1] - a[1]) * rad) / 2) ** 2
  return Math.round(12742 * Math.asin(Math.sqrt(h)))
}

function radialTexture(ring = false) {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')!
  if (ring) {
    g.strokeStyle = 'rgba(255,255,255,1)'
    g.lineWidth = 5
    g.beginPath()
    g.arc(64, 64, 58, 0, Math.PI * 2)
    g.stroke()
  } else {
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.2, 'rgba(255,255,255,0.7)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, 128, 128)
  }
  return new CanvasTexture(c)
}

const smooth = (k: number) => {
  const x = Math.max(0, Math.min(1, k))
  return x * x * (3 - 2 * x)
}

// ── Timeline (ms) ──────────────────────────────────────────────────────────────
// The sources are checked while the globe settles on France; then each journey flies (~0.85 s)
// and holds on the country it lands on (~0.35 s); returns to Marseille are quicker.
const T_SOURCES = 1200
const SOURCE_STEP = 280
const T_GEO = 2200
const T_LEGS = T_GEO + 500
const SCHEDULE = (() => {
  let at = T_LEGS
  return LEGS.map(([, to]) => {
    const home = to < 0
    const leg = { start: at, travel: home ? 650 : 850 }
    at += leg.travel + (home ? 150 : 350)
    return leg
  })
})()
const T_LEGS_END = SCHEDULE[SCHEDULE.length - 1]!.start + SCHEDULE[SCHEDULE.length - 1]!.travel
const T_LANG = T_LEGS_END + 350
const T_VISITOR = T_LANG + 400
const T_DONE = T_VISITOR + 1000

const SOURCES = [
  { host: 'github.com/JN13012', finding: 'dépôts publics' },
  { host: 'tryhackme.com/p/JN13', finding: 'Jr Penetration Tester' },
  { host: 'coursera.org', finding: 'IBM AI Developer' },
  { host: 'epitech.eu', finding: 'MSc cybersécurité' },
  { host: 'linkedin.com/in/jn13012', finding: 'profil professionnel' },
]

// legs = journeys landed (a country is revealed when its arc lands).
type Phase = { sources: number; geo: boolean; legs: number; lang: boolean; visitor: boolean; done: boolean }
const phaseAt = (t: number): Phase => ({
  sources: Math.max(0, Math.min(SOURCES.length, Math.floor((t - T_SOURCES) / SOURCE_STEP) + 1)),
  geo: t > T_GEO,
  legs: SCHEDULE.filter((l) => t >= l.start + l.travel).length,
  lang: t > T_LANG,
  visitor: t > T_VISITOR,
  done: t > T_DONE,
})
const samePhase = (a: Phase, b: Phase) => a.sources === b.sources && a.geo === b.geo && a.legs === b.legs && a.lang === b.lang && a.visitor === b.visitor && a.done === b.done

// Countries revealed so far (France is the origin, shown when the geo phase starts).
const revealedCountries = ({ geo, legs }: Phase) => {
  const s = new Set<number>(geo ? [0] : [])
  LEGS.slice(0, legs).forEach(([, to]) => to >= 0 && s.add(to))
  return s
}

// ── Shaders ────────────────────────────────────────────────────────────────────
// Dots: slate on dark land, warm white where city lights are, green once their country is found.
const DOT_VERT = /* glsl */ `
  attribute float aCountry;
  attribute float aBright;
  attribute float aRand;
  uniform float uSize;
  uniform float uLit[7];
  uniform float uScanX;
  uniform vec3 uBase;
  uniform vec3 uCity;
  uniform vec3 uGreen;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vScan;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vec4 mv = viewMatrix * world;
    vec3 n = normalize(mat3(modelViewMatrix) * position);
    float facing = dot(n, normalize(-mv.xyz));
    float lit = uLit[int(aCountry + 0.5)];
    vColor = mix(mix(uBase, uCity, aBright), uGreen, lit * 0.8);
    vAlpha = mix(0.4 + 0.6 * aBright, 0.95, lit) * smoothstep(-0.02, 0.35, facing);
    vScan = exp(-pow(world.x - uScanX, 2.0) / 0.006) * step(0.0, facing);
    gl_PointSize = uSize * (1.7 + aBright * 1.6 + lit * 0.6 + aRand * 0.3) * (${CAM_Z.toFixed(1)} / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`
const DOT_FRAG = /* glsl */ `
  uniform vec3 uScanColor;
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vScan;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    vec3 col = mix(vColor, uScanColor, vScan * 0.85);
    gl_FragColor = vec4(col, max(vAlpha, vScan * 0.9) * uOpacity * smoothstep(0.5, 0.3, d));
  }
`
const VERT = /* glsl */ `
  varying vec3 vN;
  varying vec3 vV;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`
// Globe body: near-black with a soft rim, so the sphere reads without a texture.
const BODY_FRAG = /* glsl */ `
  uniform vec3 uRim;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    float f = pow(1.0 - max(dot(vN, vV), 0.0), 3.0);
    gl_FragColor = vec4(mix(vec3(0.012, 0.018, 0.028), uRim * 0.5, f), 1.0);
  }
`
// Atmosphere: back faces of a larger sphere, brightest just outside the limb.
const ATMO_FRAG = /* glsl */ `
  uniform vec3 uRim;
  uniform float uStrength;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    float f = pow(clamp(0.72 + dot(vN, vV), 0.0, 1.0), 4.0);
    gl_FragColor = vec4(uRim, 1.0) * f * uStrength;
  }
`
// Light pillar: bright at the base, fading upwards.
const PILLAR_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    gl_FragColor = vec4(uColor, pow(1.0 - vUv.y, 1.6) * 0.95 * uOpacity);
  }
`

type ArgosGateProps = { onClose: () => void; /** Overrides the detected time zone (mockups). */ visitorTz?: string }

export default function ArgosGate({ onClose, visitorTz }: ArgosGateProps) {
  const wrap = useRef<HTMLDivElement>(null)
  const cards = useRef<Array<HTMLDivElement | null>>([])
  const leaders = useRef<Array<SVGLineElement | null>>([])
  const ring = useRef<SVGGElement>(null)
  const ringLabel = useRef<SVGTextElement>(null)
  const leaving = useRef(false)
  const onCloseRef = useRef(onClose)
  const enterRef = useRef<HTMLButtonElement>(null)
  const [phase, setPhase] = useState<Phase>(() => phaseAt(0))
  const [progress, setProgress] = useState(0)
  const [exiting, setExiting] = useState(false)
  const [clock, setClock] = useState('')

  const tz = visitorTz ?? Intl.DateTimeFormat().resolvedOptions().timeZone
  const visitor = TZ[tz]
  const visitorKm = visitor ? km(visitor, [BASE.lat, BASE.lon]) : null
  const visitorCity = tz.split('/').pop()?.replace(/_/g, ' ') ?? tz

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    const tick = () => setClock(new Date().toISOString().slice(11, 19))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    let disposed = false
    let cleanup = () => {}

    // The dots are fetched first; the timeline starts once the globe can be drawn.
    fetch(dotsUrl)
      .then((r) => r.arrayBuffer())
      .then((buffer) => {
        if (disposed) return
        cleanup = buildScene(el, buffer)
      })
      .catch(() => onCloseRef.current())

    function buildScene(el: HTMLDivElement, buffer: ArrayBuffer) {
      const teal = new Color('#3fb6c8')
      const green = new Color('#4ade80')
      const white = new Color('#ffffff')

      const renderer = new WebGLRenderer({ antialias: true })
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      renderer.setPixelRatio(dpr)
      renderer.domElement.setAttribute('aria-hidden', 'true')
      renderer.domElement.className = 'absolute inset-0 size-full'
      el.prepend(renderer.domElement)

      const scene = new Scene()
      scene.background = new Color('#03060a')
      const camera = new PerspectiveCamera(36, 1, 0.1, 100)
      camera.position.set(0, 0, CAM_Z)
      const globe = new Group()
      scene.add(globe)

      const bodyMat = new ShaderMaterial({ vertexShader: VERT, fragmentShader: BODY_FRAG, uniforms: { uRim: { value: teal } } })
      const bodyGeo = new SphereGeometry(R * 0.985, 96, 64)
      globe.add(new Mesh(bodyGeo, bodyMat))
      const atmoMat = new ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: ATMO_FRAG,
        uniforms: { uRim: { value: teal }, uStrength: { value: 0 } },
        side: BackSide,
        transparent: true,
        blending: AdditiveBlending,
        depthWrite: false,
      })
      const atmoGeo = new SphereGeometry(R * 1.2, 96, 64)
      scene.add(new Mesh(atmoGeo, atmoMat))

      // Land dots: decode the lattice (see build-globe-dots.mjs for the layout).
      const view = new DataView(buffer)
      const N = view.getUint32(0, true)
      const count = view.getUint32(4, true)
      const pos = new Float32Array(count * 3)
      const bright = new Float32Array(count)
      const country = new Float32Array(count)
      const rand = new Float32Array(count)
      const golden = Math.PI * (3 - Math.sqrt(5))
      let index = 0
      for (let j = 0; j < count; j++) {
        index += view.getUint16(8 + j * 4, true)
        const lat = (Math.asin(1 - (index / (N - 1)) * 2) * 180) / Math.PI
        const lon = ((((golden * index * 180) / Math.PI) % 360) + 540) % 360 - 180
        toVec(lat, lon).toArray(pos, j * 3)
        bright[j] = view.getUint8(10 + j * 4) / 255
        country[j] = view.getUint8(11 + j * 4)
        rand[j] = Math.random()
      }
      const dotGeo = new BufferGeometry()
      dotGeo.setAttribute('position', new BufferAttribute(pos, 3))
      dotGeo.setAttribute('aBright', new BufferAttribute(bright, 1))
      dotGeo.setAttribute('aCountry', new BufferAttribute(country, 1))
      dotGeo.setAttribute('aRand', new BufferAttribute(rand, 1))
      const lit = new Array<number>(7).fill(0)
      const dotMat = new ShaderMaterial({
        vertexShader: DOT_VERT,
        fragmentShader: DOT_FRAG,
        uniforms: {
          uSize: { value: dpr },
          uLit: { value: lit },
          uScanX: { value: -99 },
          uBase: { value: new Color('#71859b') },
          uCity: { value: new Color('#f4f1e4') },
          uGreen: { value: green },
          uScanColor: { value: new Color('#c8f7ff') },
          uOpacity: { value: 0 },
        },
        transparent: true,
        depthWrite: false,
      })
      globe.add(new Points(dotGeo, dotMat))

      // Lit outlines of the lived-in countries, traced when the country is found.
      const outlineMats = COUNTRIES.map(() => new LineBasicMaterial({ color: green, transparent: true, opacity: 0 }))
      const outlineGeos = (outlines as number[][][][]).map((rings, i) =>
        rings.map((ring) => {
          const geo = new BufferGeometry().setFromPoints(ring.map(([lon, lat]) => toVec(lat!, lon!, R * 1.004)))
          geo.setDrawRange(0, 0)
          globe.add(new Line(geo, outlineMats[i]))
          return { geo, n: ring.length }
        }),
      )

      // Markers: a ripple when the country is found, and a light pillar that rises.
      const glow = radialTexture()
      const ringTex = radialTexture(true)
      const up = new Vector3(0, 1, 0)
      const pillarGeos: CylinderGeometry[] = []
      const pillarMats: ShaderMaterial[] = []
      const marker = (lat: number, lon: number, color: Color, height: number) => {
        const p = toVec(lat, lon)
        const rip = new Sprite(new SpriteMaterial({ map: ringTex, color, transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false }))
        rip.position.copy(toVec(lat, lon, R * 1.005))
        const geo = new CylinderGeometry(0.0065, 0.0065, height, 8, 1, true)
        geo.translate(0, height / 2, 0)
        const mat = new ShaderMaterial({
          vertexShader: VERT,
          fragmentShader: PILLAR_FRAG,
          uniforms: { uColor: { value: color }, uOpacity: { value: 0 } },
          transparent: true,
          blending: AdditiveBlending,
          depthWrite: false,
        })
        pillarGeos.push(geo)
        pillarMats.push(mat)
        const pillar = new Mesh(geo, mat)
        pillar.position.copy(p)
        pillar.quaternion.setFromUnitVectors(up, p.clone().normalize())
        pillar.scale.y = 0.001
        globe.add(rip, pillar)
        return { rip, pillar, mat, at: -1, p }
      }
      const markers = COUNTRIES.map((c) => marker(c.lat, c.lon, green, 0.32))
      const base = marker(BASE.lat, BASE.lon, white, 0.42)

      // Thick arcs between consecutive places, drawn progressively.
      const RADIAL = 8
      const TUBULAR = 96
      const arcMats: ShaderMaterial[] = []
      const arc = (from: Vector3, to: Vector3, color: Color, radius: number) => {
        const mid = from.clone().add(to).multiplyScalar(0.5)
        const lift = 1 + Math.min(0.5, from.distanceTo(to) * 0.28)
        const curve = new QuadraticBezierCurve3(from, mid.normalize().multiplyScalar(R * lift), to)
        const geo = new TubeGeometry(curve, TUBULAR, radius, RADIAL, false)
        geo.setDrawRange(0, 0)
        const mat = new ShaderMaterial({
          vertexShader: /* glsl */ `void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
          fragmentShader: /* glsl */ `uniform vec3 uColor; void main() { gl_FragColor = vec4(uColor, 0.75); }`,
          uniforms: { uColor: { value: color } },
          transparent: true,
          blending: AdditiveBlending,
          depthWrite: false,
        })
        arcMats.push(mat)
        globe.add(new Mesh(geo, mat))
        const head = new Sprite(new SpriteMaterial({ map: glow, color, transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false }))
        head.scale.setScalar(0.1)
        globe.add(head)
        return { curve, geo, head }
      }
      const reveal = (a: { curve: QuadraticBezierCurve3; geo: TubeGeometry; head: Sprite }, k: number) => {
        const e = smooth(k)
        a.geo.setDrawRange(0, Math.floor(e * TUBULAR) * RADIAL * 6)
        ;(a.head.material as SpriteMaterial).opacity = k > 0 && k < 1 ? 1 : 0
        a.head.position.copy(a.curve.getPoint(e))
      }
      const placeVec = (i: number) => (i < 0 ? base.p : markers[i]!.p)
      const arcs = LEGS.map(([a, b]) => arc(placeVec(a), placeVec(b), green, 0.0048))
      const visitorArc = visitor && visitorKm! > 150 ? arc(toVec(visitor[0], visitor[1]), base.p, new Color('#e2e8f0'), 0.0035) : null

      // Camera framing: where the globe faces (lat, lon) and how far the camera stands.
      const shots: Array<{ lat: number; lon: number; z: number }> = [
        { lat: 44, lon: 2, z: 5.6 }, // France, close
        ...LEGS.map(([, to]) => (to < 0 ? { ...BASE, z: 6.2 } : { lat: COUNTRIES[to]!.lat, lon: COUNTRIES[to]!.lon, z: 6.6 })),
        { lat: 28, lon: -24, z: 7.4 }, // final: the whole journey, Americas to the Gulf
      ]
      const rotFor = (lat: number, lon: number) => {
        const v = toVec(0, lon)
        return { y: -Math.atan2(v.x, v.z), x: (lat * Math.PI) / 180 }
      }
      let rot = rotFor(30, 60)
      globe.rotation.set(rot.x, rot.y - 0.6, 0)

      const composer = new EffectComposer(renderer)
      composer.addPass(new RenderPass(scene, camera))
      const bloom = new UnrealBloomPass(new Vector2(1, 1), 0.55, 0.4, 0.42)
      composer.addPass(bloom)
      composer.addPass(new OutputPass())

      let w = 1
      let h = 1
      const resize = () => {
        w = el.clientWidth
        h = el.clientHeight
        renderer.setSize(w, h, false)
        composer.setPixelRatio(dpr)
        composer.setSize(w, h)
        camera.aspect = w / h
        // Globe right of centre, leaving the left column for the scan log.
        camera.setViewOffset(w, h, -w * 0.15, 0, w, h)
        camera.updateProjectionMatrix()
      }
      resize()
      window.addEventListener('resize', resize)

      const start = performance.now()
      let last = start
      let exitStart = 0
      let raf = 0
      let current = phaseAt(0)
      let lastProgress = -1
      const camDir = new Vector3(0, 0, -1)
      const right = new Vector3()
      const shortest = (from: number, to: number) => from + Math.atan2(Math.sin(to - from), Math.cos(to - from))
      const toScreen = (v: Vector3) => {
        const s = v.project(camera)
        return [((s.x + 1) / 2) * w, ((1 - s.y) / 2) * h] as const
      }
      const reveal1 = (m: { rip: Sprite; pillar: Mesh; mat: ShaderMaterial; at: number }, now: number, size: number) => {
        const age = m.at < 0 ? -1 : now - m.at
        const k = age < 0 ? 0 : Math.min(1, age / 1100)
        ;(m.rip.material as SpriteMaterial).opacity = age < 0 ? 0 : (1 - k) * 0.9
        m.rip.scale.setScalar(size + k * 0.6)
        m.pillar.scale.y = age < 0 ? 0.001 : Math.max(0.001, smooth(age / 700))
        m.mat.uniforms.uOpacity!.value = age < 0 ? 0 : 1
        return age
      }

      const frame = (now: number) => {
        raf = requestAnimationFrame(frame)
        const t = now - start
        const dt = Math.min(0.05, (now - last) / 1000)
        last = now
        const ease = 1 - Math.exp(-dt * 2.4)

        const ph = phaseAt(t)
        if (!samePhase(ph, current)) {
          current = ph
          setPhase(ph)
        }
        const pr = Math.min(100, Math.round((t / T_DONE) * 100))
        if (pr !== lastProgress) {
          lastProgress = pr
          setProgress(pr)
        }

        dotMat.uniforms.uOpacity!.value = Math.min(1, t / 900)
        atmoMat.uniforms.uStrength!.value = Math.min(1, t / 1400) * 0.6
        // Scan sweep across the globe while the sources are checked.
        const sweep = (t - 600) / (T_GEO - 600)
        dotMat.uniforms.uScanX!.value = sweep > 0 && sweep < 1 ? -R * 1.1 + sweep * R * 2.2 : -99

        // During a journey the camera already aims at its destination; on exit it dives to Marseille.
        const started = SCHEDULE.filter((l) => t >= l.start).length
        const shot = leaving.current
          ? { ...BASE, z: 2.7 }
          : shots[t < T_LEGS ? 0 : t > T_LEGS_END + 200 ? shots.length - 1 : Math.min(started, LEGS.length)]!
        const goal = rotFor(shot.lat, shot.lon)
        rot = { x: rot.x + (goal.x - rot.x) * ease, y: shortest(rot.y, goal.y) }
        globe.rotation.y += (rot.y - globe.rotation.y) * ease
        globe.rotation.x = rot.x
        camera.position.z += ((t < 1200 ? CAM_Z + 0.6 : shot.z) - camera.position.z) * (leaving.current ? ease * 1.8 : ease)

        // Countries light up: dots turn green, the outline is traced, the pillar rises.
        const shown = revealedCountries(ph)
        markers.forEach((m, i) => {
          if (shown.has(i) && m.at < 0) m.at = now
          const age = reveal1(m, now, 0.12)
          lit[i + 1] = age < 0 ? 0 : Math.min(1, age / 600)
          const k = age < 0 ? 0 : smooth(age / 800)
          outlineMats[i]!.opacity = k * 0.95
          outlineGeos[i]!.forEach((o) => o.geo.setDrawRange(0, Math.ceil(o.n * k)))
        })
        if (base.at < 0 && ph.legs >= 4) base.at = now
        reveal1(base, now, 0.14)

        arcs.forEach((a, i) => reveal(a, (t - SCHEDULE[i]!.start) / SCHEDULE[i]!.travel))
        if (visitorArc) reveal(visitorArc, (t - T_VISITOR) / 900)

        // Exit: dive in while the screen fades.
        if (leaving.current) {
          if (!exitStart) exitStart = now
          if (now - exitStart >= 900) {
            cancelAnimationFrame(raf)
            onCloseRef.current()
            return
          }
        }

        scene.updateMatrixWorld()
        composer.render()

        // HTML overlays: country cards with leader lines, and the HUD ring around the globe.
        COUNTRIES.forEach((c, i) => {
          const card = cards.current[i]
          const line = leaders.current[i]
          if (!card || !line) return
          const world = markers[i]!.p.clone().applyMatrix4(globe.matrixWorld)
          const visible = shown.has(i) && world.clone().normalize().dot(camDir) < -0.15 && !leaving.current
          const [x, y] = toScreen(world)
          // Keep the card on screen when the camera is close.
          const cardX = Math.min(x + c.dx, w - 200)
          card.style.transform = `translate(${cardX}px, ${y + c.dy}px)`
          card.style.opacity = visible ? '1' : '0'
          line.setAttribute('x1', String(x))
          line.setAttribute('y1', String(y))
          line.setAttribute('x2', String(cardX + (c.dx < 0 ? 180 : 0)))
          line.setAttribute('y2', String(y + c.dy + 20))
          line.style.opacity = visible ? '0.6' : '0'
        })
        if (ring.current) {
          const centre = new Vector3().setFromMatrixPosition(globe.matrixWorld)
          right.setFromMatrixColumn(camera.matrixWorld, 0).multiplyScalar(R * 1.12).add(centre)
          const [cx2, cy2] = toScreen(centre.clone())
          const rr = Math.abs(toScreen(right)[0] - cx2)
          ring.current.setAttribute('transform', `translate(${cx2} ${cy2})`)
          ring.current.querySelectorAll('circle').forEach((circle, k) => circle.setAttribute('r', String(rr * (k === 0 ? 1 : 1.05))))
          ring.current.style.opacity = String(Math.min(1, t / 1500) * (leaving.current ? 0 : 1))
          if (ringLabel.current) {
            // Above the ring, unless the zoom pushes it under the top bar.
            ringLabel.current.setAttribute('y', String(-rr * 1.05 - 10))
            ringLabel.current.style.opacity = cy2 - rr * 1.05 - 10 > 96 ? '1' : '0'
            ringLabel.current.textContent = `LAT ${shot.lat.toFixed(1)}° · LON ${shot.lon.toFixed(1)}°`
          }
        }
      }
      raf = requestAnimationFrame(frame)

      return () => {
        cancelAnimationFrame(raf)
        window.removeEventListener('resize', resize)
        composer.dispose()
        renderer.dispose()
        ;[glow, ringTex].forEach((x) => x.dispose())
        ;[bodyGeo, atmoGeo, dotGeo, ...pillarGeos, ...outlineGeos.flat().map((o) => o.geo), ...arcs.map((a) => a.geo)].forEach((g) => g.dispose())
        ;[bodyMat, atmoMat, dotMat, ...pillarMats, ...outlineMats, ...arcMats].forEach((m) => m.dispose())
        renderer.domElement.remove()
      }
    }

    return () => {
      disposed = true
      cleanup()
    }
  }, [visitor, visitorKm])

  useEffect(() => {
    if (phase.done) enterRef.current?.focus()
  }, [phase.done])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCloseRef.current()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const enter = () => {
    leaving.current = true
    setExiting(true)
  }

  const shown = revealedCountries(phase)
  const ts = (ms: number) => `[${(ms / 1000).toFixed(2).padStart(5, '0')}]`
  const lang = profile.languages.map((l) => `${l.code.toUpperCase()} ${l.level === 'native' ? 'natif' : l.level}`).join(' · ')
  const coord = (v: number, pos: string, neg: string) => `${Math.abs(v).toFixed(1)}°${v >= 0 ? pos : neg}`

  return (
    <div
      ref={wrap}
      role="dialog"
      aria-modal="true"
      aria-label="Jérémie Nagi - introduction"
      className={cx('fixed inset-0 z-[2000] overflow-hidden bg-[#03060a] transition-opacity duration-700', exiting && 'opacity-0 delay-200')}
    >
      <p className="sr-only">
        Introduction animée : un scan OSINT mis en scène retrouve les sources publiques de Jérémie Nagi et les six pays où il a vécu. Le bouton Entrer ouvre le site.
      </p>

      {/* HUD: corners, ring around the globe, leader lines. */}
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full">
        <g ref={ring} className="opacity-0" fill="none">
          <circle stroke="rgba(148,163,184,0.18)" strokeWidth="1" />
          <circle stroke="rgba(63,182,200,0.35)" strokeWidth="1" strokeDasharray="2 10" className="origin-center animate-[spin_60s_linear_infinite] [transform-box:fill-box]" />
          <text ref={ringLabel} textAnchor="middle" className="fill-zinc-500 text-[11px] tracking-[0.2em]" />
        </g>
        {COUNTRIES.map((c, i) => (
          <line
            key={c.code}
            ref={(e) => {
              leaders.current[i] = e
            }}
            stroke="#4ade80"
            strokeWidth="1"
            className="opacity-0 transition-opacity duration-300"
          />
        ))}
      </svg>
      {(['top-4 left-4 border-t border-l', 'top-4 right-4 border-t border-r', 'bottom-4 left-4 border-b border-l', 'bottom-4 right-4 border-b border-r'] as const).map((p) => (
        <span key={p} aria-hidden="true" className={`pointer-events-none absolute size-6 border-zinc-600 ${p}`} />
      ))}

      {/* Country cards (positioned every frame). */}
      {COUNTRIES.map((c, i) => (
        <div
          key={c.code}
          ref={(e) => {
            cards.current[i] = e
          }}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 w-[180px] opacity-0 transition-opacity duration-300"
        >
          <div
            className={cx(
              'border border-l-2 border-white/10 border-l-cyber/80 bg-zinc-950/70 px-3 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-md',
              shown.has(i) && 'animate-[argos-pop_420ms_var(--ease-out)_both]',
            )}
          >
            <div className="flex items-center gap-2">
              <img src={c.flag} alt="" className="h-3 w-4 shrink-0 rounded-[1px] object-cover" />
              <span className="truncate text-[11px] font-bold tracking-[0.14em] text-zinc-50 uppercase">{c.name}</span>
            </div>
            <div className="mt-1 flex justify-between text-[10px] tracking-wider text-zinc-500">
              <span className="text-cyber">{c.note}</span>
              <span className="tabular-nums">
                {coord(c.lat, 'N', 'S')} {coord(c.lon, 'E', 'O')}
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* Top bar. */}
      <header className="absolute inset-x-10 top-8 flex items-center justify-between gap-6 text-xs tracking-[0.2em] text-zinc-500 uppercase">
        <div className="flex items-center gap-3">
          <ScanEye size={20} aria-hidden="true" className="text-cyber" />
          <span className="text-sm font-bold tracking-[0.35em] text-zinc-100">Argos</span>
          <span className="hidden xl:inline">moteur OSINT · mise en scène</span>
        </div>
        <div className="hidden items-center gap-2 lg:flex">
          cible <span className="text-zinc-200">Jérémie Nagi</span>
          <span className="text-zinc-700">|</span>
          consentement <Check size={13} aria-hidden="true" className="text-cyber" />
        </div>
        <div className="flex items-center gap-6">
          <span className="hidden tabular-nums md:inline">UTC {clock}</span>
          <button type="button" onClick={() => onCloseRef.current()} className="tracking-[0.2em] uppercase hover:text-zinc-200">
            Passer l’intro ⎋
          </button>
        </div>
      </header>
      <div aria-hidden="true" className="absolute inset-x-10 top-[4.25rem] h-px bg-white/10">
        <div className="h-px bg-cyber/80 transition-[width] duration-200" style={{ width: `${progress}%` }} />
      </div>

      {/* Scan log. */}
      <div aria-hidden="true" className={cx('absolute top-24 left-10 w-[32rem] text-[13px] leading-[1.6] text-zinc-400 transition-opacity duration-500', exiting && 'opacity-0')}>
        <p className="animate-[argos-in_500ms_steps(28)_both] text-zinc-200">
          <span className="text-cyber">❯</span> argos scan --cible &quot;Jérémie Nagi&quot; --consentement
        </p>
        <p className="text-zinc-600">cible consentante · sources publiées par l’intéressé</p>

        <LogTitle show={phase.sources > 0}>Sources publiques</LogTitle>
        {SOURCES.slice(0, phase.sources).map((s, i) => (
          <p key={s.host} className="flex animate-[argos-in_260ms_ease-out_both] gap-3">
            <span className="text-zinc-600 tabular-nums">{ts(T_SOURCES + i * SOURCE_STEP)}</span>
            <Check size={14} aria-hidden="true" className="mt-[3px] shrink-0 text-cyber" />
            <span className="w-48 shrink-0 truncate text-zinc-200">{s.host}</span>
            <span className="truncate">{s.finding}</span>
          </p>
        ))}

        <LogTitle show={phase.geo}>Géolocalisation · {shown.size} / 6 pays</LogTitle>
        <ul className="grid grid-cols-3 gap-x-3 gap-y-1">
          {COUNTRIES.map((c, i) =>
            shown.has(i) ? (
              <li key={c.code} className="flex animate-[argos-in_260ms_ease-out_both] items-center gap-2 truncate">
                <img src={c.flag} alt="" className="h-3 w-4 shrink-0 object-cover" />
                <span className="truncate text-zinc-200">{c.name}</span>
              </li>
            ) : null,
          )}
        </ul>

        <LogTitle show={phase.lang}>Langues</LogTitle>
        {phase.lang && <p className="animate-[argos-in_260ms_ease-out_both] text-zinc-200">{lang}</p>}

        <LogTitle show={phase.visitor}>Connexion visiteur</LogTitle>
        {phase.visitor && (
          <p className="animate-[argos-in_260ms_ease-out_both]">
            fuseau <span className="text-zinc-200">{tz}</span>
            {visitorKm != null && (
              <>
                {' '}
                · <span className="text-zinc-200">≈ {visitorKm.toLocaleString('fr-FR')} km</span> de Marseille (depuis {visitorCity})
              </>
            )}
          </p>
        )}
      </div>

      {/* Dossier + Entrer (Entrer works from the first second). */}
      <div className={cx('absolute bottom-10 left-10 w-[32rem] transition-opacity duration-500', exiting && 'opacity-0')}>
        <div className={cx('transition-[opacity,transform] duration-700', phase.done ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0')}>
          <p className="text-xs tracking-[0.3em] text-cyber uppercase">Dossier complet</p>
          <p className="mt-2 text-5xl leading-none font-black tracking-tighter text-white uppercase">
            Nagi <span className="text-cyber">Jérémie</span>
          </p>
          <p className="mt-3 text-lg font-bold tracking-tight uppercase">
            <span className="text-sky-400">Développeur IA</span> <span className="text-zinc-600">·</span> <span className="text-rose-500">Pentester junior</span>
          </p>
          <p className="mt-3 inline-flex items-center gap-2 text-sm text-zinc-200">
            <span aria-hidden="true" className="size-2 animate-pulse rounded-full bg-cyber shadow-[0_0_10px_var(--color-cyber)]" />
            Statut : {profile.availability.fr.toLowerCase()} · alternance · Marseille
          </p>
        </div>
        <button
          ref={enterRef}
          type="button"
          onClick={enter}
          className={cx(
            'mt-6 h-12 border px-12 text-sm tracking-[0.4em] uppercase transition-[box-shadow,border-color,color] duration-500 focus-visible:shadow-focus focus-visible:outline-none',
            phase.done ? 'border-cyber text-cyber shadow-[0_0_32px_-8px_var(--color-cyber)] hover:bg-cyber/10' : 'border-white/15 text-zinc-400 hover:border-white/30',
          )}
        >
          Entrer
        </button>
      </div>
    </div>
  )
}

function LogTitle({ show, children }: { show: boolean; children: ReactNode }) {
  if (!show) return null
  return <p className="mt-4 mb-1 animate-[argos-in_260ms_ease-out_both] text-[11px] tracking-[0.3em] text-zinc-500 uppercase">── {children}</p>
}
