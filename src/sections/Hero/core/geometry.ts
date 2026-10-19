// Astrolabe geometry, in SVG user units (viewBox -500 -500 1000 1000).

export const RADIUS = {
  outer: 480,
  nav: 440,
  ticks: 392,
  ringB: 345,
  orbit: 318,
  shield: 282,
  iris: 232,
} as const

export const SHIELD_SEGMENTS = 12
export const IRIS_BLADES = 8

/** Iris aperture (distance of each blade's edge from the centre). */
export const APERTURE = {
  open: RADIUS.iris * 0.86,
  attack: RADIUS.iris * 0.3,
  closed: RADIUS.iris * 0.2,
}

/** Navigation nodes, 72° apart, IA and Cyber on top. Degrees, clockwise from 3 o'clock. */
export const NODE_ANGLES = [-126, -54, 18, 90, 162] as const

export const deg = (d: number) => (d * Math.PI) / 180

export function polar(r: number, angle: number): [number, number] {
  return [r * Math.cos(angle), r * Math.sin(angle)]
}

const f = (n: number) => n.toFixed(2)

/** Circular arc from a0 to a1 (radians, clockwise). */
export function arcPath(r: number, a0: number, a1: number) {
  const [x0, y0] = polar(r, a0)
  const [x1, y1] = polar(r, a1)
  const large = a1 - a0 > Math.PI ? 1 : 0
  return `M${f(x0)} ${f(y0)} A${r} ${r} 0 ${large} 1 ${f(x1)} ${f(y1)}`
}

/**
 * One iris blade: the circular cap of radius `outer` cut by a chord at distance
 * `aperture` from the centre, facing `normal`. The caps of all blades leave a
 * regular polygon of inradius `aperture` open in the middle.
 */
export function bladePath(outer: number, aperture: number, normal: number) {
  const half = Math.acos(Math.min(1, Math.max(-1, aperture / outer)))
  const [x1, y1] = polar(outer, normal - half)
  const [x2, y2] = polar(outer, normal + half)
  return `M${f(x1)} ${f(y1)} A${outer} ${outer} 0 0 1 ${f(x2)} ${f(y2)} Z`
}

/** Blade normals twist as the iris closes, like a real diaphragm. */
export function bladeNormal(index: number, aperture: number) {
  const twist = 0.9 * (1 - aperture / RADIUS.iris)
  return (index / IRIS_BLADES) * Math.PI * 2 + twist
}

/** Index of the shield segment hit at `angle` (radians). */
export function shieldSegmentAt(angle: number) {
  const tau = Math.PI * 2
  const a = ((angle % tau) + tau) % tau
  return Math.floor(a / (tau / SHIELD_SEGMENTS)) % SHIELD_SEGMENTS
}
