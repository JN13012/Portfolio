import { readFileSync } from 'node:fs'
import { gunzipSync } from 'node:zlib'
import { Quaternion, Vector3 } from 'three'
import { describe, expect, it } from 'vitest'
import { createCrustMotion, decodeCrust, plateAt, PLATE_COUNT, prepareCrustMotion, updateCrustMotion } from './globeCrust'
import { globePoint } from './journeyGeometry'

const bytes = gunzipSync(readFileSync(new URL('./globeCrust.bin', import.meta.url)))
const asset = decodeCrust(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer)

describe('solid continental crust', () => {
  it('has 66 closed thick regions within the previous 48-piece polygon and file budgets', () => {
    expect(PLATE_COUNT).toBe(66)
    expect(asset.geometry.index!.count / 3).toBeLessThanOrEqual(143256)
    expect(readFileSync(new URL('./globeCrust.bin', import.meta.url)).byteLength).toBeLessThanOrEqual(1325489)
    const position = asset.geometry.getAttribute('position')
    const plate = asset.geometry.getAttribute('aPlate')
    const kind = asset.geometry.getAttribute('aKind')
    const surfaces = Array.from({ length: PLATE_COUNT }, () => new Set<number>())
    let outer = 0, inner = Infinity, deepestInner = 0
    for (let i = 0; i < position.count; i++) {
      surfaces[plate.getX(i)]!.add(kind.getX(i))
      const radius = Math.hypot(position.getX(i), position.getY(i), position.getZ(i))
      if (kind.getX(i) === 0) outer = Math.max(outer, radius)
      if (kind.getX(i) === 1) { inner = Math.min(inner, radius); deepestInner = Math.max(deepestInner, radius) }
    }
    surfaces.forEach(kinds => expect([...kinds].sort()).toEqual([0, 1, 2]))
    expect(outer - inner).toBeGreaterThan(0.11)
    expect(outer - inner).toBeLessThan(0.126)
    expect(outer - deepestInner).toBeGreaterThan(0.094)
    expect(deepestInner - inner).toBeGreaterThan(0.005)
    expect(outer).toBeCloseTo(1.6 * 0.998, 3)
  })

  it('splits the two oversized Atlantic plates into substantial asymmetric pieces', () => {
    const indices = asset.geometry.index!, plate = asset.geometry.getAttribute('aPlate'), kind = asset.geometry.getAttribute('aKind')
    const position = asset.geometry.getAttribute('position')
    const faces = new Uint32Array(PLATE_COUNT), areas = new Float64Array(PLATE_COUNT)
    const a = new Vector3(), b = new Vector3(), c = new Vector3()
    for (let i = 0; i < indices.count; i += 3) {
      const vertex = indices.getX(i)
      if (kind.getX(vertex) !== 0) continue
      const id = plate.getX(vertex)
      faces[id]!++
      a.fromBufferAttribute(position, vertex)
      b.fromBufferAttribute(position, indices.getX(i + 1)).sub(a)
      c.fromBufferAttribute(position, indices.getX(i + 2)).sub(a)
      areas[id]! += b.cross(c).length() * 0.5
    }
    for (const [parent, child, original] of [[38, 64, 1758], [56, 65, 1344]]) {
      const total = areas[parent!]! + areas[child!]!
      expect(faces[parent!]! + faces[child!]!).toBe(original)
      expect(areas[child!]! / total).toBeGreaterThan(0.35)
      expect(areas[child!]! / total).toBeLessThan(0.45)
    }
  })

  it('closes every geometric edge of every piece, including coastline walls', () => {
    const position = asset.geometry.getAttribute('position')
    const plate = asset.geometry.getAttribute('aPlate')
    const indices = asset.geometry.index!
    const keys = Array.from({ length: position.count }, (_, i) => `${plate.getX(i)}/${Math.round(position.getX(i) * 1e5)},${Math.round(position.getY(i) * 1e5)},${Math.round(position.getZ(i) * 1e5)}`)
    const edges = new Map<string, { uses: number; winding: number }>()
    for (let i = 0; i < indices.count; i += 3) {
      const a = indices.getX(i), b = indices.getX(i + 1), c = indices.getX(i + 2)
      for (const [from, to] of [[a, b], [b, c], [c, a]]) {
        const first = keys[from!]!, second = keys[to!]!
        const key = first < second ? `${first}|${second}` : `${second}|${first}`
        const edge = edges.get(key) ?? { uses: 0, winding: 0 }
        edge.uses++; edge.winding += first < second ? 1 : -1
        edges.set(key, edge)
      }
    }
    // Islands can meet at the same sampled coastline vertex: each closed side must
    // still have an opposing edge, including where several solids touch.
    expect([...edges.values()].filter(edge => edge.uses < 2 || edge.uses % 2 !== 0 || edge.winding !== 0)).toEqual([])
  })

  it('fractures nearby countries independently along national boundaries', () => {
    for (const [lat, lon, expected] of [[47, 3, 0], [40, -4, 1], [40, -8, 2], [43, 12, 3], [51, 10, 4], [39, 35, 10], [31, -7, 13], [28, 2, 14], [26, 30, 16], [25, 45, 20], [40, 110, 24], [-15, -70, 33], [-32, 135, 36]]) {
      const p = globePoint(lat!, lon!)
      expect(plateAt(asset, p.x, p.y, p.z)).toBe(expected)
    }
  })

  it('keeps the map attached to the surface under the same rigid transform', () => {
    const motion = createCrustMotion()
    asset.centres.forEach((centre, i) => motion.centres[i]!.copy(centre))
    prepareCrustMotion(motion, globePoint(43.2965, 5.3698).normalize())
    updateCrustMotion(motion, 0.6)
    const map = globePoint(47, 3, 1.6)
    const surface = globePoint(47, 3, 1.6 * 0.998)
    const id = plateAt(asset, map.x, map.y, map.z)
    const rotation = motion.rotations[id]!
    const quaternion = new Quaternion(rotation.x, rotation.y, rotation.z, rotation.w)
    const apply = (point: Vector3) => point.sub(motion.centres[id]!).applyQuaternion(quaternion).add(motion.centres[id]!).add(motion.offsets[id]!)
    const originalGap = map.distanceTo(surface)
    expect(apply(map).distanceTo(apply(surface))).toBeCloseTo(originalGap, 10)
    expect(motion.offsets[id]!.length()).toBeGreaterThan(0.1)
  })

  it('opens slowly enough to read the fractures before separating neighbouring countries', () => {
    const motion = createCrustMotion()
    asset.centres.forEach((centre, i) => motion.centres[i]!.copy(centre))
    prepareCrustMotion(motion, globePoint(43.2965, 5.3698).normalize())
    updateCrustMotion(motion, 0)
    expect(motion.offsets.every(offset => offset.lengthSq() === 0)).toBe(true)
    updateCrustMotion(motion, 0.2)
    const early = motion.offsets[0]!.length()
    updateCrustMotion(motion, 0.5)
    const middle = motion.offsets[0]!.length()
    const gap = motion.offsets[0]!.distanceTo(motion.offsets[4]!)
    const rotationDifference = motion.rotations[0]!.clone().sub(motion.rotations[4]!).length()
    updateCrustMotion(motion, 1)
    expect(early / motion.offsets[0]!.length()).toBeLessThan(0.2)
    expect(middle / motion.offsets[0]!.length()).toBeGreaterThan(0.4)
    expect(middle / motion.offsets[0]!.length()).toBeLessThan(0.65)
    expect(gap).toBeGreaterThan(0.2)
    expect(rotationDifference).toBeGreaterThan(0.1)
    expect(motion.offsets.every(offset => Number.isFinite(offset.length()))).toBe(true)
  })
})
