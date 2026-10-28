import { describe, expect, it } from 'vitest'
import { litNodes, QUESTION_MS, runDuration, runState, SEARCH_MS } from './brain'

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
})
