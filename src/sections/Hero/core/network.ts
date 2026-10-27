// The hero network: settings, labels and graph layout (no DOM, no WebGL). Rendered by
// NeuralNet.tsx in the hero, and tuned live in the dev tool mockups.html?view=reseau.
import { Vector3 } from 'three'

// ── Settings ────────────────────────────────────────────────────────────────

export type NetworkMotion = 'fixed' | 'drift' | 'pointer'
/** one: a single wall before the outputs · two: a thinner wall on each side of the model (input and output filters). */
export type NetworkGuards = 'one' | 'two'

export const NETWORK_DEFAULTS = {
  inputs: 3,
  hiddenLayers: 2,
  rows: 3,
  depth: 3,
  guardRows: 2,
  guardDepth: 2,
  guards: 'one' as NetworkGuards,
  embedding: false,
  embedSize: 10,
  /** Vectors side by side in depth: 1 = a single vector, = inputs = one vector per input token. */
  embedDepth: 1,
  embedSpread: 2.4,
  /** A dot-matrix plate behind the embedding too (it is a table of vectors). */
  embedPlate: true,
  /** The vector's first values, shown above the embedding and renewed by each request that crosses it. */
  embedNumbers: true,
  gapX: 1.55,
  gapY: 1.15,
  gapZ: 0.95,
  inputSpread: 2.4,
  outputSpread: 4.4,
  offsetX: -0.35,
  yaw: 18,
  pitch: 6,
  distance: 11.5,
  fov: 34,
  pointSize: 0.42,
  outputSize: 0.3,
  linkDensity: 0.5,
  linkOpacity: 0.45,
  plates: true,
  plateDots: 9,
  plateDotSize: 0.09,
  plateOpacity: 0.5,
  plateMargin: 0.35,
  colorFront: '#4ade80',
  colorBack: '#38bdf8',
  fog: 0.45,
  motion: 'fixed' as NetworkMotion,
  motionAmount: 0.35,
  requestEvery: 1.2,
  attackEvery: 15,
  showWall: false,
  seed: 7,
}
export type NetworkSettings = typeof NETWORK_DEFAULTS

/**
 * The hero network, as tuned on 2026-10-27 (the tuner's « Réglage conseillé »):
 * request → embedding → input filter → model → output filter → portfolio.
 */
export const HERO_NETWORK: NetworkSettings = {
  ...NETWORK_DEFAULTS,
  inputs: 3,
  embedding: true,
  embedSize: 8,
  embedDepth: 3,
  embedSpread: 2.4,
  guards: 'two',
  guardRows: 2,
  guardDepth: 2,
  hiddenLayers: 3,
  rows: 3,
  depth: 3,
  linkDensity: 0.4,
  linkOpacity: 0.3,
  /** Wider than tuned (1.05) since the outputs lost their labels: room for the captions on one line. */
  gapX: 1.3,
  /** 5 outputs, about as far apart as the 7 of the tuned 5. */
  outputSpread: 3.4,
  inputSpread: 2.2,
  /** Centred (B, 2026-10-27): the network keeps to its half of the hero. */
  offsetX: 0,
  distance: 14.8,
  plateDots: 12,
  plateDotSize: 0.075,
  plateOpacity: 0.6,
  yaw: 1,
  requestEvery: 3,
  attackEvery: 5,
  /** A light tilt toward the cursor, only while it is over the network (±4° turn, ±2° tilt). */
  motion: 'pointer',
  motionAmount: 0.2,
}

/** Changing one of these rebuilds the scene; the rest is applied every frame. */
export const NETWORK_STRUCTURE: Array<keyof NetworkSettings> = [
  'inputs', 'hiddenLayers', 'rows', 'depth', 'guardRows', 'guardDepth', 'guards', 'embedding', 'embedSize', 'embedDepth', 'embedSpread', 'embedPlate', 'gapX', 'gapY', 'gapZ',
  'inputSpread', 'outputSpread', 'offsetX', 'linkDensity', 'plates', 'plateDots', 'plateMargin', 'seed',
]

// Column captions (2026-10-27). The inputs carry no name: only an attack shows its own (« prompt injection »).
export const NETWORK_LABELS = { input: 'Requête', embed: 'Embedding', model: 'Modèle', guard: 'Garde-fous', output: 'Portfolio' }
// ── Graph ───────────────────────────────────────────────────────────────────

export type NetworkNode = { pos: Vector3; layer: number; index: number; kind: 'input' | 'embed' | 'hidden' | 'guard' | 'output' }

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const column = (count: number, spread: number) => Array.from({ length: count }, (_, i) => (count > 1 ? spread / 2 - (spread * i) / (count - 1) : 0))
const centred = (count: number, gap: number) => Array.from({ length: count }, (_, i) => (i - (count - 1) / 2) * gap)

/** Builds node positions, links, plates, guard walls and captions for the given structure. */
export function buildGraph(s: NetworkSettings, outputs: number) {
  const two = s.guards === 'two'
  const kinds: NetworkNode['kind'][] = [
    'input',
    ...(s.embedding ? ['embed' as const] : []),
    ...(two ? ['guard' as const] : []),
    ...Array<NetworkNode['kind']>(s.hiddenLayers).fill('hidden'),
    'guard',
    'output',
  ]
  const xs = centred(kinds.length, s.gapX).map((x) => x + s.offsetX)
  const guardDepth = s.guardDepth
  const layers: NetworkNode[][] = kinds.map((kind, layer) => {
    const x = xs[layer]!
    const positions =
      kind === 'input'
        ? column(s.inputs, s.inputSpread).map((y) => new Vector3(x, y, 0))
        : kind === 'embed'
          ? column(s.embedSize, s.embedSpread).flatMap((y) => centred(s.embedDepth, s.gapZ * 0.6).map((z) => new Vector3(x, y, z)))
          : kind === 'hidden'
            ? centred(s.rows, s.gapY).flatMap((y) => centred(s.depth, s.gapZ).map((z) => new Vector3(x, -y, z)))
            : kind === 'guard'
              ? centred(s.guardRows, s.gapY).flatMap((y) => centred(guardDepth, s.gapZ).map((z) => new Vector3(x, -y, z)))
              : column(outputs, s.outputSpread).map((y) => new Vector3(x, y, 0))
    return positions.map((pos, index) => ({ pos, layer, index, kind }))
  })

  // Links between neighbouring columns. Every node keeps at least one link in and one out (no
  // floating neuron, every section reachable); the density then decides how many of the others show.
  const rand = mulberry32(s.seed)
  const edges: Array<{ a: NetworkNode; b: NetworkNode; w: number }> = []
  for (let l = 0; l < layers.length - 1; l++) {
    const from = layers[l]!
    const to = layers[l + 1]!
    // Embedding is a lookup, not a mix: with one vector per input, each input feeds only its own vector.
    if (from[0]!.kind === 'input' && to[0]!.kind === 'embed' && s.embedDepth === s.inputs) {
      from.forEach((a, i) => to.forEach((b, j) => j % s.embedDepth === i && edges.push({ a, b, w: 0.5 + rand() * 0.5 })))
      continue
    }
    const keep = new Set<string>()
    const add = (i: number, j: number) => keep.add(`${i}-${j}`)
    from.forEach((_, i) => add(i, Math.floor(rand() * to.length)))
    to.forEach((_, j) => add(Math.floor(rand() * from.length), j))
    from.forEach((a, i) =>
      to.forEach((b, j) => {
        const w = rand()
        if (keep.has(`${i}-${j}`) || w < s.linkDensity) edges.push({ a, b, w })
      }),
    )
  }

  // Dot-matrix plates behind the model layers, in their y–z plane.
  const plates: Array<{ x: number; h: number; d: number }> = []
  if (s.plates)
    kinds.forEach((k, l) => {
      if (k === 'hidden') plates.push({ x: xs[l]!, h: (s.rows - 1) * s.gapY + s.plateMargin * 2, d: (s.depth - 1) * s.gapZ + s.plateMargin * 2 })
      // The embedding is a table of vectors: its plate is as tall as the vector and as deep as the vectors side by side.
      if (k === 'embed' && s.embedPlate)
        plates.push({ x: xs[l]!, h: s.embedSpread + s.plateMargin * 2, d: Math.max(0.3, (s.embedDepth - 1) * s.gapZ * 0.6) + s.plateMargin * 2 })
    })
  const walls = kinds.flatMap((k, l) =>
    k === 'guard'
      ? [{ layer: l, x: xs[l]!, h: Math.max(1, s.guardRows - 1) * s.gapY + s.plateMargin * 2 + 0.6, d: Math.max(1, guardDepth - 1) * s.gapZ + s.plateMargin * (two ? 1 : 2) }]
      : [],
  )

  // Captions under the columns; the model gets one caption centred under its layers.
  const t = NETWORK_LABELS
  const hiddenXs = xs.filter((_, l) => kinds[l] === 'hidden')
  const captions: Array<{ x: number; text: string; accent?: boolean; main?: boolean }> = []
  kinds.forEach((k, l) => {
    if (k === 'input') captions.push({ x: xs[l]!, text: t.input })
    if (k === 'embed') captions.push({ x: xs[l]!, text: t.embed })
    if (k === 'guard') captions.push({ x: xs[l]!, text: t.guard, accent: true })
    // The portfolio is where every answer lands: its caption stands out.
    if (k === 'output') captions.push({ x: xs[l]!, text: t.output, main: true })
    if (k === 'hidden' && xs[l] === hiddenXs[0]) captions.push({ x: (hiddenXs[0]! + hiddenXs.at(-1)!) / 2, text: t.model })
  })
  return { layers, all: layers.flat(), edges, plates, walls, captions }
}

export type NetworkGraph = ReturnType<typeof buildGraph>
