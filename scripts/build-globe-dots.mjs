#!/usr/bin/env node
// Precomputes the Argos intro globe (style A: dotted globe lit by real city lights).
// - Dots: a Fibonacci lattice of N points, kept over land. Each dot stores its city-light
//   brightness (NASA Black Marble 2016, public domain: scripts/data/blackmarble-2016.webp)
//   and the lived-in country it falls in.
//   Binary layout (little-endian): Uint32 N, Uint32 count, then per dot
//   Uint16 lattice-index delta, Uint8 brightness (0–255), Uint8 country (index in COUNTRIES + 1, 0 = none).
// - Outlines: the rings of the lived-in countries, [lon, lat] rounded to 0.01°.
// Land and countries are rasterised once (equirectangular SVG → sharp) instead of testing each dot.
// Usage: node scripts/build-globe-dots.mjs   (world-atlas, topojson-client, d3-geo, sharp are dev deps)
import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { geoEquirectangular, geoPath } from 'd3-geo'
import sharp from 'sharp'
import { feature } from 'topojson-client'

const require = createRequire(import.meta.url)
const read = (f) => JSON.parse(readFileSync(require.resolve(`world-atlas/${f}`), 'utf8'))
const landTopo = read('land-110m.json')
const countriesTopo = read('countries-110m.json')
const land = feature(landTopo, landTopo.objects.land)
const allCountries = feature(countriesTopo, countriesTopo.objects.countries).features

// ISO 3166-1 numeric ids, same order as COUNTRIES in ArgosGate.tsx.
const COUNTRIES = ['250', '422', '682', '634', '124', '604'] // FR LB SA QA CA PE
// Metropolitan France only (the 110m France feature includes overseas territories).
const keepRing = (id, ring) => id !== '250' || ring.every(([lon, lat]) => lon > -6 && lat > 41)
const lived = COUNTRIES.map((id) => {
  const f = allCountries.find((c) => c.id === id)
  if (!f) throw new Error(`country ${id} not found`)
  const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates
  return { type: 'Feature', properties: {}, geometry: { type: 'MultiPolygon', coordinates: polys.filter((p) => keepRing(id, p[0])) } }
})

const W = 4096
const H = 2048
const path = geoPath(geoEquirectangular().scale(W / (2 * Math.PI)).translate([W / 2, H / 2]))
const raster = async (shapes) => {
  const body = shapes.map(({ d, fill }) => `<path d="${d}" fill="${fill}"/>`).join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" shape-rendering="crispEdges"><rect width="${W}" height="${H}" fill="#000"/>${body}</svg>`
  return (await sharp(Buffer.from(svg)).removeAlpha().raw().toBuffer({ resolveWithObject: true })).data
}
const landMask = await raster([{ d: path(land), fill: '#fff' }])
const countryMask = await raster(lived.map((f, k) => ({ d: path(f), fill: `rgb(${(k + 1) * 40},0,0)` })))
const lights = (
  await sharp(new URL('./data/blackmarble-2016.webp', import.meta.url).pathname).resize(W, H).removeAlpha().raw().toBuffer({ resolveWithObject: true })
).data

const N = 100000
const golden = Math.PI * (3 - Math.sqrt(5))
const out = []
let prev = 0
for (let i = 0; i < N; i++) {
  const y = 1 - (i / (N - 1)) * 2
  const lat = (Math.asin(y) * 180) / Math.PI
  const lon = ((((golden * i * 180) / Math.PI) % 360) + 540) % 360 - 180
  const px = Math.min(W - 1, Math.floor(((lon + 180) / 360) * W))
  const py = Math.min(H - 1, Math.floor(((90 - lat) / 180) * H))
  const k = (py * W + px) * 3
  if (landMask[k] < 128) continue
  const lum = Math.max(lights[k], lights[k + 1], lights[k + 2]) / 255
  const bright = Math.round(Math.min(1, Math.max(0, (lum - 0.12) * 1.6)) * 255)
  const country = Math.round(countryMask[k] / 40)
  if (i - prev > 65535) throw new Error('lattice gap too large for Uint16')
  out.push([i - prev, bright, country])
  prev = i
}
const buf = Buffer.alloc(8 + out.length * 4)
buf.writeUInt32LE(N, 0)
buf.writeUInt32LE(out.length, 4)
out.forEach(([d, b, c], j) => {
  buf.writeUInt16LE(d, 8 + j * 4)
  buf.writeUInt8(b, 10 + j * 4)
  buf.writeUInt8(c, 11 + j * 4)
})
const dotsFile = new URL('../src/sections/Gate/globeDots.bin', import.meta.url)
writeFileSync(dotsFile, buf)

const r2 = (v) => Math.round(v * 100) / 100
const outlines = lived.map((f) => f.geometry.coordinates.map((poly) => poly[0].map(([lon, lat]) => [r2(lon), r2(lat)])))
const outlinesFile = new URL('../src/sections/Gate/globeOutlines.json', import.meta.url)
writeFileSync(outlinesFile, JSON.stringify(outlines))

const perCountry = COUNTRIES.map((_, k) => out.filter((d) => d[2] === k + 1).length)
console.log(`${out.length} land dots (${buf.length} bytes), per country ${perCountry.join(' ')} → ${dotsFile.pathname}`)
