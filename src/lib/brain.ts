// The hero brain: graph layout, pseudo-3D projection and the timeline of one answer.
// Pure functions, used by the chat (sections/Assistant) and the hero network, tested in brain.test.ts.
import type { AnswerSource, BrainNodeId } from '../content/assistant'

export type Vec3 = { x: number; y: number; z: number }
export type GraphNode = { kind: 'input' | 'output' | 'hidden' | 'section'; pos: Vec3; section?: BrainNodeId }

export type BrainGraph = {
  nodes: GraphNode[]
  /** [from, to, weight 0–1]: the weight sets how bright the link is at rest, like a trained network. */
  edges: Array<[number, number, number]>
  input: number
  output: number
  /** Hidden layers, left to right; each a 3×3 grid in depth. */
  hidden: number[][]
  /** Node index of each section, in the order given to buildGraph. */
  sections: number[]
}

/** Stable pseudo-random weight of a link, so the network looks the same on every visit. */
const weight = (a: number, b: number) => {
  const x = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453
  return x - Math.floor(x)
}

/** Graph width in model units: from the Question/Answer column to the sections. */
const LEFT_X = -1
const RIGHT_X = 1
const HIDDEN_X = [-0.5, 0, 0.5]

/** Question and Answer on the left, three hidden layers as 3×3 grids in depth, the sections (what the assistant knows) on the right. */
export function buildGraph(sectionIds: BrainNodeId[]): BrainGraph {
  const nodes: GraphNode[] = []
  const add = (n: GraphNode) => nodes.push(n) - 1
  const input = add({ kind: 'input', pos: { x: LEFT_X, y: 0.42, z: 0 } })
  const output = add({ kind: 'output', pos: { x: LEFT_X, y: -0.42, z: 0 } })
  // The middle layer is a little taller: the network bulges like the former 3D one.
  const grid = (x: number, h: number) => [h, 0, -h].flatMap((y) => [-0.38, 0, 0.38].map((z) => ({ x, y, z })))
  const hidden = HIDDEN_X.map((x, i) => grid(x, i === 1 ? 0.78 : 0.66).map((pos) => add({ kind: 'hidden', pos })))
  const n = sectionIds.length
  const sections = sectionIds.map((section, i) =>
    add({ kind: 'section', section, pos: { x: RIGHT_X, y: n > 1 ? 0.92 - (1.84 * i) / (n - 1) : 0, z: 0 } }),
  )

  const edges: Array<[number, number, number]> = []
  const link = (a: number, b: number) => edges.push([a, b, weight(a, b)])
  for (const h of hidden[0]!) {
    link(input, h)
    link(h, output)
  }
  for (let l = 0; l < hidden.length - 1; l++) for (const a of hidden[l]!) for (const b of hidden[l + 1]!) link(a, b)
  for (const h of hidden.at(-1)!) for (const s of sections) link(h, s)
  return { nodes, edges, input, output, hidden, sections }
}

export type View = {
  yaw: number
  pitch: number
  width: number
  height: number
  /** Pixels kept free right of the section nodes for their labels. */
  labelRoom?: number
  /** And left of the Question and Answer nodes. */
  leftRoom?: number
}
export type Projected = { x: number; y: number; /** perspective factor, > 1 when closer */ k: number; z: number }

const CAMERA = 3.4

/** Rotates around the graph's centre, then a simple perspective; the graph is stretched to the free width. */
export function project(p: Vec3, { yaw, pitch, width, height, labelRoom = 125, leftRoom = 24 }: View): Projected {
  const x0 = p.x - (LEFT_X + RIGHT_X) / 2
  const cy = Math.cos(yaw)
  const sy = Math.sin(yaw)
  const x1 = x0 * cy + p.z * sy
  const z1 = -x0 * sy + p.z * cy
  const cp = Math.cos(pitch)
  const sp = Math.sin(pitch)
  const y2 = p.y * cp - z1 * sp
  const z2 = p.y * sp + z1 * cp
  const k = CAMERA / (CAMERA - z2)
  // Half the graph's width after rotation, with a margin for perspective.
  const half = ((RIGHT_X - LEFT_X) / 2) * cy * 1.08
  const scaleX = Math.max(0, (width - labelRoom - leftRoom) / (2 * half))
  const scaleY = Math.min(height * 0.42, scaleX * 1.9)
  const cx = leftRoom + half * scaleX
  return { x: cx + x1 * k * scaleX, y: height * 0.5 - y2 * k * scaleY, k, z: z2 }
}

// ── Timeline of one answer ──────────────────────────────────────────────────

export type Phase = 'question' | 'search' | 'write' | 'done'

export const QUESTION_MS = 1000
export const SEARCH_MS = 1500
/** Writing time follows the answer's length, within bounds. */
export const writeMs = (chars: number) => Math.min(4200, Math.max(1600, chars * 12))
export const runDuration = (chars: number) => QUESTION_MS + SEARCH_MS + writeMs(chars)

export type Run = { startedAt: number; chars: number; lit: BrainNodeId[] }
export type RunState = { phase: Phase; /** 0–1 within the phase */ progress: number; /** characters of the answer shown */ shown: number }

export function runState(run: Pick<Run, 'startedAt' | 'chars'>, now: number): RunState {
  const t = now - run.startedAt
  const write = writeMs(run.chars)
  if (t < QUESTION_MS) return { phase: 'question', progress: Math.max(0, t) / QUESTION_MS, shown: 0 }
  if (t < QUESTION_MS + SEARCH_MS) return { phase: 'search', progress: (t - QUESTION_MS) / SEARCH_MS, shown: 0 }
  if (t < QUESTION_MS + SEARCH_MS + write) {
    const progress = (t - QUESTION_MS - SEARCH_MS) / write
    return { phase: 'write', progress, shown: Math.floor(progress * run.chars) }
  }
  return { phase: 'done', progress: 1, shown: run.chars }
}

/** The brain nodes an answer draws on: a project lights Projets, a credential Certifications. */
export function litNodes(sources: AnswerSource[]): BrainNodeId[] {
  const ids = sources.map((s) => (s.kind === 'section' ? s.node : s.kind === 'project' ? 'projects' : 'certifications'))
  return [...new Set(ids)]
}

export type Route = { path: number[]; /** a section looked at and not used */ probe?: boolean }

/** The paths pulses follow in each phase. Deterministic, so the same answer always plays the same way. */
export function routes(g: BrainGraph, phase: Phase, lit: BrainNodeId[]): Route[] {
  const h = (layer: number, i: number) => g.hidden[layer]![i % g.hidden[layer]!.length]!
  const sectionOf = (id: BrainNodeId) => g.sections.find((s) => g.nodes[s]!.section === id)
  const litIdx = lit.map(sectionOf).filter((s): s is number => s !== undefined)
  switch (phase) {
    case 'question':
      return [
        { path: [g.input, h(0, 1), h(1, 4), h(2, 1)] },
        { path: [g.input, h(0, 4), h(1, 3), h(2, 4)] },
        { path: [g.input, h(0, 7), h(1, 5), h(2, 7)] },
      ]
    case 'search': {
      const probe = g.sections.find((s) => !litIdx.includes(s))
      return [
        ...litIdx.flatMap((s, i) => [{ path: [h(2, i), s] }, { path: [h(2, i + 4), s] }]),
        ...(probe === undefined ? [] : [{ path: [h(2, 8), probe], probe: true }]),
      ]
    }
    case 'write':
      return litIdx.map((s, i) => ({ path: [s, h(2, i + 2), h(1, i + 4), h(0, i + 3), g.output] }))
    case 'done':
      return []
  }
}

/** An idle pulse: from the question node to a section, picked by `seed` (0–1). */
export function idleRoute(g: BrainGraph, seed: number): Route {
  const pick = (list: number[], s: number) => list[Math.floor(s * list.length) % list.length]!
  return {
    path: [g.input, ...g.hidden.map((layer, i) => pick(layer, (seed * (3 + i * 4)) % 1)), pick(g.sections, (seed * 17) % 1)],
  }
}

export const edgeKey = (a: number, b: number) => (a < b ? `${a}-${b}` : `${b}-${a}`)
