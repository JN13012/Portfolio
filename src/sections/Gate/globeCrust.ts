import { BufferAttribute, BufferGeometry, Quaternion, Vector3, Vector4 } from 'three'
import crustUrl from './globeCrust.bin?url'
import metadata from './globeCrust.json'
import { clamp, GLOBE_RADIUS, smooth } from './journeyGeometry'

export const PLATE_COUNT = metadata.regions.length
export type CrustAsset = { geometry: BufferGeometry; centres: Vector3[]; labels: Uint8Array; width: number; height: number }

export async function loadCrust(signal: AbortSignal): Promise<CrustAsset> {
  const response = await fetch(crustUrl, { signal })
  if (!response.ok || !response.body) throw new Error('Crust geometry unavailable')
  const buffer = await new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer()
  if (signal.aborted) throw new DOMException('Crust loading cancelled', 'AbortError')
  return decodeCrust(buffer)
}

export function decodeCrust(buffer: ArrayBuffer): CrustAsset {
  const view = new DataView(buffer)
  if (view.getUint32(0, true) !== 0x43525354 || view.getUint32(4, true) !== 1 || view.getUint32(8, true) !== PLATE_COUNT) throw new Error('Invalid crust geometry')
  const width = view.getUint32(12, true), height = view.getUint32(16, true)
  const count = view.getUint32(20, true), indexCount = view.getUint32(24, true)
  if (buffer.byteLength !== 32 + PLATE_COUNT * 12 + width * height + count * 12 + indexCount * 4) throw new Error('Truncated crust geometry')
  let offset = 32
  const centres = Array.from({ length: PLATE_COUNT }, () => {
    const centre = new Vector3(view.getFloat32(offset, true), view.getFloat32(offset + 4, true), view.getFloat32(offset + 8, true))
    offset += 12
    return centre
  })
  const labels = new Uint8Array(buffer, offset, width * height).slice(); offset += labels.length
  const positions = new Float32Array(count * 3), normals = new Float32Array(count * 3)
  const plates = new Uint8Array(count), kinds = new Uint8Array(count), depths = new Uint8Array(count)
  for (let i = 0; i < count; i++, offset += 12) {
    for (let axis = 0; axis < 3; axis++) {
      positions[i * 3 + axis] = view.getInt16(offset + axis * 2, true) / 32767 * GLOBE_RADIUS
      normals[i * 3 + axis] = view.getInt8(offset + 6 + axis) / 127
    }
    plates[i] = view.getUint8(offset + 9); kinds[i] = view.getUint8(offset + 10); depths[i] = view.getUint8(offset + 11)
  }
  const indices = new Uint32Array(indexCount)
  for (let i = 0; i < indexCount; i++, offset += 4) indices[i] = view.getUint32(offset, true)
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  geometry.setAttribute('normal', new BufferAttribute(normals, 3))
  geometry.setAttribute('aPlate', new BufferAttribute(plates, 1))
  geometry.setAttribute('aKind', new BufferAttribute(kinds, 1))
  geometry.setAttribute('aDepth', new BufferAttribute(depths, 1, true))
  geometry.setIndex(new BufferAttribute(indices, 1))
  return { geometry, centres, labels, width, height }
}

export function plateAt(asset: CrustAsset, x: number, y: number, z: number) {
  const radius = Math.hypot(x, y, z)
  const lat = Math.asin(Math.max(-1, Math.min(1, y / radius))) * 180 / Math.PI
  const lon = Math.atan2(-z, x) * 180 / Math.PI
  const px = Math.max(0, Math.min(asset.width - 1, Math.floor((lon + 180) / 360 * asset.width)))
  const py = Math.max(0, Math.min(asset.height - 1, Math.floor((90 - lat) / 180 * asset.height)))
  return asset.labels[py * asset.width + px]!
}

export function createCrustMotion() {
  const centres = Array.from({ length: PLATE_COUNT }, () => new Vector3())
  const rotations = Array.from({ length: PLATE_COUNT }, () => new Vector4(0, 0, 0, 1))
  const offsets = Array.from({ length: PLATE_COUNT }, () => new Vector3())
  const visibility = new Float32Array(PLATE_COUNT).fill(1)
  // Pack visibility into translation.w to keep the poses within modest shader uniform budgets.
  const translations = Array.from({ length: PLATE_COUNT }, () => new Vector4(0, 0, 0, 1))
  const velocities = Array.from({ length: PLATE_COUNT }, () => new Vector3())
  const axes = Array.from({ length: PLATE_COUNT }, () => new Vector3())
  return { centres, rotations, offsets, visibility, translations, velocities, axes, angles: new Float32Array(PLATE_COUNT), delays: new Float32Array(PLATE_COUNT), proximities: new Float32Array(PLATE_COUNT), uniforms: { uPlateCentres: { value: centres }, uPlateRotations: { value: rotations }, uPlateOffsets: { value: translations } }, quaternion: new Quaternion() }
}
export type CrustMotion = ReturnType<typeof createCrustMotion>

/** Calculate the burst once, when the precomputed geometry arrives. */
export function prepareCrustMotion(motion: CrustMotion, source: Vector3) {
  const normal = new Vector3(), tangent = new Vector3(), side = new Vector3()
  const up = new Vector3(0, 1, 0)
  for (let i = 0; i < PLATE_COUNT; i++) {
    normal.copy(motion.centres[i]!).normalize()
    const proximity = normal.dot(source)
    const seed = ((i * 17 + 3) % 53) / 53
    const spin = Math.sin(i * 2.39996 + 1.7)
    tangent.copy(normal).addScaledVector(source, -proximity)
    if (tangent.lengthSq() < 0.0001) tangent.crossVectors(source, up)
    tangent.normalize()
    side.crossVectors(source, tangent).normalize()
    motion.velocities[i]!.copy(tangent).multiplyScalar(1.1 + seed * 0.95)
      .addScaledVector(side, spin * 0.65).addScaledVector(normal, (seed - 0.25) * 0.9)
    motion.axes[i]!.crossVectors(normal, motion.velocities[i]!).addScaledVector(normal, spin * 0.7).normalize()
    motion.angles[i] = (0.55 + seed) * (spin < 0 ? -1 : 1)
    motion.delays[i] = (1 - proximity) * 0.055 + seed * 0.06
    motion.proximities[i] = proximity
  }
}

/** Update only rigid poses; no geometry rebuilding, physics or per-frame allocations. */
export function updateCrustMotion(motion: CrustMotion, progress: number) {
  for (let i = 0; i < PLATE_COUNT; i++) {
    const delay = motion.delays[i]!
    const phase = clamp((progress - delay) / (0.95 - delay))
    // Let the fractures become readable before the pieces travel across the screen.
    const amount = smooth(phase)
    // The hidden hemisphere clears first so the camera does not meet the back of the shell.
    motion.visibility[i] = 1 - smooth((progress - 0.06) / 0.3) * (1 - smooth((motion.proximities[i]! + 0.1) / 0.65))
    motion.offsets[i]!.copy(motion.velocities[i]!).multiplyScalar(amount)
    const offset = motion.offsets[i]!
    motion.translations[i]!.set(offset.x, offset.y, offset.z, motion.visibility[i]!)
    motion.quaternion.setFromAxisAngle(motion.axes[i]!, amount * motion.angles[i]!)
    motion.rotations[i]!.set(motion.quaternion.x, motion.quaternion.y, motion.quaternion.z, motion.quaternion.w)
  }
}

export const CRUST_MOTION = /* glsl */ `
  attribute float aPlate;
  uniform vec3 uPlateCentres[${PLATE_COUNT}];
  uniform vec4 uPlateRotations[${PLATE_COUNT}];
  uniform vec4 uPlateOffsets[${PLATE_COUNT}];
  vec3 rotatePlate(vec3 v, vec4 q) { return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v); }
  vec3 crustPosition(vec3 p) {
    int plate = int(aPlate + 0.5);
    return uPlateCentres[plate] + rotatePlate(p - uPlateCentres[plate], uPlateRotations[plate]) + uPlateOffsets[plate].xyz;
  }
  vec3 crustNormal(vec3 n) { return rotatePlate(n, uPlateRotations[int(aPlate + 0.5)]); }
  float crustVisibility() { return uPlateOffsets[int(aPlate + 0.5)].w; }
`

export const CRUST_VERT = /* glsl */ `
  attribute float aKind; attribute float aDepth;
  varying vec3 vNormal; varying vec3 vView; varying vec3 vLocal; varying float vKind; varying float vDepth; varying float vVisibility;
  ${CRUST_MOTION}
  void main() {
    vec4 mv = modelViewMatrix * vec4(crustPosition(position), 1.0);
    vNormal = normalize(normalMatrix * crustNormal(normal));
    vView = normalize(-mv.xyz);
    vLocal = position;
    vKind = aKind; vDepth = aDepth;
    vVisibility = crustVisibility();
    gl_Position = projectionMatrix * mv;
  }
`
