import { Curve, Vector3 } from 'three'

export const GLOBE_RADIUS = 1.6
export const TOUR_START = 450
export const DIVE_DURATION = 3000
export const TRAIL_DURATION = 620
// Short regional hops move quickly; large changes of viewpoint have time to ease.
const LEG_TIMINGS = [[430, 120], [390, 120], [360, 140], [1400, 140], [1000, 140], [1350, 280]]
export const JOURNEY_SCHEDULE = (() => {
  let start = TOUR_START
  return LEG_TIMINGS.map(([travel = 0, hold = 0]) => {
    const leg = { start, travel, arrival: start + travel, end: start + travel + hold }
    start = leg.end
    return leg
  })
})()
export const TOUR_END = JOURNEY_SCHEDULE.at(-1)!.arrival

export function journeyAt(time: number, target = { legIndex: 0, travel: 0, step: 0 }) {
  const index = Math.max(0, JOURNEY_SCHEDULE.findIndex((leg) => time < leg.end))
  const legIndex = time >= TOUR_END ? JOURNEY_SCHEDULE.length - 1 : index
  const leg = JOURNEY_SCHEDULE[legIndex]!
  const travel = smooth((time - leg.start) / leg.travel)
  target.legIndex = legIndex; target.travel = travel; target.step = time <= TOUR_START ? 0 : legIndex + 1
  return target
}

export function trailAt(time: number, index: number, target = { head: 0, tail: 0, opacity: 0 }) {
  const leg = JOURNEY_SCHEDULE[index]!
  const head = smooth((time - leg.start) / leg.travel)
  const tail = smooth((time - leg.start - TRAIL_DURATION) / leg.travel)
  const opacity = 1 - smooth((time - leg.arrival) / TRAIL_DURATION)
  target.head = head; target.tail = tail; target.opacity = opacity
  return target
}

export const clamp = (n: number) => Math.max(0, Math.min(1, n))
export const smooth = (n: number) => { const k = clamp(n); return k * k * (3 - 2 * k) }

// Progress, logarithmic distance travelled, and slope. Match the slopes at each
// join so the camera advances before the fracture and never pauses while it opens.
const DIVE_APPROACH = [[0, 0, 0], [0.25, 0.14, 0.5], [0.65, 0.32, 0.8], [1, 1, 0]] as const
export function diveApproach(progress: number) {
  const p = clamp(progress)
  for (let i = 1; i < DIVE_APPROACH.length; i++) {
    const [start, from, slopeFrom] = DIVE_APPROACH[i - 1]!
    const [end, to, slopeTo] = DIVE_APPROACH[i]!
    if (p > end) continue
    const span = end - start, t = (p - start) / span
    return (2 * t ** 3 - 3 * t ** 2 + 1) * from + (t ** 3 - 2 * t ** 2 + t) * span * slopeFrom
      + (-2 * t ** 3 + 3 * t ** 2) * to + (t ** 3 - t ** 2) * span * slopeTo
  }
  return 1
}

/** Perspective size of the real page behind Marseille, reaching the viewport at the dive's end. */
export function portfolioWindowAt(elapsed: number, cameraDistance: number, target = { scale: 0, opacity: 0, edge: 0 }) {
  const depth = GLOBE_RADIUS * 0.2
  const landingDistance = GLOBE_RADIUS + 0.026
  const scale = clamp((landingDistance - depth) / Math.max(landingDistance - depth, cameraDistance - depth))
  target.scale = scale; target.opacity = smooth((elapsed - 1100) / 350); target.edge = 1 - smooth((scale - 0.72) / 0.28)
  return target
}

export function globePoint(lat: number, lon: number, radius = GLOBE_RADIUS) {
  const latitude = lat * Math.PI / 180
  const longitude = lon * Math.PI / 180
  return new Vector3(radius * Math.cos(latitude) * Math.cos(longitude), radius * Math.sin(latitude), -radius * Math.cos(latitude) * Math.sin(longitude))
}

/** Continuous flight from the captured camera position to the unchanged globe. */
export function divePosition(from: Vector3, destination: Vector3, progress: number, target = new Vector3(), radialApproach = diveApproach(progress)) {
  const k = smooth(progress)
  const fromRadius = from.length(), destinationRadius = destination.length()
  const angle = Math.acos(Math.max(-1, Math.min(1, from.dot(destination) / (fromRadius * destinationRadius))))
  const sin = Math.sin(angle)
  const a = Math.abs(sin) < 0.0001 ? (1 - k) / fromRadius : Math.sin((1 - k) * angle) / (sin * fromRadius)
  const b = Math.abs(sin) < 0.0001 ? k / destinationRadius : Math.sin(k * angle) / (sin * destinationRadius)
  // Read all source components before writing the reusable target, even if it aliases an input.
  target.set(from.x * a + destination.x * b, from.y * a + destination.y * b, from.z * a + destination.z * b).normalize()
  // Approach the surface progressively, staying outside it throughout the flight.
  const approach = clamp(radialApproach)
  return target.multiplyScalar(Math.exp(Math.log(fromRadius) * (1 - approach) + Math.log(GLOBE_RADIUS + 0.026) * approach))
}

/** Great-circle interpolation with a radial lift: even long arcs stay above Earth. */
export class JourneyArc extends Curve<Vector3> {
  private a: Vector3
  private b: Vector3
  private angle: number
  private lift: number

  constructor(from: Vector3, to: Vector3) {
    super()
    this.a = from.clone().normalize()
    this.b = to.clone().normalize()
    this.angle = Math.acos(Math.max(-1, Math.min(1, this.a.dot(this.b))))
    this.lift = 0.055 + Math.min(0.32, this.angle * 0.2)
  }

  getPoint(t: number, target = new Vector3()) {
    const k = clamp(t)
    const sin = Math.sin(this.angle)
    if (Math.abs(sin) < 0.0001) target.copy(this.a).lerp(this.b, k).normalize()
    else target.copy(this.a).multiplyScalar(Math.sin((1 - k) * this.angle) / sin).addScaledVector(this.b, Math.sin(k * this.angle) / sin)
    return target.multiplyScalar(GLOBE_RADIUS * 1.006 + Math.sin(k * Math.PI) * this.lift)
  }
}
