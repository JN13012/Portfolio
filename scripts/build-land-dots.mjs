#!/usr/bin/env node
// Precomputes the dots of the gate globe: points spread evenly on a sphere
// (Fibonacci lattice), kept only over land. Output: [lat, lon] pairs ×10, rounded.
// Usage: node scripts/build-land-dots.mjs   (world-atlas, topojson-client, d3-geo are dev deps)
import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { geoContains } from 'd3-geo'
import { feature } from 'topojson-client'

const require = createRequire(import.meta.url)
const topo = JSON.parse(readFileSync(require.resolve('world-atlas/land-110m.json'), 'utf8'))
const land = feature(topo, topo.objects.land)

const N = 14000
const golden = Math.PI * (3 - Math.sqrt(5))
const dots = []
for (let i = 0; i < N; i++) {
  const y = 1 - (i / (N - 1)) * 2
  const lat = (Math.asin(y) * 180) / Math.PI
  const lon = ((((golden * i * 180) / Math.PI) % 360) + 540) % 360 - 180
  if (geoContains(land, [lon, lat])) dots.push(Math.round(lat * 10), Math.round(lon * 10))
}
const out = new URL('../src/sections/Gate/landDots.json', import.meta.url)
writeFileSync(out, JSON.stringify(dots))
console.log(`${dots.length / 2} land dots → ${out.pathname}`)
