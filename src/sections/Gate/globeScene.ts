import {
  AdditiveBlending, BackSide, BufferAttribute, BufferGeometry, CanvasTexture,
  Color, Euler, Group, LineBasicMaterial, LineSegments, Mesh, MeshBasicMaterial,
  PerspectiveCamera, Points, Quaternion, Scene, ShaderMaterial, SphereGeometry,
  Sprite, SpriteMaterial, TubeGeometry, Vector3, WebGLRenderer,
} from 'three'
import { introJourney as journey } from '../../content/intro'
import { afterLoadIdle } from '../../lib/afterLoad'
import { clamp, DIVE_DURATION, divePosition, GLOBE_RADIUS as R, globePoint, JourneyArc, JOURNEY_SCHEDULE, journeyAt, portfolioWindowAt, smooth, TOUR_END, TOUR_START, trailAt, TRAIL_DURATION } from './journeyGeometry'
import dotsUrl from './globeDots.bin?url'
import outlines from './globeOutlines.json'
import { createCrustMotion, CRUST_MOTION, CRUST_VERT, loadCrust, plateAt, prepareCrustMotion, updateCrustMotion } from './globeCrust'

export type GlobeControls = { time: number; leaving: boolean; reduced: boolean; transitionScale: number; inspectionTime: number | null; invalidate?: () => void }
type Options = {
  host: HTMLDivElement
  cover: HTMLDivElement | null
  portfolio: HTMLDivElement | null
  controls: GlobeControls
  annotation: HTMLDivElement | null
  signal: AbortSignal
  onStep: (step: number) => void
  onClose: () => void
  onPortfolioVisible?: () => void
}

const VERT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`
const BODY_FRAG = /* glsl */ `
  varying vec3 vNormal; varying vec3 vView;
  varying vec3 vLocal; varying float vKind; varying float vDepth; varying float vVisibility;
  uniform float uBreak;
  void main() {
    vec3 normal = normalize(vNormal);
    float daylight = max(0.0, dot(normal, normalize(vec3(-0.6, 0.9, 1.0))));
    float rim = pow(1.0 - max(0.0, dot(normal, normalize(vView))), 3.0);
    vec3 color = mix(vec3(0.008, 0.016, 0.025), vec3(0.026, 0.051, 0.072), daylight);
    color += vec3(0.025, 0.06, 0.085) * rim;
    if (vKind > 0.5) {
      float grain = fract(sin(dot(vLocal * 420.0, vec3(12.9898, 78.233, 43.71))) * 43758.5453);
      float strata = sin(vDepth * 61.0 + grain * 1.2 + sin(dot(vLocal, vec3(19.0, 11.0, 23.0))) * 1.2 + sin(dot(vLocal, vec3(47.0, -31.0, 13.0))) * 0.38) * 0.5 + 0.5;
      vec3 rock = mix(vec3(0.012, 0.016, 0.019), vec3(0.085, 0.092, 0.09), strata * 0.5 + grain * 0.2);
      color = rock * (0.35 + daylight * 1.2);
      if (vKind > 1.5) {
        float lip = 1.0 - smoothstep(0.0, 0.065, vDepth);
        color += vec3(0.10, 0.32, 0.19) * lip * smoothstep(0.0, 0.18, uBreak);
      }
    }
    float alpha = vVisibility * (1.0 - smoothstep(0.82, 1.0, uBreak));
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(color, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`
const INTACT_FRAG = /* glsl */ `
  varying vec3 vNormal; varying vec3 vView;
  void main() {
    float rim = pow(1.0 - max(0.0, dot(normalize(vNormal), normalize(vView))), 3.2);
    float day = max(0.0, dot(normalize(vNormal), normalize(vec3(-1.0, 0.8, 0.7))));
    vec3 body = mix(vec3(0.006, 0.012, 0.021), vec3(0.014, 0.031, 0.048), day);
    gl_FragColor = vec4(body + vec3(0.035, 0.08, 0.12) * rim, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`
const ATMOSPHERE_FRAG = /* glsl */ `
  varying vec3 vNormal; varying vec3 vView;
  uniform float uBreak;
  void main() {
    float edge = pow(clamp(0.73 + dot(normalize(vNormal), normalize(vView)), 0.0, 1.0), 3.5);
    gl_FragColor = vec4(0.23, 0.48, 0.68, edge * 0.27 * (1.0 - smoothstep(0.0, 0.45, uBreak)));
    #include <colorspace_fragment>
  }
`
const DOT_VERT = /* glsl */ `
  attribute float aBright; attribute float aCountry;
  uniform float uLit[7]; uniform float uDpr; uniform float uReveal;
  uniform vec3 uAccent;
  varying vec3 vColor; varying float vAlpha;
  uniform float uBreak;
  ${CRUST_MOTION}
  void main() {
    vec4 mv = modelViewMatrix * vec4(crustPosition(position), 1.0);
    vec3 n = normalize(normalMatrix * crustNormal(normalize(position)));
    float facing = dot(n, normalize(-mv.xyz));
    float lit = uLit[int(aCountry + 0.5)];
    vColor = mix(mix(vec3(0.19, 0.28, 0.36), vec3(0.85, 0.87, 0.79), aBright), uAccent, lit * 0.65);
    vAlpha = (0.38 + 0.6 * aBright + 0.15 * lit) * smoothstep(0.02, 0.32, facing) * uReveal * crustVisibility() * (1.0 - smoothstep(0.82, 1.0, uBreak));
    gl_PointSize = min(7.0 * uDpr, uDpr * (1.5 + aBright * 1.3 + lit * 0.25) * (7.4 / -mv.z));
    gl_Position = projectionMatrix * mv;
  }
`
const DOT_FRAG = /* glsl */ `
  varying vec3 vColor; varying float vAlpha;
  void main() {
    float radius = length(gl_PointCoord - 0.5);
    if (radius > 0.5) discard;
    gl_FragColor = vec4(vColor, vAlpha * (1.0 - smoothstep(0.22, 0.5, radius)));
    #include <colorspace_fragment>
  }
`

const TRAIL_VERT = /* glsl */ `
  varying float vProgress;
  void main() {
    vProgress = uv.x;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const TRAIL_FRAG = /* glsl */ `
  varying float vProgress;
  uniform float uHead; uniform float uTail; uniform float uOpacity;
  uniform vec3 uColor;
  void main() {
    if (vProgress > uHead || vProgress < uTail) discard;
    float feather = smoothstep(uTail, min(uHead + 0.001, uTail + 0.18), vProgress);
    gl_FragColor = vec4(uColor, feather * uOpacity);
    #include <colorspace_fragment>
  }
`

function glowTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 64
  const context = canvas.getContext('2d')!
  const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.12, 'rgba(255,255,255,0.9)')
  gradient.addColorStop(0.35, 'rgba(255,255,255,0.24)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  context.fillStyle = gradient
  context.fillRect(0, 0, 64, 64)
  return new CanvasTexture(canvas)
}

function rotationFor(point: Vector3) {
  return new Quaternion().setFromEuler(new Euler(Math.asin(point.y / point.length()), -Math.atan2(point.x, point.z), 0))
}

export async function createGlobeScene({ host, cover, portfolio, controls, annotation, signal, onStep, onClose, onPortfolioVisible }: Options) {
  const response = await fetch(dotsUrl, { signal })
  if (!response.ok) throw new Error('Globe data unavailable')
  const buffer = await response.arrayBuffer()
  if (signal.aborted) return () => {}
  const view = new DataView(buffer)
  const latticeCount = view.getUint32(0, true)
  const count = view.getUint32(4, true)
  if (buffer.byteLength !== 8 + count * 4 || latticeCount < 2) throw new Error('Invalid globe data')

  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
  const diagnostics = import.meta.env.DEV ? document.getElementById('root') : null
  if (diagnostics) {
    diagnostics.dataset.introActiveScenes = String(Number(diagnostics.dataset.introActiveScenes ?? 0) + 1)
    diagnostics.dataset.introLoopState = 'running'
  }
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
  renderer.setPixelRatio(dpr)
  renderer.setClearColor(0x000000, 0)
  renderer.domElement.setAttribute('aria-hidden', 'true')
  host.append(renderer.domElement)
  const scene = new Scene()
  const camera = new PerspectiveCamera(38, 1, 0.02, 60)
  camera.position.set(0, 0, 7.4)
  const globe = new Group()
  scene.add(globe)
  const accent = new Color(getComputedStyle(host).getPropertyValue('--color-cyber').trim() || '#4ade80')
  const texture = glowTexture()
  const geometries: BufferGeometry[] = []
  const materials: Array<ShaderMaterial | MeshBasicMaterial | LineBasicMaterial | SpriteMaterial> = []
  const geometry = <T extends BufferGeometry>(value: T): T => { geometries.push(value); return value }
  const material = <T extends typeof materials[number]>(value: T): T => { materials.push(value); return value }
  let spriteGeometry: BufferGeometry | null = null
  const ownSprite = (sprite: Sprite) => {
    // Three shares this geometry globally; own one buffer so cleanup cannot affect other scenes.
    spriteGeometry ??= geometry(sprite.geometry.clone())
    sprite.geometry = spriteGeometry
    return sprite
  }
  const breakUniform = { value: 0 }
  const source = globePoint(journey[0]!.lat, journey[0]!.lon).normalize()
  const crustMotion = createCrustMotion()
  const mappedGeometries: Array<{ geometry: BufferGeometry; segments: boolean }> = []
  let shell: Mesh<BufferGeometry, ShaderMaterial> | null = null
  let disposed = false
  let cancelWarmup = () => {}
  // Start only after the base data and renderer succeed, so a failed opening
  // cannot leave an unowned decoded crust in the background.
  const crustTask = loadCrust(signal).catch(error => {
    if (import.meta.env.DEV && !signal.aborted) host.dataset.crustError = error instanceof Error ? error.message : String(error)
    return null
  })
  const intact = new Mesh(geometry(new SphereGeometry(R * 0.998, 96, 64)), material(new ShaderMaterial({ vertexShader: VERT, fragmentShader: INTACT_FRAG })))
  globe.add(intact)
  const atmosphere = new Mesh(geometry(new SphereGeometry(R * 1.04, 64, 48)), material(new ShaderMaterial({ vertexShader: VERT, fragmentShader: ATMOSPHERE_FRAG, uniforms: { uBreak: breakUniform }, side: BackSide, transparent: true, depthWrite: false, blending: AdditiveBlending })))
  globe.add(atmosphere)

  const positions = new Float32Array(count * 3)
  const brightness = new Float32Array(count)
  const countries = new Float32Array(count)
  const golden = Math.PI * (3 - Math.sqrt(5))
  let latticeIndex = 0
  for (let i = 0; i < count; i++) {
    latticeIndex += view.getUint16(8 + i * 4, true)
    const lat = Math.asin(1 - latticeIndex / (latticeCount - 1) * 2) * 180 / Math.PI
    const lon = ((golden * latticeIndex * 180 / Math.PI % 360) + 540) % 360 - 180
    globePoint(lat, lon).toArray(positions, i * 3)
    brightness[i] = view.getUint8(10 + i * 4) / 255
    countries[i] = view.getUint8(11 + i * 4)
  }
  const dotGeo = geometry(new BufferGeometry())
  dotGeo.setAttribute('position', new BufferAttribute(positions, 3))
  dotGeo.setAttribute('aBright', new BufferAttribute(brightness, 1))
  dotGeo.setAttribute('aCountry', new BufferAttribute(countries, 1))
  dotGeo.setAttribute('aPlate', new BufferAttribute(new Uint8Array(count), 1))
  mappedGeometries.push({ geometry: dotGeo, segments: false })
  const lit = new Array<number>(7).fill(0)
  const dotMat = material(new ShaderMaterial({ vertexShader: DOT_VERT, fragmentShader: DOT_FRAG, uniforms: { uLit: { value: lit }, uDpr: { value: dpr }, uReveal: { value: 0 }, uAccent: { value: accent }, uBreak: breakUniform, ...crustMotion.uniforms }, transparent: true, depthWrite: false }))
  const land = new Points(dotGeo, dotMat)
  land.frustumCulled = false
  globe.add(land)

  // Muted geographic graticule, hidden naturally by the solid globe.
  const gridMaterial = material(new LineBasicMaterial({ color: '#6d8ea6', transparent: true, opacity: 0.075 }))
  const gridPoints: Vector3[] = []
  for (let lat = -60; lat <= 60; lat += 30) {
    for (let i = 1; i <= 180; i++) gridPoints.push(globePoint(lat, (i - 1) * 2 - 180, R * 1.001), globePoint(lat, i * 2 - 180, R * 1.001))
  }
  for (let lon = -180; lon < 180; lon += 30) {
    for (let i = 1; i <= 90; i++) gridPoints.push(globePoint((i - 1) * 2 - 90, lon, R * 1.001), globePoint(i * 2 - 90, lon, R * 1.001))
  }
  const grid = new LineSegments(geometry(new BufferGeometry().setFromPoints(gridPoints)), gridMaterial)
  globe.add(grid)

  const outlineObjects: LineSegments[] = []
  const outlineMaterials = (outlines as number[][][][]).map((rings) => {
    const mat = material(new ShaderMaterial({
      vertexShader: `${CRUST_MOTION}\nvarying float vVisibility;\nvoid main() { vVisibility = crustVisibility(); gl_Position = projectionMatrix * modelViewMatrix * vec4(crustPosition(position), 1.0); }`,
      fragmentShader: 'uniform vec3 uColor; uniform float uOpacity; varying float vVisibility; void main() { gl_FragColor = vec4(uColor, uOpacity * vVisibility);\n#include <colorspace_fragment>\n}',
      uniforms: { uColor: { value: accent }, uOpacity: { value: 0 }, ...crustMotion.uniforms }, transparent: true,
    }))
    const vertices: Vector3[] = []
    rings.forEach((ring) => {
      for (let i = 1; i < ring.length; i++) {
        const a = ring[i - 1]!, b = ring[i]!
        vertices.push(globePoint(a[1]!, a[0]!, R * 1.002), globePoint(b[1]!, b[0]!, R * 1.002))
      }
    })
    const geo = geometry(new BufferGeometry().setFromPoints(vertices))
    geo.setAttribute('aPlate', new BufferAttribute(new Uint8Array(vertices.length), 1))
    mappedGeometries.push({ geometry: geo, segments: true })
    const border = new LineSegments(geo, mat); border.frustumCulled = false; globe.add(border)
    outlineObjects.push(border)
    return mat
  })
  void crustTask.then(asset => {
    if (!asset) { if (import.meta.env.DEV) host.dataset.crustStatus = 'fallback'; return }
    if (disposed || signal.aborted) { asset.geometry.dispose(); return }
    asset.centres.forEach((centre, i) => crustMotion.centres[i]!.copy(centre))
    prepareCrustMotion(crustMotion, source)
    shell = new Mesh(geometry(asset.geometry), material(new ShaderMaterial({ vertexShader: CRUST_VERT, fragmentShader: BODY_FRAG, uniforms: { uBreak: breakUniform, ...crustMotion.uniforms }, transparent: true })))
    shell.frustumCulled = false; shell.visible = false; globe.add(shell)
    for (const mapped of mappedGeometries) {
      const positions = mapped.geometry.getAttribute('position')
      const plateAttribute = mapped.geometry.getAttribute('aPlate') as BufferAttribute
      const ids = plateAttribute.array as Uint8Array
      for (let i = 0; i < positions.count; i += mapped.segments ? 2 : 1) {
        let x = positions.getX(i), y = positions.getY(i), z = positions.getZ(i)
        if (mapped.segments) { x = (x + positions.getX(i + 1)) / 2; y = (y + positions.getY(i + 1)) / 2; z = (z + positions.getZ(i + 1)) / 2 }
        ids[i] = plateAt(asset, x, y, z)
        if (mapped.segments) ids[i + 1] = ids[i]!
      }
      plateAttribute.needsUpdate = true
    }
    if (import.meta.env.DEV) { host.dataset.crustStatus = 'ready'; host.dataset.crustPieces = String(asset.centres.length); delete host.dataset.crustError }
    // Region lookup is no longer needed after the map has been attached.
    asset.labels = new Uint8Array(0)
    // Compile the hidden crust while idle, so its shader need not be compiled during the burst.
    cancelWarmup = afterLoadIdle(() => {
      if (disposed || signal.aborted || !shell) return
      void renderer.compileAsync(shell, camera, scene).then(() => {
        if (import.meta.env.DEV && !disposed) host.dataset.crustShader = 'ready'
      }).catch(() => {
        // Ordinary rendering can still compile on demand if prewarming is unavailable.
        if (import.meta.env.DEV && !disposed) host.dataset.crustShader = 'on-demand'
      })
    })
  })
  const markerGeometry = geometry(new SphereGeometry(0.011, 12, 8))
  const stops = journey.slice(0, 6).map((stop) => {
    const point = globePoint(stop.lat, stop.lon, R * 1.008)
    const mat = material(new MeshBasicMaterial({ color: accent, transparent: true, opacity: 0 }))
    const marker = new Mesh(markerGeometry, mat)
    marker.position.copy(point)
    const glowMat = material(new SpriteMaterial({ map: texture, color: accent, transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false }))
    const glow = ownSprite(new Sprite(glowMat))
    glow.position.copy(point)
    glow.scale.setScalar(0.16)
    globe.add(marker, glow)
    return { point, mat, marker, glowMat, glow }
  })
  const arcs = journey.slice(1).map((stop, i) => {
    const from = journey[i]!
    const curve = new JourneyArc(globePoint(from.lat, from.lon), globePoint(stop.lat, stop.lon))
    const geo = geometry(new TubeGeometry(curve, 128, 0.0032, 6, false))
    geo.setDrawRange(0, 0)
    const makeTrailMaterial = () => material(new ShaderMaterial({
      vertexShader: TRAIL_VERT, fragmentShader: TRAIL_FRAG,
      uniforms: { uHead: { value: 0 }, uTail: { value: 0 }, uOpacity: { value: 0 }, uColor: { value: accent } },
      transparent: true, depthWrite: false, blending: AdditiveBlending,
    }))
    const mat = makeTrailMaterial()
    const mesh = new Mesh(geo, mat)
    globe.add(mesh)
    // A wider transparent tube supplies a subtle halo without a full-screen bloom pass.
    const haloGeo = geometry(new TubeGeometry(curve, 128, 0.012, 5, false))
    haloGeo.setDrawRange(0, 0)
    const haloMat = makeTrailMaterial()
    const halo = new Mesh(haloGeo, haloMat)
    globe.add(halo)
    return { curve, geo, haloGeo, mat, haloMat, mesh, halo, materials: [mat, haloMat] }
  })
  const headMat = material(new SpriteMaterial({ map: texture, color: '#ecfff3', transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false }))
  const head = ownSprite(new Sprite(headMat))
  head.scale.setScalar(0.12)
  globe.add(head)

  const initial = rotationFor(globePoint(journey[0]!.lat, journey[0]!.lon))
  globe.quaternion.copy(initial)
  const targetRotation = new Quaternion()
  const local = new Vector3()
  const world = new Vector3()
  const normal = new Vector3()
  const viewDirection = new Vector3()
  const projected = new Vector3()
  const exitFromPosition = new Vector3()
  const diveTarget = globePoint(journey[0]!.lat, journey[0]!.lon)
  const worldDiveTarget = new Vector3()
  const cameraAim = new Vector3()
  const rotations = journey.map((stop) => rotationFor(globePoint(stop.lat, stop.lon)))
  const annotationPoints = journey.map(stop => globePoint(stop.lat, stop.lon, R * 1.015))
  const journeyState = { legIndex: 0, travel: 0, step: 0 }
  const trailState = { head: 0, tail: 0, opacity: 0 }
  const stillTrail = { head: 0, tail: 0, opacity: 0 }
  const windowState = { scale: 0, opacity: 0, edge: 0 }
  let portfolioRevealed = false
  let width = 1
  let height = 1
  let lensShift = 1
  let globeX = 0.5
  let globeY = 0.5
  let requestRender = () => {}
  const frameCamera = () => {
    camera.setViewOffset(width, height, width * (0.5 - globeX) * lensShift, height * (0.5 - globeY) * lensShift, width, height)
  }
  const resize = () => {
    width = Math.max(1, host.clientWidth)
    height = Math.max(1, host.clientHeight)
    const style = getComputedStyle(host)
    globeX = parseFloat(style.getPropertyValue('--gate-globe-x')) / 100
    globeY = parseFloat(style.getPropertyValue('--gate-globe-y')) / 100
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    if (!controls.leaving) {
      // Cap the globe diameter on tall, narrow desktops to preserve the left text column.
      const fitDistance = Math.hypot(R, height * R / (width * 0.45 * Math.tan(camera.fov * Math.PI / 360)))
      camera.position.set(0, 0, Math.max(7.4, fitDistance))
    }
    frameCamera()
    camera.updateProjectionMatrix()
    requestRender()
  }
  const observer = new ResizeObserver(resize)
  observer.observe(host)
  resize()

  let raf = 0
  let last = performance.now()
  let elapsed = 0
  let lastStep = -1
  let exitElapsed = -1
  let closed = false
  let frames = 0
  let peakDrawCalls = 0
  let peakTriangles = 0
  let lastBreak = -1
  // Development-only samples: never allocate profiling buffers in production.
  const cpuSamples = diagnostics ? new Float32Array(2048) : null
  const intervalSamples = diagnostics ? new Float32Array(2048) : null
  const diveCpuSamples = diagnostics ? new Float32Array(2048) : null
  const diveIntervalSamples = diagnostics ? new Float32Array(2048) : null
  let sampleCount = 0
  let diveSampleCount = 0
  const publishPerformance = () => {
    if (!diagnostics || !cpuSamples || !intervalSamples || !sampleCount) return
    const cpu = Array.from(cpuSamples.subarray(0, sampleCount)).sort((a, b) => a - b)
    const intervals = Array.from(intervalSamples.subarray(0, sampleCount)).sort((a, b) => a - b)
    const p95 = Math.ceil(sampleCount * 0.95) - 1
    const result: Record<string, number> = { samples: sampleCount, cpuP95Ms: +cpu[p95]!.toFixed(2), frameIntervalP95Ms: +intervals[p95]!.toFixed(2), peakDrawCalls, peakTriangles }
    if (diveCpuSamples && diveIntervalSamples && diveSampleCount) {
      const cpu = Array.from(diveCpuSamples.subarray(0, diveSampleCount)).sort((a, b) => a - b)
      const intervals = Array.from(diveIntervalSamples.subarray(0, diveSampleCount)).sort((a, b) => a - b)
      const p95 = Math.ceil(diveSampleCount * 0.95) - 1
      result.diveSamples = diveSampleCount
      result.diveCpuP95Ms = +cpu[p95]!.toFixed(2)
      result.diveFrameIntervalP95Ms = +intervals[p95]!.toFixed(2)
    }
    diagnostics.dataset.introPerformance = JSON.stringify(result)
  }
  const frame = (now: number) => {
    if (disposed) return
    const cpuStart = diagnostics ? performance.now() : 0
    // Wall-clock timing keeps the journey and camera move consistent at lower frame rates.
    const delta = Math.max(0, now - last)
    last = now
    const visible = !document.hidden
    if (!visible) { raf = 0; return }
    const running = visible && !controls.reduced
    if (running && !controls.leaving) controls.time += delta
    if (visible) elapsed += delta
    const time = controls.time
    const { legIndex, travel, step } = journeyAt(time, journeyState)
    if (step !== lastStep) { lastStep = step; onStep(step) }

    if (controls.leaving && exitElapsed < 0) {
      exitElapsed = 0
      exitFromPosition.copy(camera.position)
      // Freeze the globe exactly where the visitor clicked; fly the camera to Marseille.
      worldDiveTarget.copy(diveTarget).applyQuaternion(globe.quaternion)
    }
    if (exitElapsed >= 0) {
      if (visible) exitElapsed = Math.min(controls.inspectionTime ?? Infinity, exitElapsed + delta * controls.transitionScale)
      const flight = clamp(exitElapsed / DIVE_DURATION)
      // Approach Marseille first, keep advancing through the fracture, then complete the dive.
      divePosition(exitFromPosition, worldDiveTarget, flight, camera.position)
      if (portfolio) {
        const window = portfolioWindowAt(exitElapsed, camera.position.length(), windowState)
        portfolio.style.setProperty('--portal-y', '0px')
        portfolio.style.setProperty('--portal-scale', window.scale.toFixed(6))
        portfolio.style.setProperty('--portal-opacity', window.opacity.toFixed(5))
        portfolio.style.setProperty('--portal-edge', window.edge.toFixed(5))
        if (!portfolioRevealed && window.opacity >= 1) {
          portfolioRevealed = true
          onPortfolioVisible?.()
        }
      }
      if (import.meta.env.DEV) {
        host.dataset.diveDistance = camera.position.length().toFixed(4)
        host.dataset.diveElapsed = exitElapsed.toFixed(0)
      }
      cameraAim.copy(worldDiveTarget).multiplyScalar(smooth(flight))
      camera.lookAt(cameraAim)
      lensShift = 1 - smooth(flight)
      frameCamera()
      breakUniform.value = clamp((exitElapsed - 800) / 1800)
      if (breakUniform.value !== lastBreak) { updateCrustMotion(crustMotion, breakUniform.value); lastBreak = breakUniform.value }
      if (exitElapsed >= DIVE_DURATION && !closed) { closed = true; onClose(); return }
    } else {
      targetRotation.slerpQuaternions(rotations[legIndex]!, rotations[legIndex + 1]!, travel)
      if (running) globe.quaternion.copy(targetRotation)
    }

    dotMat.uniforms.uReveal!.value = controls.reduced ? 1 : smooth(elapsed / 450)
    const mapFade = 1 - smooth(breakUniform.value * 3)
    const outlineFade = 0.48 * (1 - smooth((breakUniform.value - 0.82) / 0.18))
    stops.forEach((marker, index) => {
      const arrival = index === 0 ? 0 : JOURNEY_SCHEDULE[index - 1]!.arrival
      const reveal = controls.reduced ? 1 : smooth((time - arrival + 130) / 450)
      lit[index + 1] = reveal
      outlineMaterials[index]!.uniforms.uOpacity!.value = reveal * outlineFade
      outlineObjects[index]!.visible = outlineMaterials[index]!.uniforms.uOpacity!.value > 0
      marker.mat.opacity = reveal * mapFade
      marker.glowMat.opacity = reveal * mapFade * (index === step || step === 6 && index === 0 ? 0.95 : 0.5)
      marker.marker.visible = marker.mat.opacity > 0
      marker.glow.visible = marker.glowMat.opacity > 0
      marker.glow.scale.setScalar(index === step || step === 6 && index === 0 ? 0.19 : 0.12)
    })
    const exitFade = exitElapsed < 0 ? 1 : 1 - smooth(exitElapsed / 450)
    arcs.forEach((arc, index) => {
      if (!exitFade) { arc.mesh.visible = arc.halo.visible = false; return }
      const trail = controls.reduced ? stillTrail : trailAt(time, index, trailState)
      const opacity = trail.opacity * exitFade
      if (opacity <= 0 || trail.head <= trail.tail) {
        arc.mesh.visible = arc.halo.visible = false
        return
      }
      const start = Math.floor(trail.tail * 128)
      const length = Math.max(0, Math.ceil(trail.head * 128) - start)
      arc.geo.setDrawRange(start * 6 * 6, length * 6 * 6)
      arc.haloGeo.setDrawRange(start * 5 * 6, length * 5 * 6)
      arc.mesh.visible = arc.halo.visible = length > 0
      for (const mat of arc.materials) {
        mat.uniforms.uHead!.value = trail.head
        mat.uniforms.uTail!.value = trail.tail
        mat.uniforms.uOpacity!.value = opacity * (mat === arc.mat ? 0.95 : 0.08)
      }
    })
    headMat.opacity = time >= TOUR_START && time < TOUR_END && travel < 1 && exitElapsed < 0 ? 0.95 : 0
    head.visible = headMat.opacity > 0
    if (head.visible) arcs[legIndex]!.curve.getPoint(travel, head.position)

    gridMaterial.opacity = 0.075 * (1 - smooth(breakUniform.value * 3))
    grid.visible = gridMaterial.opacity > 0
    atmosphere.visible = breakUniform.value < 0.45
    land.visible = breakUniform.value < 1
    intact.visible = shell ? breakUniform.value < 0.002 : exitElapsed < 1600
    if (shell) shell.visible = !intact.visible && breakUniform.value < 1

    // render() updates world matrices; avoid a second scene traversal here.
    renderer.render(scene, camera)
    frames++
    peakDrawCalls = Math.max(peakDrawCalls, renderer.info.render.calls)
    peakTriangles = Math.max(peakTriangles, renderer.info.render.triangles)
    if (cover && exitElapsed >= 1100) {
      // The real page grows behind the canvas; the backdrop stays opaque outside its frame.
      cover.classList.add('is-opening')
    }
    // CSS hides this label on small screens and throughout the dive.
    if (annotation && width > 800 && exitElapsed < 0) {
      local.copy(annotationPoints[step]!)
      world.copy(local).applyMatrix4(globe.matrixWorld)
      normal.copy(local).normalize().applyQuaternion(globe.quaternion)
      viewDirection.copy(camera.position).sub(world).normalize()
      projected.copy(world).project(camera)
      const x = (projected.x + 1) * width / 2
      const y = (1 - projected.y) * height / 2
      const show = normal.dot(viewDirection) > 0.15 && x > 15 && x < width - 185 && y > 65 && y < height - 30
      annotation.style.opacity = show ? '1' : '0'
      if (show) annotation.style.transform = `translate(${x + 8}px, ${y - 5}px)`
    }
    if (cpuSamples && intervalSamples && sampleCount < cpuSamples.length) {
      cpuSamples[sampleCount] = performance.now() - cpuStart
      intervalSamples[sampleCount] = delta
      sampleCount++
    }
    if (exitElapsed >= 0 && diveCpuSamples && diveIntervalSamples && diveSampleCount < diveCpuSamples.length) {
      diveCpuSamples[diveSampleCount] = performance.now() - cpuStart
      diveIntervalSamples[diveSampleCount] = delta
      diveSampleCount++
    }
    const inspectionHeld = controls.inspectionTime !== null && exitElapsed >= controls.inspectionTime
    if (inspectionHeld || !controls.leaving && (controls.reduced || time >= TOUR_END + TRAIL_DURATION + 450)) {
      raf = 0
      if (diagnostics) { diagnostics.dataset.introLoopState = 'idle'; diagnostics.dataset.introFrameCount = String(frames) }
      publishPerformance()
      return
    }
    raf = requestAnimationFrame(frame)
  }
  const lost = (event: Event) => { event.preventDefault(); onClose() }
  const wake = () => {
    if (!disposed && !document.hidden && !raf) {
      last = performance.now(); raf = requestAnimationFrame(frame)
      if (diagnostics) diagnostics.dataset.introLoopState = 'running'
    }
  }
  const visibilityChanged = () => {
    if (document.hidden) {
      cancelAnimationFrame(raf)
      raf = 0
      if (diagnostics) diagnostics.dataset.introLoopState = 'paused'
    } else wake()
  }
  requestRender = wake
  controls.invalidate = wake
  renderer.domElement.addEventListener('webglcontextlost', lost)
  document.addEventListener('visibilitychange', visibilityChanged)
  wake()

  return () => {
    if (disposed) return
    disposed = true
    cancelAnimationFrame(raf)
    cancelWarmup()
    observer.disconnect()
    renderer.domElement.removeEventListener('webglcontextlost', lost)
    document.removeEventListener('visibilitychange', visibilityChanged)
    geometries.forEach((item) => item.dispose())
    materials.forEach((item) => item.dispose())
    texture.dispose()
    globe.clear()
    scene.clear()
    renderer.renderLists.dispose()
    renderer.dispose()
    renderer.forceContextLoss()
    renderer.domElement.remove()
    geometries.length = 0; materials.length = 0; mappedGeometries.length = 0
    stops.length = 0; arcs.length = 0; outlineObjects.length = 0; annotationPoints.length = 0
    if (controls.invalidate === wake) delete controls.invalidate
    if (portfolio) {
      for (const property of ['--portal-y', '--portal-scale', '--portal-opacity', '--portal-edge']) portfolio.style.removeProperty(property)
    }
    if (diagnostics) {
      diagnostics.dataset.introActiveScenes = String(Math.max(0, Number(diagnostics.dataset.introActiveScenes ?? 1) - 1))
      diagnostics.dataset.introLoopState = 'stopped'
      diagnostics.dataset.introFrameCount = String(frames)
      diagnostics.dataset.introGpuGeometries = String(renderer.info.memory.geometries)
      diagnostics.dataset.introGpuTextures = String(renderer.info.memory.textures)
      diagnostics.dataset.introPeakDrawCalls = String(peakDrawCalls)
      publishPerformance()
    }
  }
}
