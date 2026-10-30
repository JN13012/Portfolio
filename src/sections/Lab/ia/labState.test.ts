import { describe, expect, it } from 'vitest'
import { aiLabLevels, defenseStages } from '../../../content/aiLab'
import { demoFlag, demoResult, demoScenarios } from '../../../../dev/mockups/aiLabFixtures'
import { initialLabState, labReducer } from './labState'

describe('Lab IA development contract', () => {
  it('keeps future levels locked, validates without duplicate progress and preserves history across levels', () => {
    expect(labReducer(initialLabState, { type: 'level', level: 3 })).toBe(initialLabState)
    let state = labReducer(initialLabState, { type: 'draft', value: 'Une demande' })
    state = labReducer(state, { type: 'attempt', prompt: 'Une demande', result: demoResult(1, 'response', 1) })
    expect(state.draft).toBe('')
    state = labReducer(state, { type: 'validate-demo', correct: false })
    expect(state.completed).toEqual([])
    expect(state.validation).toBe('incorrect')
    state = labReducer(state, { type: 'validate-demo', correct: true })
    state = labReducer(state, { type: 'validate-demo', correct: true })
    expect(state.completed).toEqual([1])
    state = labReducer(state, { type: 'level', level: 2 })
    expect(state.level).toBe(2)
    expect(state.attempts).toHaveLength(1)
    state = labReducer(state, { type: 'level', level: 1 })
    expect(state.attempts[0]?.prompt).toBe('Une demande')
  })

  it('ignores blank prompts and results for another level; bounds the local conversation', () => {
    expect(labReducer(initialLabState, { type: 'attempt', prompt: ' ', result: demoResult(1, 'response', 1) })).toBe(initialLabState)
    expect(labReducer(initialLabState, { type: 'attempt', prompt: 'test', result: demoResult(2, 'response', 1) })).toBe(initialLabState)
    let state = initialLabState
    for (let n = 1; n <= 25; n++) state = labReducer(state, { type: 'attempt', prompt: `test ${n}`, result: demoResult(1, 'response', n) })
    expect(state.attempts).toHaveLength(20)
    expect(state.attempts[0]?.result.id).toBe(6)
  })

  it('has a complete ordered trace and never executes a stage after a stop, for every available fixture', () => {
    for (const level of aiLabLevels) {
      for (const scenario of demoScenarios) {
        if (scenario.fromLevel > level.id) {
          expect(() => demoResult(level.id, scenario.id, 1)).toThrow()
          continue
        }
        const result = demoResult(level.id, scenario.id, 1)
        expect(result.trace.map(entry => entry.stage)).toEqual(defenseStages.map(stage => stage.id))
        let stopped = false
        result.trace.forEach((entry, index) => {
          if (defenseStages[index]!.fromLevel > level.id) expect(entry.status).toBe('inactive')
          else if (stopped) expect(entry.status).toBe('not-run')
          if (entry.status === 'blocked' || entry.status === 'error') stopped = true
        })
        if (result.outcome === 'blocked' || result.outcome === 'error' || result.outcome === 'quota') expect(result.answer).toBeUndefined()
        if (scenario.id === 'leak') expect(result.answer).toContain(demoFlag(level.id))
      }
    }
  })

  it('distinguishes a refusal, a technical error and unavailable budget from guardrail blocks', () => {
    expect(demoResult(5, 'refusal', 1).outcome).toBe('refused')
    expect(demoResult(5, 'refusal', 1).trace.every(entry => entry.status === 'passed')).toBe(true)
    expect(demoResult(5, 'judge-error', 1).outcome).toBe('error')
    expect(demoResult(5, 'quota', 1).outcome).toBe('quota')
    expect(demoResult(5, 'input-block', 1).outcome).toBe('blocked')
  })

  it('can explore all five levels, without claiming server-side validation', () => {
    let state = initialLabState
    for (const level of aiLabLevels) {
      state = labReducer(state, { type: 'level', level: level.id })
      expect(state.level).toBe(level.id)
      state = labReducer(state, { type: 'validate-demo', correct: true })
    }
    expect(state.completed).toEqual([1, 2, 3, 4, 5])
    expect(JSON.stringify(aiLabLevels)).not.toContain('DEMO{')
  })
})
