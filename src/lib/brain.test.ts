import { describe, expect, it } from 'vitest'
import { brainNodes } from '../content/assistant'
import { buildGraph, edgeKey, idleRoute, litNodes, project, QUESTION_MS, routes, runDuration, runState, SEARCH_MS, type Phase } from './brain'

const ids = brainNodes.map((n) => n.id)
const g = buildGraph(ids)
const edges = new Set(g.edges.map(([a, b]) => edgeKey(a, b)))
const followsEdges = (path: number[]) => path.every((n, i) => i === 0 || edges.has(edgeKey(path[i - 1]!, n)))

describe('brain graph', () => {
  it('has one node per section, in order', () => {
    expect(g.sections.map((s) => g.nodes[s]!.section)).toEqual(ids)
  })

  it('projects closer points bigger', () => {
    const view = { yaw: 0, pitch: 0, width: 500, height: 500 }
    const near = project({ x: 0, y: 0, z: 0.4 }, view)
    const far = project({ x: 0, y: 0, z: -0.4 }, view)
    expect(near.k).toBeGreaterThan(far.k)
  })
})

describe('answer timeline', () => {
  const run = { startedAt: 1000, chars: 200 }

  it('goes question → search → write → done', () => {
    expect(runState(run, 1000).phase).toBe('question')
    expect(runState(run, 1000 + QUESTION_MS).phase).toBe('search')
    expect(runState(run, 1000 + QUESTION_MS + SEARCH_MS).phase).toBe('write')
    expect(runState(run, 1000 + runDuration(200))).toEqual({ phase: 'done', progress: 1, shown: 200 })
  })

  it('reveals the answer while writing, never past its length', () => {
    const mid = runState(run, 1000 + QUESTION_MS + SEARCH_MS + 100)
    expect(mid.shown).toBeGreaterThan(0)
    expect(mid.shown).toBeLessThan(200)
  })

  it('lights the sections an answer comes from, once each', () => {
    expect(
      litNodes([
        { kind: 'project', slug: 'blocktrader' },
        { kind: 'project', slug: 'argos' },
        { kind: 'credential', id: 'ibm-ai-developer' },
        { kind: 'section', node: 'lab' },
      ]),
    ).toEqual(['projects', 'certifications', 'lab'])
  })

  it('moves pulses along real edges only', () => {
    const phases: Phase[] = ['question', 'search', 'write', 'done']
    for (const phase of phases) for (const r of routes(g, phase, ['lab', 'certifications'])) expect(followsEdges(r.path), phase).toBe(true)
    for (const seed of [0, 0.13, 0.5, 0.99]) expect(followsEdges(idleRoute(g, seed).path)).toBe(true)
  })

  it('probes one unused section while searching', () => {
    const search = routes(g, 'search', ['lab'])
    expect(search.filter((r) => r.probe)).toHaveLength(1)
    expect(g.nodes[search.find((r) => r.probe)!.path.at(-1)!]!.section).not.toBe('lab')
  })
})
