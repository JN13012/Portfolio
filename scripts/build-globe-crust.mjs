// Build closed, thick spherical regions. Geography comes from the existing world-atlas data.
import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { gzipSync } from 'node:zlib'
import { IcosahedronGeometry, Vector3 } from 'three'
import { geoCentroid, geoEquirectangular, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import sharp from 'sharp'

const require = createRequire(import.meta.url)
const atlas = JSON.parse(readFileSync(require.resolve('world-atlas/countries-110m.json'), 'utf8'))
const countries = feature(atlas, atlas.objects.countries).features
const W = 1024, H = 512, R = 1.6, THICKNESS = 0.11
const OUTER = R * 0.998
const NAMES = ['France', 'Spain', 'Portugal', 'Italy', 'Germany', 'Britain and Ireland', 'Northern Europe', 'Central Europe', 'Balkans and Greece', 'Eastern Europe', 'Turkey', 'Western Russia', 'Eastern Russia', 'Morocco and Western Sahara', 'Algeria', 'Tunisia and Libya', 'Egypt', 'West and Central Africa', 'East Africa', 'Southern Africa', 'Arabian Peninsula', 'Levant and Mesopotamia', 'Iran and Central Asia', 'Indian subcontinent', 'China and Mongolia', 'Japan and Korea', 'Southeast Asia', 'Western Canada', 'Eastern Canada', 'Western United States', 'Eastern United States', 'Mexico Central America and Caribbean', 'Brazil and Guianas', 'Andean countries', 'Southern South America', 'Greenland', 'Oceania', 'Antarctica', 'Northwest Atlantic', 'Northeast Atlantic', 'South Atlantic', 'Northwest Pacific', 'Northeast Pacific', 'South Pacific', 'Western Indian Ocean', 'Eastern Indian Ocean', 'Arctic Ocean', 'Southern Ocean']
NAMES.push('Central Russia', 'Southern China', 'Southern India', 'Northern Brazil', 'Northern Australia', 'Northern Canada', 'Central Africa', 'Patagonia', 'Northern Atlantic Ridge', 'Equatorial Atlantic', 'Southwest Atlantic', 'Western Equatorial Pacific', 'Eastern Equatorial Pacific', 'Southwest Pacific', 'Northern Indian Ocean', 'Southern Indian Ocean')
NAMES.push('Upper Northwest Atlantic', 'Eastern Northern Atlantic Ridge')
if (NAMES.length !== 66) throw new Error('The fragment budget is 66 regions')
// Continuous 3D fields avoid seams at the dateline and poles. Everything is baked offline.
const hash = (x, y, z) => {
  let n = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 2147483647)
  n = Math.imul(n ^ (n >>> 13), 1274126177)
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295 * 2 - 1
}
const noise = (x, y, z) => {
  const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z)
  const fade = t => t * t * (3 - 2 * t)
  const u = fade(x - ix), v = fade(y - iy), w = fade(z - iz)
  const mix = (a, b, t) => a + (b - a) * t
  const plane = dz => mix(mix(hash(ix, iy, iz + dz), hash(ix + 1, iy, iz + dz), u), mix(hash(ix, iy + 1, iz + dz), hash(ix + 1, iy + 1, iz + dz), u), v)
  return mix(plane(0), plane(1), w)
}
const field = (p, scale, seed) => noise(p.x * scale + seed, p.y * scale + seed * 0.71, p.z * scale - seed * 0.43)
const fault = p => field(p, 3.7, 11) * 5 + field(p, 12.3, 23) * 1.5
const AFRICA = new Set('012 024 072 108 120 132 140 148 174 178 180 204 226 231 232 262 266 270 288 324 384 404 426 430 434 450 454 466 478 480 504 508 516 562 566 624 646 654 678 686 690 694 706 710 716 728 729 732 748 768 788 800 818 834 854 894'.split(' '))
const OCEANIA = new Set('036 090 242 540 548 554 598 626'.split(' '))
const inIds = (id, text) => text.split(' ').includes(id)
const countryCentres = countries.map(country => geoCentroid(country))
const countryRegion = (country, lon, lat, centre, p) => {
  const id = country.id
  const [cx, cy] = centre
  if (id === '250') return lon < -25 ? 32 : 0
  if (id === '724') return 1
  if (id === '620') return 2
  if (id === '380') return 3
  if (id === '276') return 4
  if (inIds(id, '826 372')) return 5
  if (inIds(id, '208 246 352 578 752')) return 6
  if (inIds(id, '040 056 203 348 442 528 703 756')) return 7
  if (inIds(id, '008 070 100 191 300 499 688 705 807') || country.properties.name === 'Kosovo') return 8
  if (inIds(id, '112 233 428 440 498 616 642 804')) return 9
  if (id === '792') return 10
  if (id === '643') { const split = fault(p); return lon < 57 + split ? 11 : lon < 112 + split ? 48 : 12 }
  if (AFRICA.has(id)) {
    if (inIds(id, '504 732')) return 13
    if (id === '012') return 14
    if (inIds(id, '434 788')) return 15
    if (id === '818') return 16
    return cy < -10 || id === '450' ? 19 : cx < 12 ? 17 : cx < 29 ? 54 : 18
  }
  if (inIds(id, '048 414 512 634 682 784 887')) return 20
  if (inIds(id, '275 368 376 400 422 760')) return 21
  if (inIds(id, '004 031 051 268 364 398 417 586 762 795 860')) return 22
  if (inIds(id, '050 064 144 356 524')) return lat < 19 + fault(p) * 0.55 ? 50 : 23
  if (inIds(id, '156 496')) return lat < 32 + fault(p) * 0.65 ? 49 : 24
  if (inIds(id, '158 392 408 410')) return 25
  if (id === '124') return lat > 63 + fault(p) * 0.5 ? 53 : lon < -100 + fault(p) ? 27 : 28
  if (id === '840') return lon < -100 + fault(p) ? 29 : 30
  if (inIds(id, '076 328 740')) return lat > -10 + fault(p) * 0.6 ? 51 : 32
  if (inIds(id, '152 170 218 604 862')) return 33
  if (inIds(id, '032 068 238 600 858')) return lat < -40 + fault(p) * 0.5 ? 55 : 34
  if (id === '304') return 35
  if (OCEANIA.has(id)) return id === '036' && lat > -24 + fault(p) * 0.6 ? 52 : 36
  if (id === '010' || id === '260') return 37
  if (cx < -25 && cx > -170) return 31
  if (cy < -10 && (cx > 105 || cx < -170)) return 36
  if (cy > 34 && cx < 60 && cx > -30) return 9
  return cx > 92 ? 26 : 22
}
const path = geoPath(geoEquirectangular().scale(W / (2 * Math.PI)).translate([W / 2, H / 2]))
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" shape-rendering="crispEdges"><rect width="${W}" height="${H}" fill="#000"/>${countries.map((country, i) => `<path d="${path(country)}" fill="rgb(${i + 1},0,0)"/>`).join('')}</svg>`
const raster = (await sharp(Buffer.from(svg)).removeAlpha().raw().toBuffer({ resolveWithObject: true })).data
const vec = (lat, lon) => {
  const a = lat * Math.PI / 180, b = lon * Math.PI / 180
  return new Vector3(Math.cos(a) * Math.cos(b), Math.sin(a), -Math.cos(a) * Math.sin(b))
}
const oceans = [[38, 28, -55], [39, 28, -20], [40, -27, -18], [41, 28, 160], [42, 28, -132], [43, -30, -132], [44, -22, 57], [45, -22, 100], [46, 83, 20], [47, -62, 15], [56, 48, -40], [57, 0, -30], [58, -42, -40], [59, 0, 158], [60, 0, -112], [61, -40, 174], [62, 12, 65], [63, -50, 90]].map(([id, lat, lon]) => ({ id, p: vec(lat, lon) }))
const labels = new Uint8Array(W * H)
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const lat = 90 - (y + 0.5) / H * 180, lon = (x + 0.5) / W * 360 - 180
  const tag = raster[(y * W + x) * 3]
  const point = vec(lat, lon)
  let id
  if (tag > 0) id = countryRegion(countries[tag - 1], lon, lat, countryCentres[tag - 1], point)
  else {
    // Warp the cell boundaries at two scales instead of cutting along straight great circles.
    const warped = point.clone()
    for (const [axis, seed] of [['x', 3], ['y', 17], ['z', 31]]) warped[axis] += field(point, 3.2, seed) * 0.13 + field(point, 11.7, seed + 5) * 0.035
    warped.normalize()
    let best = -Infinity
    for (const ocean of oceans) { const dot = warped.dot(ocean.p); if (dot > best) { best = dot; id = ocean.id } }
  }
  labels[y * W + x] = id
}
// Split only the two oversized plates visible above/left of Marseille. A weighted
// quantile makes substantial 60/40 pieces without moving the other ocean boundaries.
for (const { parent, child, axis, seed } of [
  { parent: 38, child: 64, axis: new Vector3(0, 1, 0.16).normalize(), seed: 79 },
  { parent: 56, child: 65, axis: new Vector3(0.173, 0.401, -0.9).normalize(), seed: 113 },
]) {
  const samples = []
  let totalArea = 0
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const index = y * W + x
    if (labels[index] !== parent) continue
    const lat = 90 - (y + 0.5) / H * 180, lon = (x + 0.5) / W * 360 - 180
    const point = vec(lat, lon), area = Math.cos(lat * Math.PI / 180)
    const score = point.dot(axis) + field(point, 6.1, seed) * 0.035 + field(point, 18.7, seed + 17) * 0.009
    samples.push({ index, score, area }); totalArea += area
  }
  samples.sort((a, b) => a.score - b.score)
  let area = 0
  for (const sample of samples) {
    area += sample.area
    if (area > totalArea * 0.6) labels[sample.index] = child
  }
}
const regionAt = point => {
  const lat = Math.asin(Math.max(-1, Math.min(1, point.y / point.length()))) * 180 / Math.PI
  const lon = Math.atan2(-point.z, point.x) * 180 / Math.PI
  const x = Math.max(0, Math.min(W - 1, Math.floor((lon + 180) / 360 * W)))
  const y = Math.max(0, Math.min(H - 1, Math.floor((90 - lat) / 180 * H)))
  return labels[y * W + x]
}

// More fractures, fewer base polygons than the previous continental version.
const ico = new IcosahedronGeometry(1, 53)
const attribute = ico.getAttribute('position')
const points = [], pointMap = new Map(), faces = []
for (let i = 0; i < attribute.count; i += 3) {
  const face = []
  for (let j = 0; j < 3; j++) {
    const p = new Vector3().fromBufferAttribute(attribute, i + j).normalize()
    const key = p.toArray().map(v => Math.round(v * 1e6)).join(',')
    let index = pointMap.get(key)
    if (index === undefined) { index = points.length; points.push(p); pointMap.set(key, index) }
    face.push(index)
  }
  const centre = points[face[0]].clone().add(points[face[1]]).add(points[face[2]]).multiplyScalar(1 / 3)
  faces.push({ ids: face, plate: regionAt(centre) })
}
ico.dispose()

const edgeMap = new Map()
for (const { ids: [a, b, c], plate } of faces) for (const [from, to] of [[a, b], [b, c], [c, a]]) {
  const key = from < to ? `${from}/${to}` : `${to}/${from}`
  if (!edgeMap.has(key)) edgeMap.set(key, [])
  edgeMap.get(key).push({ from, to, plate })
}
// Relax shared coastlines on the sphere so the fracture follows flowing land shapes.
const neighbours = new Map()
for (const edges of edgeMap.values()) {
  if (edges.length !== 2) throw new Error(`Non-manifold sphere edge: ${edges.length}`)
  if (edges[0].plate === edges[1].plate) continue
  const { from, to } = edges[0]
  if (!neighbours.has(from)) neighbours.set(from, new Set())
  if (!neighbours.has(to)) neighbours.set(to, new Set())
  neighbours.get(from).add(to); neighbours.get(to).add(from)
}
for (let pass = 0; pass < 3; pass++) {
  const changes = new Map()
  for (const [index, adjacent] of neighbours) {
    if (adjacent.size !== 2) continue
    const average = new Vector3()
    for (const other of adjacent) average.add(points[other])
    average.multiplyScalar(1 / adjacent.size)
    changes.set(index, points[index].clone().multiplyScalar(0.65).addScaledVector(average, 0.35).normalize())
  }
  for (const [index, point] of changes) points[index] = point
}

// Shared vertices keep both sides interlocking. Uneven inner rock adds depth without more triangles.
const innerPoints = points.map((p, i) => {
  if (neighbours.has(i)) {
    const tangent = new Vector3(field(p, 19, 7), field(p, 19, 29), field(p, 19, 43))
    tangent.addScaledVector(p, -tangent.dot(p))
    p.addScaledVector(tangent, 0.0025).normalize()
  }
  const thickness = THICKNESS * (1 + field(p, 4.1, 37) * 0.1 + field(p, 21, 53) * 0.04)
  const rough = new Vector3(field(p, 15, 13), field(p, 15, 41), field(p, 15, 67))
  rough.addScaledVector(p, -rough.dot(p))
  return p.clone().addScaledVector(rough, 0.004).normalize().multiplyScalar(OUTER - thickness)
})

const vertices = [], indices = [], vertexMap = new Map()
const centres = NAMES.map(() => new Vector3()), areas = new Array(NAMES.length).fill(0)
const addVertex = (position, normal, plate, kind, depth) => {
  vertices.push({ position, normal, plate, kind, depth })
  return vertices.length - 1
}
const surfaceVertex = (index, plate, inside) => {
  const key = `${index}/${plate}/${inside}`
  let result = vertexMap.get(key)
  if (result === undefined) {
    const position = inside ? innerPoints[index].clone() : points[index].clone().multiplyScalar(OUTER)
    const normal = position.clone().normalize().multiplyScalar(inside ? -1 : 1)
    result = addVertex(position, normal, plate, inside ? 1 : 0, inside ? 1 : 0)
    vertexMap.set(key, result)
  }
  return result
}
for (const { ids: [a, b, c], plate } of faces) {
  indices.push(surfaceVertex(a, plate, false), surfaceVertex(b, plate, false), surfaceVertex(c, plate, false))
  indices.push(surfaceVertex(c, plate, true), surfaceVertex(b, plate, true), surfaceVertex(a, plate, true))
  const centre = points[a].clone().add(points[b]).add(points[c]).multiplyScalar(OUTER / 3)
  centres[plate].add(centre); areas[plate]++
}
let boundaries = 0
for (const edges of edgeMap.values()) {
  if (edges.length !== 2) throw new Error(`Non-manifold sphere edge: ${edges.length}`)
  if (edges[0].plate === edges[1].plate) continue
  boundaries++
  for (const { from, to, plate } of edges) {
    const a = points[from].clone().multiplyScalar(OUTER), b = points[to].clone().multiplyScalar(OUTER)
    const ai = innerPoints[from], bi = innerPoints[to]
    const n = ai.clone().sub(a).cross(b.clone().sub(a)).normalize()
    const start = vertices.length
    addVertex(a, n, plate, 2, 0); addVertex(ai, n, plate, 2, 1)
    addVertex(b, n, plate, 2, 0); addVertex(bi, n, plate, 2, 1)
    indices.push(start, start + 1, start + 2, start + 2, start + 1, start + 3)
  }
}
centres.forEach((centre, i) => { if (!areas[i]) throw new Error(`Empty region ${NAMES[i]}`); centre.multiplyScalar(1 / areas[i]) })

const HEADER = 32, META = NAMES.length * 12, stride = 12
const buffer = Buffer.alloc(HEADER + META + labels.length + vertices.length * stride + indices.length * 4)
const header = [0x43525354, 1, NAMES.length, W, H, vertices.length, indices.length, boundaries]
header.forEach((value, i) => buffer.writeUInt32LE(value, i * 4))
let offset = HEADER
centres.forEach(centre => centre.toArray().forEach(value => { buffer.writeFloatLE(value, offset); offset += 4 }))
Buffer.from(labels).copy(buffer, offset); offset += labels.length
for (const vertex of vertices) {
  vertex.position.toArray().forEach((v, i) => buffer.writeInt16LE(Math.round(v / R * 32767), offset + i * 2))
  vertex.normal.toArray().forEach((v, i) => buffer.writeInt8(Math.round(v * 127), offset + 6 + i))
  buffer.writeUInt8(vertex.plate, offset + 9); buffer.writeUInt8(vertex.kind, offset + 10); buffer.writeUInt8(Math.round(vertex.depth * 255), offset + 11)
  offset += stride
}
indices.forEach(index => { buffer.writeUInt32LE(index, offset); offset += 4 })
const compressed = gzipSync(buffer, { level: 9 })
writeFileSync(new URL('../src/sections/Gate/globeCrust.bin', import.meta.url), compressed)
writeFileSync(new URL('../src/sections/Gate/globeCrust.json', import.meta.url), JSON.stringify({ radius: R, outerRadius: OUTER, thickness: THICKNESS, regions: NAMES.map((name, i) => ({ name, faces: areas[i], centre: centres[i].toArray() })), surfaceFaces: faces.length, vertices: vertices.length, indices: indices.length, boundaries, bytes: compressed.length }, null, 2) + '\n')
console.log(JSON.stringify({ regions: NAMES.length, faces: faces.length, vertices: vertices.length, boundaries, rawBytes: buffer.length, compressedBytes: compressed.length }))
